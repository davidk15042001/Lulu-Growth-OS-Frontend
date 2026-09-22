import { requestApi } from "./client";
import { workspaceApiPath } from "./types";

export type VoiceSettings = {
  language: string;
  voice: string;
  speed: number;
  mode: "conversation" | "dictation";
};

export type VoiceSessionResponse = {
  session: {
    id: string;
    status: string;
    transport: "webrtc" | "browser_fallback";
    provider: string;
    language: string;
    voice: string;
    speed: string;
  } | null;
  transport: "webrtc" | "browser_fallback";
  provider: string;
  sdpAnswer: string | null;
};

export const voiceApi = {
  createSession: (workspaceId: string, input: VoiceSettings & { conversationId?: string | null; sdp?: string | null; clientSessionId?: string | null; metadata?: Record<string, unknown> }) => requestApi<VoiceSessionResponse>({
    path: workspaceApiPath(workspaceId, "/ai/voice/sessions"),
    method: "POST",
    body: input,
  }),
  addTranscript: (workspaceId: string, sessionId: string, input: {
    clientEventId?: string | null;
    direction: "input" | "output";
    content: string;
    sequenceNumber: number;
    isFinal?: boolean;
    source: "realtime" | "browser_fallback" | "server_tts" | "browser_tts";
    startedAt?: string | null;
    endedAt?: string | null;
    metadata?: Record<string, unknown>;
  }) => requestApi<Record<string, unknown>>({
    path: workspaceApiPath(workspaceId, `/ai/voice/sessions/${encodeURIComponent(sessionId)}/transcripts`),
    method: "POST",
    body: input,
  }),
  closeSession: (workspaceId: string, sessionId: string, input: { status?: "completed" | "failed"; metadata?: Record<string, unknown> }) => requestApi<Record<string, unknown>>({
    path: workspaceApiPath(workspaceId, `/ai/voice/sessions/${encodeURIComponent(sessionId)}/close`),
    method: "POST",
    body: input,
  }),
  speech: (workspaceId: string, input: { sessionId?: string | null; requestId?: string | null; text: string; language: string; voice: string; speed: number }) => requestApi<{
    responseId: string;
    contentType: string;
    audioBase64: string;
    billed: boolean;
  }>({
    path: workspaceApiPath(workspaceId, "/ai/voice/speech"),
    method: "POST",
    body: input,
  }),
  getSession: (workspaceId: string, sessionId: string) => requestApi<{ session: Record<string, unknown> }>({
    path: workspaceApiPath(workspaceId, `/ai/voice/sessions/${encodeURIComponent(sessionId)}`),
    method: "GET",
  }),
  deleteSession: (workspaceId: string, sessionId: string) => requestApi<{ id: string; deleted: boolean }>({
    path: workspaceApiPath(workspaceId, `/ai/voice/sessions/${encodeURIComponent(sessionId)}`),
    method: "DELETE",
  }),
};
