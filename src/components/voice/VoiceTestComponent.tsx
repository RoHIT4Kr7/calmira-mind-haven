import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const VoiceTestComponent: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [testMessage, setTestMessage] = useState('Hello, can you help me create an anime character?');

  const testConnection = async () => {
    try {
      setConnectionStatus('connecting');
      setMessages(prev => [...prev, '🔄 Testing backend connection...']);

      // Test backend health
      const healthResponse = await fetch('http://localhost:8000/api/v1/voice/health');
      if (!healthResponse.ok) {
        throw new Error('Backend health check failed');
      }
      
      setMessages(prev => [...prev, '✅ Backend is healthy']);

      // Start voice session
      const sessionResponse = await fetch('http://localhost:8000/api/v1/voice/start-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context: 'test_connection'
        })
      });

      if (!sessionResponse.ok) {
        throw new Error('Failed to start session');
      }

      const sessionData = await sessionResponse.json();
      setSessionId(sessionData.session_id);
      setMessages(prev => [...prev, `✅ Session started: ${sessionData.session_id}`]);

      // Test WebSocket connection
      const wsUrl = `ws://localhost:8000/api/v1/voice/ws/${sessionData.session_id}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setConnectionStatus('connected');
        setMessages(prev => [...prev, '✅ WebSocket connected successfully']);
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setMessages(prev => [...prev, `📨 Received: ${message.type} - ${message.message || message.text || 'No content'}`]);
      };

      ws.onerror = (error) => {
        setConnectionStatus('error');
        setMessages(prev => [...prev, '❌ WebSocket connection failed']);
      };

      ws.onclose = () => {
        setConnectionStatus('disconnected');
        setMessages(prev => [...prev, '🔌 WebSocket disconnected']);
      };

      // Clean up after 10 seconds
      setTimeout(() => {
        ws.close();
      }, 10000);

    } catch (error) {
      setConnectionStatus('error');
      setMessages(prev => [...prev, `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    }
  };

  const sendTestMessage = async () => {
    if (!sessionId) {
      setMessages(prev => [...prev, '❌ No active session']);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/v1/voice/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: testMessage
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setMessages(prev => [...prev, `📤 Sent: ${testMessage}`]);
    } catch (error) {
      setMessages(prev => [...prev, `❌ Send error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    }
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
          <span className={`px-2 py-1 rounded text-sm ${
            connectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
            connectionStatus === 'connecting' ? 'bg-yellow-100 text-yellow-800' :
            connectionStatus === 'error' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {connectionStatus}
          </span>
        </div>

        {sessionId && (
          <div className="text-sm text-gray-600">
            Session ID: {sessionId}
          </div>
        )}

        <div className="flex space-x-2">
          <Button onClick={testConnection} disabled={connectionStatus === 'connecting'}>
            Test Connection
          </Button>
          <Button onClick={sendTestMessage} disabled={!sessionId} variant="outline">
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
            <p className="text-gray-500 text-sm">No messages yet. Click "Test Connection" to start.</p>
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
