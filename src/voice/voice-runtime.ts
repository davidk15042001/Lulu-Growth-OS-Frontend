import { voiceApi, type VoiceSettings } from "../api/voice";

export type VoiceRuntimeTranscript = {
  text: string;
  isFinal: boolean;
  source: "realtime";
};

type VoiceRuntimeOptions = {
  workspaceId: string;
  conversationId: string | null;
  settings: VoiceSettings;
  onTranscript: (transcript: VoiceRuntimeTranscript) => void;
  onSpeechStart: () => void;
  onSpeechStop: () => void;
  onError: (message: string) => void;
};

const RMS_THRESHOLD = 0.045;
const SPEECH_HANGOVER_MS = 280;

type VoiceActivityMonitorOptions = {
  onSpeechStart: () => void;
  onSpeechStop?: () => void;
};

export class VoiceActivityMonitor {
  private readonly options: VoiceActivityMonitorOptions;
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private timer: number | null = null;
  private active = false;
  private belowSince = 0;
  private stopped = false;

  constructor(options: VoiceActivityMonitorOptions) {
    this.options = options;
  }

  async start() {
    if (!navigator.mediaDevices?.getUserMedia || typeof window.AudioContext === "undefined") return false;
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      this.audioContext = new window.AudioContext();
      await this.audioContext.resume().catch(() => undefined);
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 1024;
      source.connect(this.analyser);
      const samples = new Uint8Array(this.analyser.fftSize);
      const poll = () => {
        if (this.stopped || !this.analyser) return;
        this.analyser.getByteTimeDomainData(samples);
        let sum = 0;
        for (const sample of samples) {
          const normalized = (sample - 128) / 128;
          sum += normalized * normalized;
        }
        const rms = Math.sqrt(sum / samples.length);
        const now = performance.now();
        if (rms >= RMS_THRESHOLD) {
          this.belowSince = 0;
          if (!this.active) {
            this.active = true;
            this.options.onSpeechStart();
          }
        } else if (this.active) {
          this.belowSince ||= now;
          if (now - this.belowSince >= SPEECH_HANGOVER_MS) {
            this.active = false;
            this.belowSince = 0;
            this.options.onSpeechStop?.();
          }
        }
        this.timer = window.setTimeout(poll, 50);
      };
      poll();
      return true;
    } catch {
      await this.stop();
      return false;
    }
  }

  async stop() {
    this.stopped = true;
    if (this.timer !== null) window.clearTimeout(this.timer);
    this.timer = null;
    this.mediaStream?.getTracks().forEach((track) => track.stop());
    await this.audioContext?.close().catch(() => undefined);
    this.mediaStream = null;
    this.audioContext = null;
    this.analyser = null;
    this.active = false;
    this.belowSince = 0;
  }
}

export class VoiceRealtimeRuntime {
  private readonly options: VoiceRuntimeOptions;
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private vadTimer: number | null = null;
  private speechActive = false;
  private speechBelowSince = 0;
  private sessionId: string | null = null;
  private stopped = false;

  constructor(options: VoiceRuntimeOptions) {
    this.options = options;
  }

  get id() {
    return this.sessionId;
  }

  async start() {
    if (!navigator.mediaDevices?.getUserMedia || typeof RTCPeerConnection === "undefined") return false;
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      this.peerConnection = new RTCPeerConnection();
      this.mediaStream.getTracks().forEach((track) => this.peerConnection?.addTrack(track, this.mediaStream!));
      this.dataChannel = this.peerConnection.createDataChannel("lulu-events");
      this.dataChannel.onmessage = (event) => this.handleProviderEvent(event.data);
      this.dataChannel.onerror = () => this.options.onError("Realtime voice lost its connection. Lulu switched to browser fallback.");
      this.peerConnection.onconnectionstatechange = () => {
        const state = this.peerConnection?.connectionState;
        if (state === "failed" || state === "disconnected") this.options.onError("Realtime voice lost its connection. Lulu switched to browser fallback.");
      };
      this.peerConnection.ontrack = (event) => {
        const audio = new Audio();
        audio.autoplay = true;
        audio.srcObject = event.streams[0] ?? null;
      };

      this.startLocalVad();
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      const response = await voiceApi.createSession(this.options.workspaceId, {
        ...this.options.settings,
        conversationId: this.options.conversationId,
        sdp: offer.sdp ?? null,
        metadata: { source: "office_voice", localVad: true, echoCancellation: true },
      });
      this.sessionId = response.data.session?.id ?? null;
      if (response.data.transport !== "webrtc" || !response.data.sdpAnswer || !response.data.session?.id) {
        const fallbackSessionId = this.sessionId;
        await this.stop(false);
        if (fallbackSessionId) {
          await voiceApi.closeSession(this.options.workspaceId, fallbackSessionId, {
            status: "failed",
            metadata: { fallback: true, reason: "realtime_unavailable" },
          }).catch(() => undefined);
        }
        return false;
      }
      await this.peerConnection.setRemoteDescription({ type: "answer", sdp: response.data.sdpAnswer });
      return true;
    } catch {
      await this.stop(false);
      return false;
    }
  }

  private handleProviderEvent(raw: unknown) {
    let event: Record<string, unknown>;
    try {
      event = typeof raw === "string" ? JSON.parse(raw) as Record<string, unknown> : raw as Record<string, unknown>;
    } catch {
      return;
    }
    const type = String(event.type ?? "");
    if (type === "conversation.item.input_audio_transcription.delta") {
      const delta = typeof event.delta === "string" ? event.delta : "";
      if (delta) this.options.onTranscript({ text: delta, isFinal: false, source: "realtime" });
      return;
    }
    if (type === "conversation.item.input_audio_transcription.completed") {
      const transcript = typeof event.transcript === "string" ? event.transcript.trim() : "";
      if (transcript) this.options.onTranscript({ text: transcript, isFinal: true, source: "realtime" });
      return;
    }
    if (type === "input_audio_buffer.speech_started") {
      this.options.onSpeechStart();
      return;
    }
    if (type === "input_audio_buffer.speech_stopped") {
      this.options.onSpeechStop();
      return;
    }
    if (type === "error") this.options.onError("Realtime voice returned a recoverable provider error. Lulu switched to browser fallback.");
  }

  private startLocalVad() {
    if (!this.mediaStream) return;
    this.audioContext = new AudioContext();
    const source = this.audioContext.createMediaStreamSource(this.mediaStream);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 1024;
    source.connect(this.analyser);
    const samples = new Uint8Array(this.analyser.fftSize);
    const poll = () => {
      if (this.stopped || !this.analyser) return;
      this.analyser.getByteTimeDomainData(samples);
      let sum = 0;
      for (const sample of samples) {
        const normalized = (sample - 128) / 128;
        sum += normalized * normalized;
      }
      const rms = Math.sqrt(sum / samples.length);
      const now = performance.now();
      if (rms >= RMS_THRESHOLD) {
        this.speechBelowSince = 0;
        if (!this.speechActive) {
          this.speechActive = true;
          this.options.onSpeechStart();
        }
      } else if (this.speechActive) {
        this.speechBelowSince ||= now;
        if (now - this.speechBelowSince >= SPEECH_HANGOVER_MS) {
          this.speechActive = false;
          this.speechBelowSince = 0;
          this.options.onSpeechStop();
        }
      }
      this.vadTimer = window.setTimeout(poll, 50);
    };
    poll();
  }

  async stop(closeServerSession = true) {
    this.stopped = true;
    if (this.vadTimer !== null) window.clearTimeout(this.vadTimer);
    this.vadTimer = null;
    this.dataChannel?.close();
    this.peerConnection?.close();
    this.mediaStream?.getTracks().forEach((track) => track.stop());
    await this.audioContext?.close().catch(() => undefined);
    const sessionId = this.sessionId;
    this.dataChannel = null;
    this.peerConnection = null;
    this.mediaStream = null;
    this.audioContext = null;
    this.analyser = null;
    this.sessionId = null;
    if (closeServerSession && sessionId) await voiceApi.closeSession(this.options.workspaceId, sessionId, { status: "completed" }).catch(() => undefined);
  }
}
