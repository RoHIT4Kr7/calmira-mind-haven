/**
 * VoiceAgentClient - Client-side audio processing for voice chat
 * Compatible with Gemini Live API WebSocket service
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
  onAudioResponse?: (audioData: string) => void;
  onTurnComplete?: () => void;
  onCapabilitiesChange?: (caps: { audioEnabled: boolean; sessionReady: boolean }) => void;
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
  private sessionReady = false;  // set on setup_complete or optimistic arm
  private audioEnabled = false;

  // Playback queue state to prevent overlap
  private playbackGain: GainNode | null = null;
  private nextPlayTime = 0;
  private currentPlayingSources: AudioBufferSourceNode[] = []; // Track playing sources
  private awaitingNewTurnAudio = false; // Track turn boundaries for proper audio queue management
  private audioSequenceId = 0; // Track different conversation turns

  // Audio configuration matching backend
  private config: VoiceAgentConfig = {
    sampleRate: 16000,     // SEND_SAMPLE_RATE
    channels: 1,           // CHANNELS
    chunkSize: 2048,       // ScriptProcessor buffer size
    outputSampleRate: 24000 // RECEIVE_SAMPLE_RATE
  };

  // Callbacks
  public onTranscription: ((text: string) => void) | null = null;
  public onResponse: ((text: string) => void) | null = null;
  public onError: ((error: string) => void) | null = null;
  public onStatusChange: ((status: string) => void) | null = null;
  public onAudioResponse: ((audioData: string) => void) | null = null;
  public onTurnComplete: (() => void) | null = null;
  public onCapabilitiesChange: ((caps: { audioEnabled: boolean; sessionReady: boolean }) => void) | null = null;

  constructor(sessionId: string, backendUrl: string, callbacks?: VoiceAgentCallbacks) {
    this.sessionId = sessionId;
    this.backendUrl = backendUrl.replace(/^https?:\/\//, '');

    if (callbacks) {
      this.onTranscription = callbacks.onTranscription || null;
      this.onResponse = callbacks.onResponse || null;
      this.onError = callbacks.onError || null;
      this.onStatusChange = callbacks.onStatusChange || null;
      this.onAudioResponse = callbacks.onAudioResponse || null;
      this.onTurnComplete = callbacks.onTurnComplete || null;
      this.onCapabilitiesChange = callbacks.onCapabilitiesChange || null;
    }
  }

  async initialize(): Promise<boolean> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: this.config.sampleRate,
        latencyHint: 'interactive'
      });

      // Playback queue setup
      this.playbackGain = this.audioContext.createGain();
      this.playbackGain.gain.value = 1.0;
      this.playbackGain.connect(this.audioContext.destination);
      this.nextPlayTime = this.audioContext.currentTime + 0.05;

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: this.config.sampleRate,
          channelCount: this.config.channels,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      if (this.onStatusChange) this.onStatusChange('initialized');
      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Microphone access denied';
      if (this.onError) this.onError(errorMsg);
      return false;
    }
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Use wss:// for HTTPS backends (like Google App Engine and Cloud Run) and ws:// for HTTP backends  
      const protocol = this.backendUrl.includes('appspot.com') || this.backendUrl.includes('run.app') || this.backendUrl.startsWith('https') ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${this.backendUrl}/api/v1/voice/ws/${this.sessionId}`;
      this.websocket = new WebSocket(wsUrl);

      this.websocket.onopen = () => {
        this.isConnected = true;
        if (this.onStatusChange) this.onStatusChange('connected');
        resolve();
      };

      this.websocket.onmessage = (event) => this.handleWebSocketMessage(event);

      this.websocket.onclose = () => {
        this.isConnected = false;
        if (this.onStatusChange) this.onStatusChange('disconnected');
      };

      this.websocket.onerror = (error) => {
        if (this.onError) this.onError('Connection failed');
        reject(error);
      };
    });
  }

  private handleWebSocketMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'ai_response': {
          if (this.onResponse) this.onResponse(data.text);
          break;
        }

        case 'audio_response': {
          // Start a new sequence only when a new turn begins
          if (this.awaitingNewTurnAudio) {
            console.log('🎵 New turn audio - stopping previous audio and starting fresh sequence');
            this.stopCurrentAudio();
            this.audioSequenceId++;
            this.awaitingNewTurnAudio = false;
          }
          
          if (this.onAudioResponse) this.onAudioResponse(data.audio_data);
          // Pass mime_type through for proper rate handling
          this.playAudioResponse(data.audio_data, data.mime_type);
          break;
        }

        case 'session_status': {
          if (typeof data.audio_enabled === 'boolean') this.audioEnabled = data.audio_enabled;
          if (this.onStatusChange) this.onStatusChange(data.status);

          // Optimistic arming if AUDIO session and setup_complete isn’t surfaced promptly
          if (this.audioEnabled && !this.sessionReady) {
            setTimeout(() => {
              if (!this.sessionReady && this.audioEnabled) {
                this.sessionReady = true;
                if (this.onCapabilitiesChange) {
                  this.onCapabilitiesChange({ audioEnabled: this.audioEnabled, sessionReady: this.sessionReady });
                }
              }
            }, 150);
          } else {
            if (this.onCapabilitiesChange) {
              this.onCapabilitiesChange({ audioEnabled: this.audioEnabled, sessionReady: this.sessionReady });
            }
          }
          break;
        }

        case 'setup_complete': {
          if (this.onStatusChange) this.onStatusChange('setup_complete');
          this.sessionReady = true;
          if (this.onCapabilitiesChange) {
            this.onCapabilitiesChange({ audioEnabled: this.audioEnabled, sessionReady: this.sessionReady });
          }
          break;
        }

        case 'turn_complete': {
          // Mark boundary; next audio starts a fresh sequence
          console.log('🔚 Turn complete - next audio will start new sequence');
          this.awaitingNewTurnAudio = true;
          if (this.onTurnComplete) this.onTurnComplete();
          break;
        }

        case 'message_sent': {
          // no-op for UI
          break;
        }

        case 'error': {
          if (this.onError) this.onError(data.message);
          this.isConnected = false;
          break;
        }

        default:
          break;
      }
    } catch (error) {
      if (this.onError) this.onError('Failed to parse server message');
    }
  }

  async startRecording(): Promise<void> {
    if (!this.mediaStream || !this.audioContext) throw new Error('Audio not initialized');
    if (!this.isConnected || !this.websocket) throw new Error('Not connected to server');
    if (this.isRecording) return; // idempotent

    await this.setupAudioProcessor();
    this.isRecording = true;
    if (this.onStatusChange) this.onStatusChange('recording');
  }

  private async setupAudioProcessor(): Promise<void> {
    if (!this.audioContext || !this.mediaStream) return;

    // Create audio source
    this.audioSource = this.audioContext.createMediaStreamSource(this.mediaStream);

    // Create processor
    this.audioProcessor = this.audioContext.createScriptProcessor(
      this.config.chunkSize,
      this.config.channels,
      this.config.channels
    );

    // Stream PCM Int16 at 16k to server after session ready
    this.audioProcessor.onaudioprocess = (event) => {
      if (!this.isRecording || !this.isConnected || !this.websocket) return;
      if (!this.sessionReady) return;
      if (this.websocket.readyState !== WebSocket.OPEN) return;

      const inputBuffer = event.inputBuffer;
      const inputData = inputBuffer.getChannelData(0);
      const inSampleRate = inputBuffer.sampleRate || this.audioContext!.sampleRate;

      const int16Data = this.downsampleBuffer(inputData, inSampleRate, this.config.sampleRate);
      try {
        this.websocket.send(int16Data.buffer);
      } catch {
        this.isConnected = false;
      }
    };

    this.audioSource.connect(this.audioProcessor);
    // Must connect to destination to keep the processor running, volume is controlled by gain during playback
    this.audioProcessor.connect(this.audioContext.destination);
  }

  private float32ToInt16(float32Array: Float32Array): Int16Array {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      int16Array[i] = Math.max(-32768, Math.min(32767, Math.floor(float32Array[i] * 32768)));
    }
    return int16Array;
  }

  private downsampleBuffer(buffer: Float32Array, inSampleRate: number, outSampleRate: number): Int16Array {
    if (!inSampleRate || inSampleRate <= 0) inSampleRate = this.audioContext?.sampleRate || 48000;

    if (outSampleRate === inSampleRate || outSampleRate > inSampleRate) {
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
      const s = Math.max(-1, Math.min(1, sample));
      result[offsetResult] = s < 0 ? Math.round(s * 32768) : Math.round(s * 32767);
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }

    return result;
  }

  private async playAudioResponse(audioData: string, mimeType?: string): Promise<void> {
    if (!this.audioContext || !this.playbackGain) return;
    const ctx = this.audioContext;

    try {
      // Decode base64 to bytes
      const binaryData = atob(audioData);
      const bytes = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) bytes[i] = binaryData.charCodeAt(i);

      // Determine source sample rate from mime_type, default to 24000
      let sourceRate = this.config.outputSampleRate; // default 24000
      if (mimeType && /audio\/pcm/i.test(mimeType)) {
        const match = /rate=(\d{4,6})/.exec(mimeType);
        if (match) {
          sourceRate = parseInt(match[1], 10);
          console.log(`🎵 Detected source rate: ${sourceRate}Hz from mime_type: ${mimeType}`);
        }
      }

      // Interpret PCM16 little-endian
      const samplesI16 = new Int16Array(bytes.buffer, bytes.byteOffset, Math.floor(bytes.byteLength / 2));
      const float32 = new Float32Array(samplesI16.length);
      for (let i = 0; i < samplesI16.length; i++) {
        float32[i] = Math.max(-1, Math.min(1, samplesI16[i] / 32768));
      }

      // Resample from sourceRate -> ctx.sampleRate if needed
      let finalAudio = float32;
      if (sourceRate !== ctx.sampleRate) {
        const ratio = ctx.sampleRate / sourceRate;
        const outLen = Math.floor(float32.length * ratio);
        const resampled = new Float32Array(outLen);
        for (let i = 0; i < outLen; i++) {
          const pos = i / ratio;
          const i0 = Math.floor(pos);
          const frac = pos - i0;
          resampled[i] = i0 + 1 < float32.length 
            ? float32[i0] * (1 - frac) + float32[i0 + 1] * frac 
            : float32[i0] || 0;
        }
        finalAudio = resampled;
        console.log(`🎵 Resampled from ${sourceRate}Hz to ${ctx.sampleRate}Hz (${float32.length} -> ${outLen} samples)`);
      }

      // Create buffer at context rate
      const buffer = ctx.createBuffer(1, finalAudio.length, ctx.sampleRate);
      buffer.copyToChannel(finalAudio, 0, 0);

      // Strict serial queue using nextPlayTime
      const now = ctx.currentTime;
      if (!this.nextPlayTime || this.nextPlayTime < now) {
        this.nextPlayTime = now + 0.01;
      }
      const startTime = this.nextPlayTime;
      this.nextPlayTime += buffer.duration;

      // Create source without aggressive crossfading to avoid "cough" artifacts
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.connect(this.playbackGain);
      
      // Track this source
      this.currentPlayingSources.push(src);
      src.onended = () => {
        const index = this.currentPlayingSources.indexOf(src);
        if (index > -1) {
          this.currentPlayingSources.splice(index, 1);
        }
      };
      
      src.start(startTime);
      
      console.log(`🎵 Queued audio chunk (${finalAudio.length} samples, ${buffer.duration.toFixed(3)}s) at ${startTime.toFixed(3)}s (next: ${this.nextPlayTime.toFixed(3)}s)`);
      
    } catch (error) {
      console.warn('Audio playback error:', error);
    }
  }

  private stopCurrentAudio(): void {
    // Stop all currently playing audio sources
    this.currentPlayingSources.forEach(source => {
      try {
        source.stop();
      } catch {
        // Source might already be stopped
      }
    });
    this.currentPlayingSources = [];
    this.nextPlayTime = 0;
    this.awaitingNewTurnAudio = false;
  }

  stopRecording(): void {
    if (!this.isRecording) return; // idempotent
    this.isRecording = false;

    if (this.audioSource && this.audioProcessor) {
      this.audioSource.disconnect();
      this.audioProcessor.disconnect();
      this.audioProcessor = null;
      this.audioSource = null;
    }

    if (this.onStatusChange) this.onStatusChange('stopped');

    if (this.websocket && this.isConnected && this.websocket.readyState === WebSocket.OPEN) {
      try {
        this.websocket.send(JSON.stringify({
          type: 'end_turn',
          session_id: this.sessionId
        }));
      } catch {
        // ignore
      }
    }
  }

  async sendTextMessage(message: string): Promise<void> {
    if (!this.isConnected || !this.websocket) throw new Error('Not connected');
    if (this.websocket.readyState !== WebSocket.OPEN) {
      this.isConnected = false;
      throw new Error('WebSocket connection lost');
    }

    const messageData = {
      type: 'text_message',
      session_id: this.sessionId,
      message
    };
    this.websocket.send(JSON.stringify(messageData));
  }

  // Public helper for UI toggle
  async toggleRecording(): Promise<void> {
    if (this.isRecording) this.stopRecording();
    else await this.startRecording();
  }

  disconnect(): void {
    // Stop mic first
    this.stopRecording();

    // Stop any currently playing audio
    this.stopCurrentAudio();

    // Close socket (this will trigger database cleanup on backend)
    if (this.websocket) {
      try {
        this.websocket.close();
      } catch {
        // ignore
      }
      this.websocket = null;
    }

    // Stop media
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    // Close audio context
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }

    // Note: Database session cleanup is now handled automatically by WebSocket disconnect
    // on the backend, so we don't need the separate API call anymore

    // Reset flags
    this.isConnected = false;
    this.isRecording = false;
    this.sessionReady = false;
    this.audioEnabled = false;
    this.nextPlayTime = 0;
    this.awaitingNewTurnAudio = false;

    if (this.onStatusChange) this.onStatusChange('disconnected');
  }

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

  getCapabilities(): { audioEnabled: boolean; sessionReady: boolean } {
    return { audioEnabled: this.audioEnabled, sessionReady: this.sessionReady };
  }
}

// Factory function to create and initialize VoiceAgentClient
export async function createVoiceAgent(
  sessionId: string,
  backendUrl: string,
  callbacks?: VoiceAgentCallbacks
): Promise<VoiceAgentClient> {
  const client = new VoiceAgentClient(sessionId, backendUrl, callbacks);
  const initialized = await client.initialize();
  if (!initialized) throw new Error('Failed to initialize audio system');
  await client.connect();
  return client;
}
