import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VoiceAgentClient, createVoiceAgent } from "./VoiceAgentClient";
import { API_BASE_URL } from "@/lib/api";

const VoiceTestComponent: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected" | "error"
  >("disconnected");

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [testMessage, setTestMessage] = useState(
    "Hello, can you help me create an anime character?"
  );
  const [isRecording, setIsRecording] = useState(false);

  const voiceClientRef = useRef<VoiceAgentClient | null>(null);

  const addMessage = (message: string) => {
    setMessages((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()} - ${message}`,
    ]);
  };

  const testConnection = async () => {
    try {
      setConnectionStatus("connecting");
      addMessage("🔄 Testing backend connection...");

      // Test backend health
      const healthResponse = await fetch(`${API_BASE_URL}/voice/health`);
      if (!healthResponse.ok) {
        throw new Error("Backend health check failed");
      }

      const healthData = await healthResponse.json();
      addMessage(`✅ Backend is healthy - Status: ${healthData.status}`);
      addMessage(
        `🎯 Available models: ${
          healthData.checks?.available_models?.join(", ") || "Unknown"
        }`
      );

      // Create session ID and initialize voice client
      const newSessionId = `test_session_${Date.now()}`;
      setSessionId(newSessionId);

      // Create voice client with callbacks
      const voiceClient = await createVoiceAgent(
        newSessionId,
        API_BASE_URL.replace("/api/v1", ""),
        {
          onStatusChange: (status) => {
            addMessage(`📊 Status: ${status}`);
            if (status === "connected") {
              setConnectionStatus("connected");
            } else if (status === "disconnected") {
              setConnectionStatus("disconnected");
            }
          },
          onResponse: (text) => {
            addMessage(`🤖 AI: ${text}`);
          },
          onAudioResponse: (audioData) => {
            addMessage(
              `🔊 Audio response received (${audioData.length} chars)`
            );
          },
          onError: (error) => {
            addMessage(`❌ Error: ${error}`);
            setConnectionStatus("error");
          },
          onTurnComplete: () => {
            addMessage(`🔚 Turn complete`);
            setIsRecording(false);
          },
        }
      );

      voiceClientRef.current = voiceClient;
      setConnectionStatus("connected");
      addMessage("✅ Voice client initialized and connected");
    } catch (error) {
      setConnectionStatus("error");
      addMessage(
        `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const startRecording = async () => {
    if (!voiceClientRef.current) {
      addMessage("❌ No voice client available");
      return;
    }

    try {
      await voiceClientRef.current.startRecording();
      setIsRecording(true);
      addMessage("🎙️ Recording started");
    } catch (error) {
      addMessage(
        `❌ Failed to start recording: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const stopRecording = () => {
    if (!voiceClientRef.current) {
      addMessage("❌ No voice client available");
      return;
    }

    voiceClientRef.current.stopRecording();
    setIsRecording(false);
    addMessage("🛑 Recording stopped");
  };

  const sendTestMessage = async () => {
    if (!voiceClientRef.current) {
      addMessage("❌ No voice client available");
      return;
    }

    try {
      await voiceClientRef.current.sendTextMessage(testMessage);
      addMessage(`📤 Sent: ${testMessage}`);
    } catch (error) {
      addMessage(
        `❌ Failed to send message: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const disconnect = () => {
    if (voiceClientRef.current) {
      voiceClientRef.current.disconnect();
      voiceClientRef.current = null;
    }
    setConnectionStatus("disconnected");
    setSessionId(null);
    setIsRecording(false);
    addMessage("🔌 Disconnected");
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Voice Agent WebSocket Test - Gemini Live API</CardTitle>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Status:</span>
          <span
            className={`px-2 py-1 rounded text-xs font-bold ${
              connectionStatus === "connected"
                ? "bg-green-100 text-green-800"
                : connectionStatus === "connecting"
                ? "bg-yellow-100 text-yellow-800"
                : connectionStatus === "error"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {connectionStatus}
          </span>
          {sessionId && (
            <span className="text-xs text-gray-600">Session: {sessionId}</span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Control Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={testConnection}
            disabled={connectionStatus === "connecting"}
            variant="outline"
          >
            {connectionStatus === "connecting"
              ? "Connecting..."
              : "Test Connection"}
          </Button>

          <Button
            onClick={sendTestMessage}
            disabled={connectionStatus !== "connected"}
            variant="outline"
          >
            Send Test Message
          </Button>

          <Button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={connectionStatus !== "connected"}
            variant={isRecording ? "destructive" : "default"}
          >
            {isRecording ? "🛑 Stop Recording" : "🎙️ Start Recording"}
          </Button>

          <Button
            onClick={disconnect}
            disabled={connectionStatus === "disconnected"}
            variant="outline"
          >
            Disconnect
          </Button>

          <Button onClick={clearMessages} variant="ghost">
            Clear Log
          </Button>
        </div>

        {/* Test Message Input */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Test Message:
          </label>
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter test message..."
            disabled={connectionStatus !== "connected"}
          />
        </div>

        {/* Connection Log */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Connection Log:
          </h4>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-3 h-96 overflow-y-auto font-mono text-sm">
            {messages.length === 0 ? (
              <div className="text-gray-500 italic">
                No messages yet. Click "Test Connection" to start.
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className="mb-1">
                  {message}
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceTestComponent;
