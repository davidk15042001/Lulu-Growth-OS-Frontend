import { useEffect, useRef, useState } from 'react';
import AgoraRTC, { type IAgoraRTCClient, type ICameraVideoTrack, type IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import { Camera, CameraOff, LoaderCircle, Mic, MicOff, PhoneOff, Video } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { calendarApi } from '../../api/calendar';
import { getFriendlyErrorMessage } from '../../api/client';
import { useTranslation } from '../../i18n/GlobalLanguageSwitcher';

// Tokens are minted by the backend; the Agora certificate never reaches this client.
// REST credentials are likewise server-only and are never bundled here.

export default function CalendarMeetingPage() {
  const { token = '' } = useParams<{ token: string }>();
  const t = useTranslation();
  const [name, setName] = useState('');
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [title, setTitle] = useState('Lulu meeting');
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const audioRef = useRef<IMicrophoneAudioTrack | null>(null);
  const videoRef = useRef<ICameraVideoTrack | null>(null);
  const videoContainer = useRef<HTMLDivElement | null>(null);

  async function join() {
    if (!token || !name.trim()) { setError(t('Enter your name to join the meeting.')); return; }
    setLoading(true); setError(null);
    try {
      const result = await calendarApi.createGuestAgoraToken(token, name.trim());
      setTitle(result.data.event.title);
      const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      clientRef.current = client;
      client.on('user-published', async (user, mediaType) => { await client.subscribe(user, mediaType); if (mediaType === 'video' && user.videoTrack) user.videoTrack.play(videoContainer.current!); if (mediaType === 'audio' && user.audioTrack) user.audioTrack.play(); });
      client.on('user-unpublished', (user, mediaType) => { if (mediaType === 'video') user.videoTrack?.stop(); });
      await client.join(result.data.appId, result.data.channelName, result.data.token, result.data.userAccount);
      const [audio, video] = await AgoraRTC.createMicrophoneAndCameraTracks();
      audioRef.current = audio; videoRef.current = video;
      video.play(videoContainer.current!);
      await client.publish([audio, video]);
      setJoined(true);
    } catch (cause) { setError(getFriendlyErrorMessage(cause, t('The meeting could not be joined.'))); }
    finally { setLoading(false); }
  }
  async function leave() {
    audioRef.current?.close(); videoRef.current?.close(); await clientRef.current?.leave(); clientRef.current = null; setJoined(false); setMuted(false); setCameraOff(false);
  }
  useEffect(() => () => { void leave(); }, []);
  async function toggleMute() { const next = !muted; await audioRef.current?.setEnabled(!next); setMuted(next); }
  async function toggleCamera() { const next = !cameraOff; await videoRef.current?.setEnabled(!next); setCameraOff(next); }

  return <main className="calendar-meeting-page"><div className="calendar-meeting-shell"><header><div className="calendar-meeting-brand"><span><Video size={20} /></span><div><strong>Lulu Intelligence</strong><small>{t('Secure customer meeting')}</small></div></div>{joined && <span className="calendar-meeting-live">{t('Live')}</span>}</header><section className="calendar-meeting-content"><div className="calendar-meeting-video" ref={videoContainer}>{!joined && <div className="calendar-meeting-placeholder"><Video size={42} /><h1>{title}</h1><p>{t('Join securely without creating an account.')}</p></div>}</div>{error && <div className="calendar-meeting-error" role="alert">{error}</div>}{!joined ? <div className="calendar-meeting-join"><label>{t('Your name')}<input value={name} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void join(); }} autoFocus placeholder={t('e.g. Li Wei')} /></label><button type="button" className="calendar-button" disabled={loading} onClick={() => void join()}>{loading ? <LoaderCircle className="spin" size={17} /> : <Video size={17} />}{t('Join meeting')}</button></div> : <div className="calendar-meeting-controls"><button type="button" onClick={() => void toggleMute()} aria-label={muted ? t('Unmute microphone') : t('Mute microphone')}>{muted ? <MicOff /> : <Mic />}</button><button type="button" onClick={() => void toggleCamera()} aria-label={cameraOff ? t('Turn camera on') : t('Turn camera off')}>{cameraOff ? <CameraOff /> : <Camera />}</button><button type="button" className="hangup" onClick={() => void leave()} aria-label={t('Leave meeting')}><PhoneOff /></button></div>}</section></div></main>;
}
