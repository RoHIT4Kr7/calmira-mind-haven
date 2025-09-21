/**
 * VoiceAgentClient - Client-side audio processing for voice chat
 * Eliminates PyAudio dependencies by using Web Audio API
 */

export interface VoiceAgentConfig {
  sampleRate: number;
  channels: number;
  chunkSize: number;
  outputSampleRate: number;
}

export interface VoiceAgentCallbacks {
  onTranscription?: (text: string) => void;
  onResponse?: (text: string) => void;
  onError?: (error: string) => void;
  onStatusChange?: (status: string) => void;
}

export class VoiceAgentClient {
  private sessionId: string;
  private backendUrl: string;
  private websocket: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private audioProcessor: ScriptProcessorNode | null = null;
  private audioSource: MediaStreamAudioSourceNode | null = null;
  private isRecording = false;
  private isConnected = false;
  
  // Audio configuration matching PyAudio settings
  private config: VoiceAgentConfig = {
    sampleRate: 16000,        // SEND_SAMPLE_RATE
    channels: 1,              // CHANNELS
    chunkSize: 2048,          // CHUNK_SIZE
    outputSampleRate: 24000   // RECEIVE_SAMPLE_RATE
  };
  
  // Callbacks
  public onTranscription: ((text: string) => void) | null = null;
  public onResponse: ((text: string) => void) | null = null;
  public onError: ((error: string) => void) | null = null;
  public onStatusChange: ((status: string) => void) | null = null;

  constructor(sessionId: string, backendUrl: string, callbacks?: VoiceAgentCallbacks) {
    this.sessionId = sessionId;
    this.backendUrl = backendUrl.replace(/^https?:\/\//, ''); // Remove protocol for WebSocket
    
    // Set callbacks if provided
    if (callbacks) {
      this.onTranscription = callbacks.onTranscription || null;
      this.onResponse = callbacks.onResponse || null;
      this.onError = callbacks.onError || null;
      this.onStatusChange = callbacks.onStatusChange || null;
    }
  }

  /**
   * Initialize audio context and get microphone access
   */
  async initialize(): Promise<boolean> {
    try {
      console.log('🎤 Initializing audio system...');
      
      // Initialize AudioContext with proper sample rate
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: this.config.sampleRate,
        latencyHint: 'interactive' // Low latency for real-time processing
      });
      
      // Get microphone access with optimal settings
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: this.config.sampleRate,
          channelCount: this.config.channels,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      console.log('✅ Audio initialized successfully');
      if (this.onStatusChange) this.onStatusChange('initialized');
      return true;
      
    } catch (error) {
      console.error('❌ Failed to initialize audio:', error);
      const errorMsg = error instanceof Error ? error.message : 'Microphone access denied';
      if (this.onError) this.onError(errorMsg);
      return false;
    }
  }

  /**
   * Connect to backend WebSocket
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${this.backendUrl}/api/v1/voice/ws/${this.sessionId}`;
      
      console.log('🔗 Connecting to WebSocket:', wsUrl);
      this.websocket = new WebSocket(wsUrl);
      
      this.websocket.onopen = () => {
        console.log('✅ WebSocket connected');
        this.isConnected = true;
        if (this.onStatusChange) this.onStatusChange('connected');
        resolve();
      };
      
      this.websocket.onmessage = (event) => {
        this.handleWebSocketMessage(event);
      };
      
      this.websocket.onclose = (event) => {
        console.log('🔌 WebSocket disconnected:', event.code, event.reason);
        this.isConnected = false;
        if (this.onStatusChange) this.onStatusChange('disconnected');
      };
      
      this.websocket.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        if (this.onError) this.onError('Connection failed');
        reject(error);
      };
    });
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleWebSocketMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'transcription':
          console.log('📝 Transcription:', data.text);
          if (this.onTranscription) this.onTranscription(data.text);
          break;
          
        case 'ai_response':
          console.log('🤖 AI Response:', data.text);
          if (this.onResponse) this.onResponse(data.text);
          break;
          
        case 'audio_response':
          console.log('🔊 Audio response received');
          this.playAudioResponse(data.audio_data);
          break;
          
        case 'session_status':
          console.log('📊 Session status:', data.status);
          if (this.onStatusChange) this.onStatusChange(data.status);
          break;
          
        case 'message_sent':
          console.log('✅ Message confirmed sent');
          break;
          
        case 'error':
          console.error('❌ Server error:', data.message);
          if (this.onError) this.onError(data.message);
          // Mark as disconnected on server error
          this.isConnected = false;
          break;
          
        default:
          console.log('📨 Unknown message type:', data.type, data);
      }
    } catch (error) {
      console.error('❌ Error parsing WebSocket message:', error);
      if (this.onError) this.onError('Failed to parse server message');
    }
  }

  /**
   * Start recording and streaming audio
   */
  async startRecording(): Promise<void> {
    if (!this.mediaStream || !this.audioContext) {
      throw new Error('Audio not initialized');
    }

    if (!this.isConnected || !this.websocket) {
      throw new Error('Not connected to server');
    }

    try {
      console.log('🎙️ Starting audio recording...');
      
      // Set up real-time audio processing
      await this.setupAudioProcessor();
      
      this.isRecording = true;
      console.log('✅ Recording started');
      if (this.onStatusChange) this.onStatusChange('recording');
      
    } catch (error) {
      console.error('❌ Failed to start recording:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to start recording';
      if (this.onError) this.onError(errorMsg);
      throw error;
    }
  }

  /**
   * Set up audio processor for real-time streaming
   */
  private async setupAudioProcessor(): Promise<void> {
    if (!this.audioContext || !this.mediaStream) return;

    try {
      // Create audio source from microphone stream
      this.audioSource = this.audioContext.createMediaStreamSource(this.mediaStream);
      
      // Create script processor for real-time audio processing
      this.audioProcessor = this.audioContext.createScriptProcessor(
        this.config.chunkSize,
        this.config.channels,
        this.config.channels
      );
      
      // Process audio in real-time
      this.audioProcessor.onaudioprocess = (event) => {
        if (!this.isRecording || !this.isConnected || !this.websocket) return;
        
        // Check WebSocket state before sending
        if (this.websocket.readyState !== WebSocket.OPEN) {
          console.warn('WebSocket not open, stopping audio stream');
          this.isConnected = false;
          return;
        }
        
        const inputBuffer = event.inputBuffer;
        const inputData = inputBuffer.getChannelData(0);
        const inSampleRate = inputBuffer.sampleRate || this.audioContext!.sampleRate;

        // Downsample to target sample rate (e.g., 16 kHz) and convert to Int16 PCM
        const int16Data = this.downsampleBuffer(inputData, inSampleRate, this.config.sampleRate);
        
        // Send binary audio data via WebSocket
        try {
          this.websocket.send(int16Data.buffer);
        } catch (error) {
          console.error('Failed to send audio data:', error);
          this.isConnected = false;
        }
      };
      
      // Connect audio nodes
      this.audioSource.connect(this.audioProcessor);
  // Connect processor to destination; we don't write to output, so it's silent but keeps processor running
  this.audioProcessor.connect(this.audioContext.destination);
      
      console.log('🔧 Audio processor setup complete');
      
    } catch (error) {
      console.error('❌ Failed to setup audio processor:', error);
      throw error;
    }
  }

  /**
   * Convert Float32 audio to Int16 (matching PyAudio format)
   */
  private float32ToInt16(float32Array: Float32Array): Int16Array {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      // Convert float32 (-1.0 to 1.0) to int16 (-32768 to 32767)
      int16Array[i] = Math.max(-32768, Math.min(32767, Math.floor(float32Array[i] * 32768)));
    }
    return int16Array;
  }

  /**
   * Downsample Float32 audio buffer from inSampleRate to outSampleRate and convert to Int16 PCM
   * Uses simple averaging to mitigate aliasing. Suitable for real-time streaming.
   */
  private downsampleBuffer(buffer: Float32Array, inSampleRate: number, outSampleRate: number): Int16Array {
    if (!inSampleRate || inSampleRate <= 0) inSampleRate = this.audioContext?.sampleRate || 48000;
    if (outSampleRate === inSampleRate) {
      return this.float32ToInt16(buffer);
    }
    if (outSampleRate > inSampleRate) {
      // Upsampling not required for Live API; fall back to original
      return this.float32ToInt16(buffer);
    }

    const sampleRateRatio = inSampleRate / outSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Int16Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;

    while (offsetResult < newLength) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0;
      let count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      const sample = count > 0 ? accum / count : 0;
      // Scale to Int16 range
      const s = Math.max(-1, Math.min(1, sample));
      result[offsetResult] = s < 0 ? Math.round(s * 32768) : Math.round(s * 32767);
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }

    return result;
  }

  /**
   * Play audio response from server
   */
  private async playAudioResponse(audioData: string): Promise<void> {
    if (!this.audioContext) return;

    try {
      // Decode base64 audio data (Int16 PCM at outputSampleRate)
      const binaryData = atob(audioData);
      const len = binaryData.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = binaryData.charCodeAt(i);

      // Convert Int16 PCM to Float32 [-1, 1]
      const samples = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(samples.length);
      for (let i = 0; i < samples.length; i++) {
        const s = samples[i] / 32768;
        float32[i] = Math.max(-1, Math.min(1, s));
      }

      // Create AudioBuffer and play
      const buffer = this.audioContext.createBuffer(
        1,
        float32.length,
        this.config.outputSampleRate
      );
      buffer.copyToChannel(float32, 0);
      const src = this.audioContext.createBufferSource();
      src.buffer = buffer;
      src.connect(this.audioContext.destination);
      src.start();
      
      console.log('🔊 Audio response played');
      
    } catch (error) {
      console.error('❌ Failed to play audio response:', error);
    }
  }

  /**
   * Stop recording
   */
  stopRecording(): void {
    if (this.isRecording) {
      this.isRecording = false;
      
      // Disconnect audio nodes
      if (this.audioSource && this.audioProcessor) {
        this.audioSource.disconnect();
        this.audioProcessor.disconnect();
        this.audioProcessor = null;
        this.audioSource = null;
      }
      
      console.log('🛑 Recording stopped');
      if (this.onStatusChange) this.onStatusChange('stopped');

      // Inform backend to end the turn so the model can respond
      if (this.websocket && this.isConnected && this.websocket.readyState === WebSocket.OPEN) {
        try {
          this.websocket.send(JSON.stringify({ type: 'end_turn', session_id: this.sessionId }));
        } catch {}
      }
    }
  }

  /**
   * Send text message to AI
   */
  async sendTextMessage(message: string): Promise<void> {
    if (!this.isConnected || !this.websocket) {
      throw new Error('Not connected');
    }

    if (this.websocket.readyState !== WebSocket.OPEN) {
      this.isConnected = false;
      throw new Error('WebSocket connection lost');
    }

    const messageData = {
      type: 'text_message',
      session_id: this.sessionId,
      message: message
    };

    try {
      this.websocket.send(JSON.stringify(messageData));
      console.log('📤 Text message sent:', message);
    } catch (error) {
      console.error('Failed to send text message:', error);
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Disconnect and cleanup
   */
  disconnect(): void {
    console.log('🔌 Disconnecting voice client...');
    
    this.stopRecording();
    
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
    
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.isConnected = false;
    this.isRecording = false;
    
    console.log('✅ Voice client disconnected');
    if (this.onStatusChange) this.onStatusChange('disconnected');
  }

  /**
   * Get current status
   */
  getStatus(): {
    isConnected: boolean;
    isRecording: boolean;
    hasAudioContext: boolean;
    hasMediaStream: boolean;
  } {
    return {
      isConnected: this.isConnected,
      isRecording: this.isRecording,
      hasAudioContext: !!this.audioContext,
      hasMediaStream: !!this.mediaStream
    };
  }
}

/**
 * Factory function to create and initialize VoiceAgentClient
 */
export async function createVoiceAgent(
  sessionId: string,
  backendUrl: string,
  callbacks?: VoiceAgentCallbacks
): Promise<VoiceAgentClient> {
  const client = new VoiceAgentClient(sessionId, backendUrl, callbacks);
  
  const initialized = await client.initialize();
  if (!initialized) {
    throw new Error('Failed to initialize audio system');
  }
  
  await client.connect();
  return client;
}
