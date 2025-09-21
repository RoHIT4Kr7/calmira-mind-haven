import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Volume2, VolumeX, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { VoiceAgentClient, createVoiceAgent } from "./VoiceAgentClient";

interface VoiceInterfaceProps {
  contactName: string;
  contactAvatar?: string;
  contactDescription?: string;
  onVoiceStart?: () => void;
  onVoiceStop?: () => void;
  onVoiceMessage?: (message: string) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  contactName,
  contactAvatar,
  contactDescription,
  onVoiceStart,
  onVoiceStop,
  onVoiceMessage,
}) => {
  const { token } = useAuth();

  // State management
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected" | "error" | "initializing"
  >("disconnected");
  const [wsError, setWsError] = useState<string | null>(null);

  // Voice agent client reference
  const voiceClientRef = useRef<VoiceAgentClient | null>(null);
  const sessionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Audio level animation when recording
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRecording) {
      interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
    } else {
      setAudioLevel(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  /**
   * Initialize voice agent client
   */
  const initializeVoiceClient = async (): Promise<boolean> => {
    try {
      console.log("🎤 Initializing voice client...");
      setConnectionStatus("initializing");
      setWsError(null);

      const sessionId = `session_${Date.now()}`;
      const backendUrl = window.location.host;

      // Create voice agent client with callbacks
      const voiceClient = await createVoiceAgent(sessionId, backendUrl, {
        onTranscription: (text: string) => {
          console.log("📝 Transcription:", text);
          setTranscript((prev) => [...prev, `You: ${text}`]);
          onVoiceMessage?.(text);
        },

        onResponse: (text: string) => {
          console.log("🤖 AI Response:", text);
          setTranscript((prev) => [...prev, `AI: ${text}`]);
          setIsPlaying(true);

          // Simulate playing animation
          setTimeout(() => setIsPlaying(false), 2000);
        },

        onError: (error: string) => {
          console.error("❌ Voice error:", error);
          setWsError(error);
          setConnectionStatus("error");
          setIsRecording(false);
          stopSessionTimer();
        },

        onStatusChange: (status: string) => {
          console.log("📊 Status changed:", status);

          switch (status) {
            case "connected":
              setConnectionStatus("connected");
              setWsError(null);
              break;
            case "disconnected":
              setConnectionStatus("disconnected");
              setIsRecording(false);
              stopSessionTimer();
              break;
            case "recording":
              setIsRecording(true);
              onVoiceStart?.();
              startSessionTimer();
              break;
            case "stopped":
              setIsRecording(false);
              onVoiceStop?.();
              stopSessionTimer();
              break;
            case "error":
              setConnectionStatus("error");
              setIsRecording(false);
              stopSessionTimer();
              break;
          }
        },
      });

      voiceClientRef.current = voiceClient;
      console.log("✅ Voice client initialized successfully");

      return true;
    } catch (error) {
      console.error("❌ Failed to initialize voice client:", error);
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Failed to initialize voice system";
      setWsError(errorMsg);
      setConnectionStatus("error");
      return false;
    }
  };

  /**
   * Start voice recording
   */
  const startRecording = async () => {
    try {
      // Initialize client if not already done
      if (!voiceClientRef.current) {
        const initialized = await initializeVoiceClient();
        if (!initialized) return;
      }

      const client = voiceClientRef.current;
      if (!client) return;

      // Check if client is connected
      const status = client.getStatus();
      if (!status.isConnected) {
        setWsError("Not connected to voice service");
        return;
      }

      // Start recording
      await client.startRecording();
    } catch (error) {
      console.error("❌ Failed to start recording:", error);
      const errorMsg =
        error instanceof Error ? error.message : "Failed to start recording";
      setWsError(errorMsg);
      setConnectionStatus("error");
    }
  };

  /**
   * Stop voice recording
   */
  const stopRecording = () => {
    try {
      if (voiceClientRef.current) {
        voiceClientRef.current.stopRecording();
      }
    } catch (error) {
      console.error("❌ Failed to stop recording:", error);
    }
  };

  /**
   * Start session timer
   */
  const startSessionTimer = () => {
    if (sessionIntervalRef.current) {
      clearInterval(sessionIntervalRef.current);
    }

    setSessionTime(0);
    sessionIntervalRef.current = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);
  };

  /**
   * Stop session timer
   */
  const stopSessionTimer = () => {
    if (sessionIntervalRef.current) {
      clearInterval(sessionIntervalRef.current);
      sessionIntervalRef.current = null;
    }
  };

  /**
   * Format session time
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  /**
   * Clean up resources
   */
  const cleanup = () => {
    console.log("🧹 Cleaning up voice interface...");

    // Stop session timer
    stopSessionTimer();

    // Disconnect voice client
    if (voiceClientRef.current) {
      voiceClientRef.current.disconnect();
      voiceClientRef.current = null;
    }

    // Reset state
    setIsRecording(false);
    setIsPlaying(false);
    setConnectionStatus("disconnected");
    setWsError(null);
    setTranscript([]);
    setSessionTime(0);
  };

  /**
   * Toggle recording state
   */
  const toggleRecording = async () => {
    if (connectionStatus === "error") {
      // Try to reinitialize on error
      const initialized = await initializeVoiceClient();
      if (!initialized) return;
    }

    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  return (
    <div className="voice-interface-container">
      {/* Header */}
      <div className="voice-header">
        <div className="flex items-center space-x-3">
          {contactAvatar && (
            <img
              src={contactAvatar}
              alt={contactName}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <h2 className="text-white font-semibold">
              {connectionStatus === "connecting" ||
              connectionStatus === "initializing"
                ? "Connecting..."
                : connectionStatus === "error"
                ? "Connection Error"
                : connectionStatus === "disconnected" && !isRecording
                ? "Ready to Start"
                : isRecording
                ? "Listening..."
                : isPlaying
                ? "Speaking..."
                : "Ready to chat"}
            </h2>
            <p className="text-white/70">
              {connectionStatus === "connecting" ||
              connectionStatus === "initializing"
                ? "Establishing connection to voice agent..."
                : connectionStatus === "error"
                ? wsError || "Failed to connect to voice agent"
                : connectionStatus === "disconnected" && !isRecording
                ? "Tap the microphone to start a session"
                : isRecording
                ? "Speak naturally, I'm here to listen"
                : isPlaying
                ? "AI is responding..."
                : "Tap the microphone to start talking"}
            </p>
            {wsError && <p className="text-sm text-red-400 mt-2">{wsError}</p>}
            {contactDescription && (
              <p className="text-xs text-white/50 mt-1">{contactDescription}</p>
            )}
          </div>
        </div>

        {/* Session timer */}
        {sessionTime > 0 && (
          <div className="text-white/60 text-sm">{formatTime(sessionTime)}</div>
        )}
      </div>

      {/* Voice controls */}
      <div className="voice-controls">
        <div className="flex items-center justify-center space-x-4">
          {/* Main recording button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={toggleRecording}
              disabled={
                connectionStatus === "connecting" ||
                connectionStatus === "initializing"
              }
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600 animate-pulse"
                  : "bg-blue-500 hover:bg-blue-600"
              } ${
                connectionStatus === "error"
                  ? "bg-gray-500 cursor-not-allowed"
                  : ""
              }`}
            >
              {isRecording ? (
                <Square className="w-6 h-6 text-white" />
              ) : (
                <Mic className="w-6 h-6 text-white" />
              )}
            </Button>
          </motion.div>

          {/* Volume indicator */}
          <div className="flex items-center text-white/60">
            {isPlaying ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </div>
        </div>

        {/* Audio level indicator */}
        {isRecording && (
          <motion.div
            className="mt-4 w-full bg-white/20 h-2 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-blue-500"
              style={{
                width: `${audioLevel}%`,
              }}
              transition={{ duration: 0.1 }}
            />
          </motion.div>
        )}
      </div>

      {/* Transcript */}
      {transcript.length > 0 && (
        <div className="voice-transcript mt-6">
          <h3 className="text-white font-medium mb-2">Conversation</h3>
          <div className="bg-black/30 rounded-lg p-4 max-h-48 overflow-y-auto space-y-2">
            <AnimatePresence>
              {transcript.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-sm ${
                    message.startsWith("You:")
                      ? "text-blue-300"
                      : "text-green-300"
                  }`}
                >
                  {message}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Status indicator */}
      <div className="status-indicator mt-4 text-center">
        <div
          className={`inline-block w-3 h-3 rounded-full mr-2 ${
            connectionStatus === "connected"
              ? "bg-green-500"
              : connectionStatus === "connecting" ||
                connectionStatus === "initializing"
              ? "bg-yellow-500 animate-pulse"
              : connectionStatus === "error"
              ? "bg-red-500"
              : "bg-gray-500"
          }`}
        />
        <span className="text-white/60 text-sm capitalize">
          {connectionStatus === "initializing"
            ? "Initializing"
            : connectionStatus}
        </span>
      </div>
    </div>
  );
};

export default VoiceInterface;
