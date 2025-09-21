import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const VoiceTestComponent: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected" | "error"
  >("disconnected");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [testMessage, setTestMessage] = useState(
    "Hello, can you help me create an anime character?"
  );

  const testConnection = async () => {
    try {
      setConnectionStatus("connecting");
      setMessages((prev) => [...prev, "🔄 Testing backend connection..."]);

      // Test backend health
      const healthResponse = await fetch(
        "http://localhost:8000/api/v1/voice/health"
      );
      if (!healthResponse.ok) {
        throw new Error("Backend health check failed");
      }

      const healthData = await healthResponse.json();
      setMessages((prev) => [
        ...prev,
        `✅ Backend is healthy - Status: ${healthData.status}`,
      ]);

      // Test WebSocket connection directly without starting a session via REST API
      const sessionId = `test_session_${Date.now()}`;
      const wsUrl = `ws://localhost:8000/api/v1/voice/ws/${sessionId}`;
      setMessages((prev) => [...prev, `🔗 Connecting to WebSocket: ${wsUrl}`]);

      const ws = new WebSocket(wsUrl);
      let wsConnected = false;

      ws.onopen = () => {
        wsConnected = true;
        setConnectionStatus("connected");
        setSessionId(sessionId);
        setMessages((prev) => [...prev, "✅ WebSocket connected successfully"]);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setMessages((prev) => [
            ...prev,
            `📨 Received: ${message.type} - ${
              message.message || message.text || JSON.stringify(message)
            }`,
          ]);
        } catch (e) {
          setMessages((prev) => [...prev, `📨 Received raw: ${event.data}`]);
        }
      };

      ws.onerror = (error) => {
        setConnectionStatus("error");
        setMessages((prev) => [...prev, "❌ WebSocket connection failed"]);
        console.error("WebSocket error:", error);
      };

      ws.onclose = (event) => {
        setConnectionStatus("disconnected");
        setMessages((prev) => [
          ...prev,
          `🔌 WebSocket disconnected - Code: ${event.code}, Reason: ${
            event.reason || "No reason provided"
          }`,
        ]);
      };

      // Wait for connection or timeout
      const timeout = setTimeout(() => {
        if (!wsConnected) {
          setConnectionStatus("error");
          setMessages((prev) => [...prev, "❌ WebSocket connection timeout"]);
          ws.close();
        }
      }, 10000);

      // Clean up after 30 seconds
      setTimeout(() => {
        clearTimeout(timeout);
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      }, 30000);
    } catch (error) {
      setConnectionStatus("error");
      setMessages((prev) => [
        ...prev,
        `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      ]);
    }
  };

  const sendTestMessage = async () => {
    if (!sessionId) {
      setMessages((prev) => [
        ...prev,
        "❌ No active session - WebSocket test doesn't use REST session",
      ]);
      return;
    }

    // For WebSocket test, we'll simulate a text message through the WebSocket
    setMessages((prev) => [
      ...prev,
      `📤 Would send via WebSocket: ${testMessage}`,
    ]);
    setMessages((prev) => [
      ...prev,
      "ℹ️ Note: Direct WebSocket message sending not implemented in test component",
    ]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Voice Agent WebSocket Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="font-medium">Status:</span>
          <span
            className={`px-2 py-1 rounded text-sm ${
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
        </div>

        {sessionId && (
          <div className="text-sm text-gray-600">Session ID: {sessionId}</div>
        )}

        <div className="flex space-x-2">
          <Button
            onClick={testConnection}
            disabled={connectionStatus === "connecting"}
          >
            Test Connection
          </Button>
          <Button
            onClick={sendTestMessage}
            disabled={!sessionId}
            variant="outline"
          >
            Send Test Message
          </Button>
          <Button onClick={clearMessages} variant="outline">
            Clear Log
          </Button>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Test Message:</label>
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter test message..."
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-md max-h-60 overflow-y-auto">
          <h4 className="font-medium mb-2">Connection Log:</h4>
          {messages.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No messages yet. Click "Test Connection" to start.
            </p>
          ) : (
            <div className="space-y-1">
              {messages.map((message, index) => (
                <div key={index} className="text-sm font-mono">
                  {message}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceTestComponent;
