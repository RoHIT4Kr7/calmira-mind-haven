import React, { useState, useRef, useEffect } from "react";
import { Send, PlugZap, Mic, Volume2 } from "lucide-react";
import { VoiceAgentClient, createVoiceAgent } from "./VoiceAgentClient";
import { api, authHeader, API_BASE_URL } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface VoiceInterfaceProps {
  contactDescription?: string;
  onConversationStart?: () => void;
  onConversationEnd?: () => void;
  backendUrl?: string;
}

type ConnectionStatus =
  | "disconnected"
  | "initializing"
  | "connecting"
  | "connected"
  | "error";

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  onConversationStart,
  onConversationEnd,
  backendUrl = API_BASE_URL.replace("/api/v1", ""),
}) => {
  const { token } = useAuth();
  // Connection and session state
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");
  const [sessionId, setSessionId] = useState<string | null>(null);

  // UX state
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wsError, setWsError] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState("");
  const [textInput, setTextInput] = useState("");

  // Capability gates from backend/live session
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  // Client handle
  const voiceClientRef = useRef<VoiceAgentClient | null>(null);

  useEffect(() => {
    return () => {
      if (voiceClientRef.current) voiceClientRef.current.disconnect();
    };
  }, []);

  const resetError = () => setWsError(null);

  // Explicit connect (always clears prior client to avoid stale sockets)
  const connectVoice = async () => {
    try {
      if (voiceClientRef.current) {
        voiceClientRef.current.disconnect();
        voiceClientRef.current = null;
      }

      setConnectionStatus("initializing");
      resetError();

      const newSessionId = `voice_session_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 9)}`;
      setSessionId(newSessionId);

      // First, call the start-session endpoint to create DB record with proper user_id
      try {
        await api.post(
          "/voice/start-session",
          {
            session_id: newSessionId,
            context: "voice_chat",
          },
          {
            headers: { ...authHeader(token) },
          }
        );
      } catch (error) {
        console.error("❌ Voice: Failed to initialize session:", error);
        console.warn(
          "Failed to initialize session in database, continuing with WebSocket:",
          error
        );
        // Continue anyway - WebSocket will create the DB record
      }

      setConnectionStatus("connecting");

      const vc = await createVoiceAgent(newSessionId, backendUrl, {
        onStatusChange: (status) => {
          if (status === "connected" || status === "setup_complete")
            setConnectionStatus("connected");
          if (status === "disconnected") {
            setConnectionStatus("disconnected");
            setIsRecording(false);
            setIsPlaying(false);
            setSessionReady(false);
          }
          if (status === "recording") setIsRecording(true);
          if (status === "stopped") setIsRecording(false);
        },
        onCapabilitiesChange: (caps) => {
          setAudioEnabled(caps.audioEnabled);
          setSessionReady(caps.sessionReady);
        },
        onResponse: (text) => {
          setAiResponse(text);
          setIsPlaying(false);
        },
        onAudioResponse: () => {
          setIsPlaying(true);
          // indicator only; actual playback is queued in the client
          setTimeout(() => setIsPlaying(false), 3000);
        },
        onError: (error) => {
          setWsError(error);
          setConnectionStatus("error");
          setIsRecording(false);
          setIsPlaying(false);
        },
        onTurnComplete: () => {
          // turn boundary; UI already updates via events
        },
      });

      voiceClientRef.current = vc;
      setConnectionStatus("connected");
      if (onConversationStart) onConversationStart();
    } catch (e) {
      setWsError(
        e instanceof Error ? e.message : "Failed to connect to voice service"
      );
      setConnectionStatus("error");
    }
  };

  // Hard stop: close WS + mic + reset UI (keeps button always useful)
  const stopAndClose = () => {
    if (voiceClientRef.current) {
      voiceClientRef.current.disconnect();
      voiceClientRef.current = null;
    }
    setConnectionStatus("disconnected");
    setIsRecording(false);
    setIsPlaying(false);
    setSessionId(null);
    setSessionReady(false);
    setAudioEnabled(false);
    setWsError(null);
    if (onConversationEnd) onConversationEnd();
  };

  // Start microphone recording only
  const startMic = async () => {
    if (!voiceClientRef.current) {
      await connectVoice();
    }
    if (!voiceClientRef.current) return;

    const caps = voiceClientRef.current.getCapabilities();
    if (!caps.audioEnabled || !sessionReady) {
      setWsError("Audio session not ready; try Connect again.");
      setConnectionStatus("error");
      return;
    }

    try {
      const status = voiceClientRef.current.getStatus();
      if (!status.isRecording) {
        await voiceClientRef.current.startRecording();
        setIsRecording(true);
      }
      resetError();
    } catch (err) {
      setWsError(
        err instanceof Error ? err.message : "Failed to start recording"
      );
      setConnectionStatus("error");
    }
  };

  const sendText = async () => {
    if (
      !textInput.trim() ||
      !voiceClientRef.current ||
      connectionStatus !== "connected"
    )
      return;
    try {
      await voiceClientRef.current.sendTextMessage(textInput);
      setTextInput("");
      resetError();
    } catch (e) {
      setWsError(e instanceof Error ? e.message : "Failed to send message");
    }
  };

  const connected = connectionStatus === "connected";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Main centered content */}
      <div className="flex flex-col items-center space-y-8 max-w-md mx-auto">
        {/* Status and session info at top */}
        {connected && (
          <div className="text-center space-y-2">
            <div className="text-white/60 text-sm">
              Session: {sessionId?.slice(-8)}
            </div>
            <div className="text-white/60 text-sm">
              {audioEnabled ? "Audio enabled" : "Audio: text-only"}
            </div>
          </div>
        )}

        {/* Large centered microphone with rings */}
        <div className="relative">
          {/* Main status text above mic */}
          <div className="text-center mb-8">
            <h2 className="text-white text-2xl font-semibold mb-2">
              {connectionStatus === "connected" && isRecording
                ? "Listening..."
                : connectionStatus === "connected" && !isRecording
                ? "Ready to Start"
                : connectionStatus === "connecting" ||
                  connectionStatus === "initializing"
                ? "Connecting..."
                : "Tap Connect, then Start to begin"}
            </h2>
            {connectionStatus === "connected" && isRecording && (
              <p className="text-white/70 text-base">
                Speak naturally, I'm here to listen
              </p>
            )}
            {connectionStatus === "connected" && !isRecording && (
              <p className="text-white/70 text-base">
                Tap the microphone to start a session
              </p>
            )}
          </div>

          {/* Large microphone button */}
          <div className="relative flex flex-col items-center justify-center space-y-6">
            <button
              className={[
                "relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300",
                connected && audioEnabled && sessionReady
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40"
                  : "bg-white/10 backdrop-blur-lg border border-white/20 cursor-not-allowed opacity-50",
              ].join(" ")}
              onClick={connected && !isRecording ? startMic : undefined}
              disabled={
                !connected || !audioEnabled || !sessionReady || isRecording
              }
              aria-label="Start Recording"
            >
              <Mic size={32} className="text-white" />

              {/* Animated rings for ready and recording states */}
              {connected && audioEnabled && sessionReady && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 rounded-full border-2 border-purple-400/40 animate-ping" />
                  <div
                    className="absolute inset-0 rounded-full border-2 border-purple-400/30 animate-ping"
                    style={{ animationDelay: "0.5s" }}
                  />
                  <div
                    className="absolute inset-0 rounded-full border-2 border-purple-400/20 animate-ping"
                    style={{ animationDelay: "1s" }}
                  />
                </div>
              )}
            </button>

            {/* Stop button - centered below microphone when recording */}
            {connected && isRecording && (
              <button
                className="w-12 h-12 bg-red-500 text-white rounded-lg flex items-center justify-center shadow-lg shadow-red-500/30 hover:shadow-red-500/40 transition-all duration-300 hover:bg-red-600"
                onClick={stopAndClose}
                aria-label="Stop Recording and Close Connection"
              >
                <div className="w-3 h-3 bg-white rounded-sm" />
              </button>
            )}
          </div>

          {/* Session ID display when connected */}
          {connected && sessionId && (
            <div className="text-center mt-6 text-white/50 text-sm">
              Session: {sessionId}
            </div>
          )}
        </div>

        {/* Connect button (shown when not connected) */}
        {!connected && (
          <div className="flex flex-col items-center space-y-4">
            <button
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
              onClick={connectVoice}
              disabled={
                connectionStatus === "connecting" ||
                connectionStatus === "initializing"
              }
            >
              <PlugZap size={20} className="inline mr-2" />
              {connectionStatus === "connecting" ||
              connectionStatus === "initializing"
                ? "Connecting..."
                : "Connect"}
            </button>
          </div>
        )}
      </div>

      {/* Text input - hidden for now to match design */}
      {false && connected && (
        <div className="fixed bottom-6 left-4 right-4 max-w-md mx-auto">
          <div className="flex gap-2">
            <input
              className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white placeholder-white/50 outline-none focus:border-purple-400/60 transition-colors"
              placeholder="Or type your message here…"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendText()}
            />
            <button
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
              onClick={sendText}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Response display - positioned elegantly */}
      {aiResponse && (
        <div className="fixed top-20 left-4 right-4 max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4">
            <div className="text-white/60 text-xs mb-2">Latest Response</div>
            <div className="text-white text-sm">{aiResponse}</div>
            {isPlaying && (
              <div className="flex items-center gap-2 text-green-400 text-xs mt-2">
                <Volume2 size={12} />
                Playing response…
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error banner */}
      {connectionStatus === "error" && wsError && (
        <div className="fixed top-4 left-4 right-4 max-w-md mx-auto">
          <div className="bg-red-500/20 backdrop-blur-lg border border-red-400/30 rounded-2xl p-4 flex items-center justify-between">
            <span className="text-red-200 text-sm">{wsError}</span>
            <button
              className="px-4 py-2 bg-red-500/30 border border-red-400/40 text-red-200 rounded-lg text-sm hover:bg-red-500/40 transition-colors"
              onClick={connectVoice}
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceInterface;
