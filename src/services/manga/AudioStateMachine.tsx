import { useEffect, useRef, useState, useCallback } from "react";
import { Socket } from "socket.io-client";

export type AudioState =
  | "idle"
  | "loading"
  | "playing"
  | "transitioning"
  | "ended";

export interface PanelAudio {
  panelId: string;
  panelNumber: number;
  narrationUrl: string;
  backgroundMusicUrl?: string;
  ready: boolean;
}

export interface AudioStateMachineProps {
  storyId?: string | null;
  socket?: Socket | null;
  onPanelChange?: (panelNumber: number) => void;
  onStateChange?: (state: AudioState) => void;
  initialPanel?: PanelAudio;
}

export interface AudioStateMachineReturn {
  currentState: AudioState;
  currentPanel: number;
  audioQueue: Map<number, PanelAudio>;
  playPanel: (panelNumber: number) => Promise<void>;
  pauseAudio: () => void;
  resumeAudio: () => void;
  stopAudio: () => void;
  isAudioMuted: boolean;
  toggleMute: () => void;
}

/**
 * Finite State Machine for TTS Audio Orchestration
 *
 * Prevents audio interruption by ensuring only one narration plays at a time
 * and queues incoming panel audio until the current panel finishes.
 *
 * States:
 * - idle: No audio playing, ready to start
 * - loading: Audio is being loaded/buffered
 * - playing: Audio is currently playing
 * - transitioning: Moving from one panel to the next
 * - ended: All audio/story completed
 */
export const useAudioStateMachine = ({
  storyId,
  socket,
  onPanelChange,
  onStateChange,
  initialPanel,
}: AudioStateMachineProps): AudioStateMachineReturn => {
  // Core state
  const [currentState, setCurrentState] = useState<AudioState>("idle");
  const [currentPanel, setCurrentPanel] = useState<number>(0);
  const [audioQueue, setAudioQueue] = useState<Map<number, PanelAudio>>(
    new Map()
  );
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Audio element refs
  const narrationRef = useRef<HTMLAudioElement | null>(null);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);

  // Flags for state management
  const isTransitioningRef = useRef(false);
  const shouldAdvanceRef = useRef(true);

  // Initialize audio elements
  useEffect(() => {
    if (!narrationRef.current) {
      narrationRef.current = new Audio();
      narrationRef.current.preload = "auto";
    }

    if (!backgroundMusicRef.current) {
      backgroundMusicRef.current = new Audio();
      backgroundMusicRef.current.preload = "auto";
      backgroundMusicRef.current.loop = true;
      backgroundMusicRef.current.volume = 0.3; // Lower volume for background
    }

    return () => {
      // Cleanup audio elements
      if (narrationRef.current) {
        narrationRef.current.pause();
        narrationRef.current.src = "";
      }
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.src = "";
      }
    };
  }, []);

  // State change callback
  const changeState = useCallback(
    (newState: AudioState) => {
      // Stop background music when story ends
      if (newState === "ended" && backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
      }

      setCurrentState(newState);
      onStateChange?.(newState);
    },
    [currentState, onStateChange]
  );

  // Add panel to queue
  const queuePanel = useCallback((panelAudio: PanelAudio) => {
    setAudioQueue((prev) => {
      const newQueue = new Map(prev);
      newQueue.set(panelAudio.panelNumber, panelAudio);
      return newQueue;
    });
  }, []);

  // Get next panel in sequence
  const getNextPanel = useCallback((): PanelAudio | null => {
    const nextPanelNumber = currentPanel + 1;
    return audioQueue.get(nextPanelNumber) || null;
  }, [currentPanel, audioQueue]);

  // Play specific panel
  const playPanel = useCallback(
    async (panelNumber: number): Promise<void> => {
      const panelAudio = audioQueue.get(panelNumber);

      if (!panelAudio || !panelAudio.ready) {
        console.warn(`🎵 Panel ${panelNumber} not ready or not found`);
        return;
      }

      if (currentState === "playing" && currentPanel === panelNumber) {
        return;
      }

      try {
        changeState("loading");
        isTransitioningRef.current = true;

        // Stop current audio
        if (narrationRef.current) {
          narrationRef.current.pause();
          narrationRef.current.currentTime = 0;
        }

        // Stop current background music when transitioning
        if (backgroundMusicRef.current) {
          backgroundMusicRef.current.pause();
          backgroundMusicRef.current.currentTime = 0;
        }

        // Load new narration
        if (narrationRef.current && panelAudio.narrationUrl) {
          narrationRef.current.src = panelAudio.narrationUrl;
          narrationRef.current.currentTime = 0;
          narrationRef.current.muted = isAudioMuted;

          // Wait for audio to be ready
          await new Promise<void>((resolve, reject) => {
            const audio = narrationRef.current!;

            const onCanPlay = () => {
              audio.removeEventListener("canplay", onCanPlay);
              audio.removeEventListener("error", onError);
              resolve();
            };

            const onError = () => {
              audio.removeEventListener("canplay", onCanPlay);
              audio.removeEventListener("error", onError);
              reject(
                new Error(`Failed to load audio for panel ${panelNumber}`)
              );
            };

            audio.addEventListener("canplay", onCanPlay);
            audio.addEventListener("error", onError);

            // Trigger load
            audio.load();
          });

          // Set up ended event handler
          narrationRef.current.onended = () => {
            if (!shouldAdvanceRef.current) {
              return;
            }

            // Always check for next panel, even if not in queue yet
            const nextPanelNumber = panelNumber + 1;

            if (nextPanelNumber <= 6) {
              // Check immediately first
              const nextPanel = audioQueue.get(nextPanelNumber);
              if (nextPanel && nextPanel.ready) {
                playPanel(nextPanelNumber);
              } else {
                changeState("transitioning");

                // Set up a polling mechanism to wait for the next panel
                const checkNextPanel = () => {
                  const panel = audioQueue.get(nextPanelNumber);
                  if (panel && panel.ready) {
                    playPanel(nextPanelNumber);
                  } else {
                    // Continue polling every 500ms until panel is ready
                    setTimeout(checkNextPanel, 500);
                  }
                };

                // Start polling after a short delay
                setTimeout(checkNextPanel, 500);
              }
            } else {
              // Stop background music when story ends
              if (backgroundMusicRef.current) {
                backgroundMusicRef.current.pause();
                backgroundMusicRef.current.currentTime = 0;
              }
              changeState("ended");
            }
          };

          // Start playback
          await narrationRef.current.play();

          // Update current panel and state
          setCurrentPanel(panelNumber);
          changeState("playing");
          isTransitioningRef.current = false;

          // Notify parent component
          onPanelChange?.(panelNumber);

          // Start background music if available
          if (
            backgroundMusicRef.current &&
            panelAudio.backgroundMusicUrl &&
            !isAudioMuted
          ) {
            backgroundMusicRef.current.src = panelAudio.backgroundMusicUrl;
            backgroundMusicRef.current.volume = 0.3;
            backgroundMusicRef.current.currentTime = 0;
            backgroundMusicRef.current.play().catch((e) => {
              console.warn("Background music autoplay blocked:", e);
            });
          }
        }
      } catch (error) {
        console.error(`🎵 Failed to play panel ${panelNumber}:`, error);
        changeState("idle");
        isTransitioningRef.current = false;
      }
    },
    [
      audioQueue,
      currentState,
      currentPanel,
      isAudioMuted,
      changeState,
      onPanelChange,
      getNextPanel,
    ]
  );

  // Advance to next panel
  const advanceToNextPanel = useCallback(() => {
    if (isTransitioningRef.current) {
      return;
    }

    const nextPanel = getNextPanel();
    if (nextPanel && nextPanel.ready) {
      changeState("transitioning");
      playPanel(nextPanel.panelNumber);
    } else {
      changeState("ended");
    }
  }, [getNextPanel, playPanel, changeState]);

  // Audio control functions
  const pauseAudio = useCallback(() => {
    if (narrationRef.current) {
      narrationRef.current.pause();
    }
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
    }
  }, []);

  const resumeAudio = useCallback(() => {
    if (narrationRef.current && currentState === "playing") {
      narrationRef.current.play().catch(console.error);
    }
    if (backgroundMusicRef.current && !isAudioMuted) {
      backgroundMusicRef.current.play().catch(console.error);
    }
  }, [currentState, isAudioMuted]);

  const stopAudio = useCallback(() => {
    if (narrationRef.current) {
      narrationRef.current.pause();
      narrationRef.current.currentTime = 0;
    }
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
    }
    changeState("idle");
    setCurrentPanel(0);
  }, [changeState]);

  const toggleMute = useCallback(() => {
    const newMutedState = !isAudioMuted;
    setIsAudioMuted(newMutedState);

    if (narrationRef.current) {
      narrationRef.current.muted = newMutedState;
    }

    if (backgroundMusicRef.current) {
      if (newMutedState) {
        backgroundMusicRef.current.pause();
      } else if (currentState === "playing") {
        backgroundMusicRef.current.play().catch(console.error);
      }
    }
  }, [isAudioMuted, currentState]);

  // Listen for panel updates via WebSocket
  useEffect(() => {
    if (!socket || !storyId) return;

    const handlePanelUpdate = (data: any) => {
      if (data.data?.panel_data && data.story_id === storyId) {
        const panelNumber = Number(data.data.panel_number);
        const imageUrl = data.data.panel_data.image_url || "";
        const ttsUrl = data.data.panel_data.tts_url || "";

        // Only queue if both image and TTS are ready
        if (imageUrl && ttsUrl) {
          const panelAudio: PanelAudio = {
            panelId: panelNumber.toString(),
            panelNumber,
            narrationUrl: ttsUrl,
            backgroundMusicUrl:
              data.data.panel_data.music_url ||
              "/src/assets/audio/background-music.mp3",
            ready: true,
          };

          queuePanel(panelAudio);

          // If this is panel 1 and we're idle, start immediately
          if (panelNumber === 1 && currentState === "idle") {
            // Use setTimeout to ensure state is properly set
            setTimeout(() => playPanel(1), 100);
          }

          // If we're waiting for this specific panel, play it now
          if (
            currentState === "transitioning" &&
            panelNumber === currentPanel + 1
          ) {
            setTimeout(() => playPanel(panelNumber), 100);
          }
        }
      }
    };

    // Also listen for the older event format for compatibility
    const handlePanelProcessingComplete = (data: any) => {
      handlePanelUpdate(data); // Reuse the same logic
    };

    // Listen for slideshow start event
    const handleSlideshowStart = (data: any) => {
      if (data.story_id === storyId && data.first_panel) {
        const panelNumber = Number(data.first_panel.panel_number);
        const imageUrl = data.first_panel.image_url || "";
        const ttsUrl = data.first_panel.tts_url || "";

        if (imageUrl && ttsUrl) {
          const panelAudio: PanelAudio = {
            panelId: panelNumber.toString(),
            panelNumber,
            narrationUrl: ttsUrl,
            backgroundMusicUrl:
              data.first_panel.music_url ||
              "/src/assets/audio/background-music.mp3",
            ready: true,
          };

          queuePanel(panelAudio);

          // Start slideshow immediately
          setTimeout(() => playPanel(1), 100);
        }
      }
    };

    socket.on("panel_update", handlePanelUpdate);
    socket.on("panel_processing_complete", handlePanelProcessingComplete);
    socket.on("slideshow_start", handleSlideshowStart);

    return () => {
      socket.off("panel_update", handlePanelUpdate);
      socket.off("panel_processing_complete", handlePanelProcessingComplete);
      socket.off("slideshow_start", handleSlideshowStart);
    };
  }, [socket, storyId, currentState, queuePanel, playPanel]);

  // Initialize with initial panel if provided
  useEffect(() => {
    if (initialPanel && currentState === "idle") {
      queuePanel(initialPanel);
      playPanel(initialPanel.panelNumber);
    }
  }, [initialPanel, currentState, queuePanel, playPanel]);

  return {
    currentState,
    currentPanel,
    audioQueue,
    playPanel,
    pauseAudio,
    resumeAudio,
    stopAudio,
    isAudioMuted,
    toggleMute,
  };
};

export default useAudioStateMachine;
