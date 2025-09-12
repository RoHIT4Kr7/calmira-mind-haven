import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface VoiceInterfaceProps {
  contactName: string;
  contactAvatar?: string;
  contactDescription?: string;
  onVoiceStart?: () => void;
  onVoiceStop?: () => void;
  onVoiceMessage?: (message: string) => void;
}

interface WebSocketMessage {
  type: 'session_status' | 'transcription' | 'ai_response' | 'session_ended' | 'error';
  session_id?: string;
  text?: string;
  message?: string;
  status?: string;
  timestamp: string;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  contactName,
  contactAvatar,
  contactDescription,
  onVoiceStart,
  onVoiceStop,
  onVoiceMessage
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [wsError, setWsError] = useState<string | null>(null);
  
  const sessionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Initialize voice session and WebSocket connection
  useEffect(() => {
    // Don't auto-start the session, wait for user to click record
    // initializeVoiceSession();
    return () => {
      cleanup();
    };
  }, []);

  const initializeVoiceSession = async () => {
    try {
      console.log('Initializing voice session...');
      setConnectionStatus('connecting');
      
      // Start voice session on backend
      const response = await fetch('http://localhost:8000/api/v1/voice/start-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context: 'therapist_chat'
        })
      });
      
      console.log('Backend response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', errorText);
        throw new Error(`Failed to start session: ${response.statusText}`);
      }
      
      const sessionData = await response.json();
      console.log('Session started:', sessionData);
      const newSessionId = sessionData.session_id;
      setSessionId(newSessionId);
      
      // Connect to WebSocket
      connectWebSocket(newSessionId);
      
    } catch (error) {
      console.error('Failed to initialize voice session:', error);
      setConnectionStatus('error');
      setWsError(error instanceof Error ? error.message : 'Unknown error');
      throw error; // Re-throw to handle in caller
    }
  };

  const connectWebSocket = (sessionId: string) => {
    try {
      const wsUrl = `ws://localhost:8000/api/v1/voice/ws/${sessionId}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      
      ws.onopen = () => {
        console.log('🔌 WebSocket connected to voice session:', sessionId);
        setConnectionStatus('connected');
        setWsError(null);
      };
      
      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
      
      ws.onclose = (event) => {
        console.log('🔌 WebSocket disconnected:', event.code, event.reason);
        setConnectionStatus('disconnected');
        
        // Attempt to reconnect after a delay
        if (event.code !== 1000) { // Not a normal closure
          reconnectTimeoutRef.current = setTimeout(() => {
            if (sessionId) {
              connectWebSocket(sessionId);
            }
          }, 3000);
        }
      };
      
      ws.onerror = (error) => {
        console.error('🔌 WebSocket error:', error);
        setConnectionStatus('error');
        setWsError('WebSocket connection failed');
      };
      
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionStatus('error');
      setWsError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    console.log('📨 Received WebSocket message:', message);
    
    switch (message.type) {
      case 'session_status':
        console.log('Session status:', message.status);
        break;
        
      case 'transcription':
        if (message.text) {
          setTranscript(prev => [...prev, `You: ${message.text}`]);
        }
        break;
        
      case 'ai_response':
        if (message.text) {
          setTranscript(prev => [...prev, `${contactName}: ${message.text}`]);
          // Only set playing if we're still recording
          if (isRecording) {
            setIsPlaying(true);
            // Don't auto-stop playing, let the audio completion handle it
            // setTimeout(() => setIsPlaying(false), 3000);
          }
        }
        break;
        
      case 'session_ended':
        console.log('Voice session ended');
        setIsRecording(false);
        setIsPlaying(false);
        setConnectionStatus('disconnected');
        setSessionId(null);
        break;
        
      case 'error':
        console.error('Voice session error:', message.message);
        setWsError(message.message || 'Unknown error');
        break;
    }
  };

  const cleanup = async () => {
    // Clear timers
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    // Stop any ongoing audio/recording
    setIsRecording(false);
    setIsPlaying(false);
    
    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close(1000, 'Component unmounting');
      wsRef.current = null;
    }
    
    // Stop voice session on backend
    if (sessionId) {
      try {
        await fetch(`http://localhost:8000/api/v1/voice/stop-session?session_id=${sessionId}`, {
          method: 'POST'
        });
      } catch (error) {
        console.error('Failed to stop voice session:', error);
      }
    }
  };

  // Session timer
  useEffect(() => {
    if (isRecording || isPlaying) {
      sessionIntervalRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    } else {
      if (sessionIntervalRef.current) {
        clearInterval(sessionIntervalRef.current);
      }
    }

    return () => {
      if (sessionIntervalRef.current) {
        clearInterval(sessionIntervalRef.current);
      }
    };
  }, [isRecording, isPlaying]);

  const handleToggleRecording = async () => {
    console.log('Toggle recording clicked. Current state:', { isRecording, connectionStatus, sessionId });
    
    if (isRecording) {
      // STOP RECORDING - session should exist
      console.log('Stopping recording...');
      setIsRecording(false);
      setIsPlaying(false); // Stop any playing audio
      onVoiceStop?.();
      
      // Clear transcript to show session ended
      setTranscript(prev => [...prev, '--- Session Stopped ---']);
      
      // Stop the backend session immediately if it exists
      if (sessionId) {
        try {
          const response = await fetch(`http://localhost:8000/api/v1/voice/stop-session?session_id=${sessionId}`, {
            method: 'POST'
          });
          
          if (!response.ok) {
            console.error('Failed to stop backend session');
          }
        } catch (error) {
          console.error('Error stopping backend session:', error);
        }
      }
      
      // Close WebSocket connection to force stop
      if (wsRef.current) {
        wsRef.current.close(1000, 'User stopped recording');
        wsRef.current = null;
      }
      
      // Reset connection status
      setConnectionStatus('disconnected');
      setSessionId(null);
      setWsError(null);
      
    } else {
      // START RECORDING - initialize new session
      console.log('Starting new voice session...');
      
      // Clear any previous errors
      setWsError(null);
      
      // Initialize the voice session first, then set recording state
      try {
        await initializeVoiceSession();
        // Only set recording after successful initialization
        setIsRecording(true);
        onVoiceStart?.();
      } catch (error) {
        console.error('Failed to initialize voice session:', error);
        setConnectionStatus('disconnected');
        setWsError('Failed to start voice session. Please try again.');
      }
    }
  };
  
  const sendTextMessage = async (message: string) => {
    if (!sessionId || connectionStatus !== 'connected') {
      console.warn('Cannot send message: session not ready');
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
          message: message
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }
      
      // Add user message to transcript immediately
      setTranscript(prev => [...prev, `You: ${message}`]);
      
    } catch (error) {
      console.error('Failed to send text message:', error);
      setWsError(error instanceof Error ? error.message : 'Failed to send message');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const clearSession = () => {
    setTranscript([]);
    setSessionTime(0);
    setIsRecording(false);
    setIsPlaying(false);
  };

  return (
    <div className="h-full bg-gradient-to-br from-background via-background-soft to-background flex flex-col">
      {/* Header */}
      <div className="p-6 bg-white/95 backdrop-blur-lg border-b border-border">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white text-xl">{contactName.charAt(0)}</span>
          </div>
          <div>
            <h3 className="poppins-semibold text-xl text-foreground">{contactName}</h3>
            <p className="inter-regular text-muted-foreground">{contactDescription}</p>
            {sessionTime > 0 && (
              <p className="inter-regular text-sm text-primary">Session: {formatTime(sessionTime)}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Voice Interface */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        
        {/* Voice Visualization */}
        <div className="mb-8">
          <motion.div
            className="relative w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-primary-dark/20 border-2 border-primary/30 flex items-center justify-center"
            animate={{ 
              scale: isRecording ? [1, 1.1, 1] : 1,
              boxShadow: isRecording 
                ? `0 0 ${20 + audioLevel}px hsl(var(--primary) / 0.3)`
                : '0 4px 20px hsl(var(--primary) / 0.1)'
            }}
            transition={{ 
              scale: { repeat: isRecording ? Infinity : 0, duration: 1 },
              boxShadow: { duration: 0.1 }
            }}
          >
            {/* Animated Waves */}
            <AnimatePresence>
              {isRecording && (
                <>
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-full h-full rounded-full border-2 border-primary/20"
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{
                        scale: [0, 1.5, 2],
                        opacity: [1, 0.5, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.4
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* Center Content */}
            <div className="text-6xl text-primary">
              {isRecording ? <Mic /> : isPlaying ? <Volume2 /> : <MicOff />}
            </div>
          </motion.div>
        </div>

        {/* Status Text */}
        <div className="text-center mb-8">
          <h2 className="poppins-medium text-2xl text-foreground mb-2">
            {connectionStatus === 'connecting' ? 'Connecting...' :
             connectionStatus === 'error' ? 'Connection Error' :
             connectionStatus === 'disconnected' && !isRecording ? 'Ready to Start' :
             isRecording ? 'Listening...' : isPlaying ? 'Speaking...' : 'Ready to chat'}
          </h2>
          <p className="inter-regular text-muted-foreground">
            {connectionStatus === 'connecting' ? 'Establishing connection to voice agent...' :
             connectionStatus === 'error' ? (wsError || 'Failed to connect to voice agent') :
             connectionStatus === 'disconnected' && !isRecording ? 'Tap the microphone to start a session' :
             isRecording 
               ? 'Speak naturally, I\'m here to listen' 
               : isPlaying 
                 ? 'AI is responding...'
                 : 'Tap the microphone to start talking'
            }
          </p>
          {wsError && (
            <p className="inter-regular text-sm text-destructive mt-2">
              {wsError}
            </p>
          )}
          {sessionId && (
            <p className="inter-regular text-xs text-muted-foreground mt-2">
              Session: {sessionId}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => {
              console.log('Button clicked directly!');
              handleToggleRecording();
            }}
            className={`w-20 h-20 rounded-full ${
              isRecording 
                ? 'bg-destructive hover:bg-destructive/90' 
                : 'bg-primary hover:bg-primary-dark'
            } text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center`}
            disabled={connectionStatus === 'connecting'}
            type="button"
          >
            {isRecording ? <Square className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
          </button>
          
          {transcript.length > 0 && (
            <Button
              onClick={clearSession}
              variant="outline"
              className="px-6 py-3 inter-medium"
            >
              Clear Session
            </Button>
          )}
        </div>
      </div>

      {/* Transcript */}
      {transcript.length > 0 && (
        <div className="p-6 bg-white/95 backdrop-blur-lg border-t border-border max-h-60 overflow-y-auto">
          <h4 className="poppins-medium text-lg text-foreground mb-4">Conversation</h4>
          <div className="space-y-3">
            {transcript.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-3 rounded-lg ${
                  message.startsWith('You:') 
                    ? 'bg-primary/10 text-foreground ml-8' 
                    : 'bg-muted text-foreground mr-8'
                }`}
              >
                <p className="inter-regular text-sm leading-relaxed">{message}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceInterface;