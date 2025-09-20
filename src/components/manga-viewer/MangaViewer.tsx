import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Volume2,
  VolumeX,
  Play,
  Pause,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Socket } from "socket.io-client";
import LumaSpin from "@/components/ui/luma-spin";
import { SigninGradientBackground } from "@/components/ui/signin-gradient-background";

interface MangaPanel {
  id: string;
  imageUrl: string;
  narrationUrl: string;
  backgroundMusicUrl?: string;
  panelNumber?: number;
  ready?: boolean;
}

interface MangaViewerProps {
  storyData: MangaPanel[];
  storyId?: string | null;
  socket?: Socket | null;
  onPanelUpdate?: (panels: MangaPanel[]) => void;
}

const MangaViewer = ({
  storyData,
  storyId,
  socket,
  onPanelUpdate,
}: MangaViewerProps) => {
  console.log("🎬 MangaViewer rendering with storyData:", storyData);

  const [mangaPanels, setMangaPanels] = useState<MangaPanel[]>(storyData || []);
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isStoryFinished, setIsStoryFinished] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Update panels when storyData changes
  useEffect(() => {
    console.log("🎬 StoryData changed:", storyData);
    if (storyData && storyData.length > 0) {
      const normalized = storyData.map((p, index) => ({
        ...p,
        panelNumber: p.panelNumber ?? index + 1,
        ready: Boolean(p.imageUrl && p.narrationUrl),
      }));
      setMangaPanels(normalized);
      console.log("🎬 Normalized panels:", normalized);
    }
  }, [storyData]);

  // Listen for panel updates via socket
  useEffect(() => {
    if (socket && storyId) {
      const handlePanelUpdate = (data: any) => {
        console.log("🔄 Panel update received:", data);

        if (data.data?.panel_data && data.data?.panel_number) {
          const panelData = data.data.panel_data;
          const panelNum = data.data.panel_number;

          if (panelData.image_url && panelData.tts_url) {
            const updatedPanel: MangaPanel = {
              id: panelNum.toString(),
              imageUrl: panelData.image_url,
              narrationUrl: panelData.tts_url,
              backgroundMusicUrl:
                panelData.music_url || "/src/assets/audio/background-music.mp3",
              panelNumber: panelNum,
              ready: true,
            };

            setMangaPanels((prevPanels) => {
              const updatedPanels = [...prevPanels];
              const existingIndex = updatedPanels.findIndex(
                (p) => p.id === panelNum.toString()
              );

              if (existingIndex >= 0) {
                updatedPanels[existingIndex] = updatedPanel;
              } else {
                updatedPanels.push(updatedPanel);
              }

              const sortedPanels = updatedPanels.sort(
                (a, b) => (a.panelNumber || 0) - (b.panelNumber || 0)
              );

              if (onPanelUpdate) {
                onPanelUpdate(sortedPanels);
              }

              return sortedPanels;
            });
          }
        }
      };

      socket.on("panel_update", handlePanelUpdate);
      socket.on("panel_complete", handlePanelUpdate);

      return () => {
        socket.off("panel_update", handlePanelUpdate);
        socket.off("panel_complete", handlePanelUpdate);
      };
    }
  }, [socket, storyId, onPanelUpdate]);

  const currentPanelData = mangaPanels[currentPanelIndex];
  const isFirstPanel = currentPanelIndex === 0;
  const isLastPanel = currentPanelIndex >= mangaPanels.length - 1;

  // Audio event handlers
  const handleAudioEnded = () => {
    setIsPlaying(false);
    if (currentPanelIndex < mangaPanels.length - 1) {
      // Auto-advance to next panel
      setTimeout(() => {
        goToNextPanel();
      }, 1000);
    } else {
      setIsStoryFinished(true);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const goToNextPanel = () => {
    if (currentPanelIndex < mangaPanels.length - 1) {
      const nextIndex = currentPanelIndex + 1;
      setCurrentPanelIndex(nextIndex);
      setIsPlaying(false);

      // Start audio for next panel
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
          setIsPlaying(true);
        }
      }, 500);
    }
  };

  const goToPreviousPanel = () => {
    if (currentPanelIndex > 0) {
      const prevIndex = currentPanelIndex - 1;
      setCurrentPanelIndex(prevIndex);
      setIsPlaying(false);

      // Start audio for previous panel
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
          setIsPlaying(true);
        }
      }, 500);
    }
  };

  const restartStory = () => {
    setCurrentPanelIndex(0);
    setIsStoryFinished(false);
    setIsPlaying(false);
  };

  const toggleMute = () => {
    setIsAudioMuted(!isAudioMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isAudioMuted;
    }
  };

  // Auto-start first panel
  useEffect(() => {
    if (mangaPanels.length > 0 && currentPanelIndex === 0 && !isPlaying) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(() => {
            console.log("Auto-play prevented by browser");
          });
        }
      }, 1000);
    }
  }, [mangaPanels.length]);

  // Show loading if no panels available
  if (!currentPanelData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center">
        <div className="text-center space-y-6 flex flex-col items-center">
          <LumaSpin />
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 mb-4">
              Generating Your Story
            </h2>
            <p className="text-white/70 text-lg">
              Creating a personalized manga experience just for you...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SigninGradientBackground>
      <div className="min-h-screen flex flex-col">
        {/* Header with panel indicators */}
        <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
              Your Manga Story
            </h1>

            {/* Panel indicators */}
            <div className="flex items-center space-x-2">
              {mangaPanels.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPanelIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentPanelIndex
                      ? "bg-white scale-125"
                      : index < currentPanelIndex
                      ? "bg-purple-400"
                      : "bg-white/30"
                  }`}
                  title={`Panel ${index + 1}`}
                />
              ))}
            </div>

            {/* Panel counter */}
            <div className="text-white/70 text-sm">
              Panel {currentPanelIndex + 1} of {mangaPanels.length}
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-4xl w-full">
            {/* Panel image */}
            <div className="relative bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentPanelIndex}
                  src={currentPanelData.imageUrl}
                  alt={`Manga Panel ${currentPanelIndex + 1}`}
                  className="w-full h-auto max-h-[70vh] object-contain"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  onLoad={() =>
                    console.log(
                      `🖼️ Image loaded for panel ${currentPanelIndex + 1}`
                    )
                  }
                  onError={(e) =>
                    console.error(
                      `❌ Image error for panel ${currentPanelIndex + 1}:`,
                      e
                    )
                  }
                />
              </AnimatePresence>

              {/* Audio controls overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                {/* Audio controls */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={goToPreviousPanel}
                      disabled={isFirstPanel}
                      variant="ghost"
                      size="icon"
                      className="p-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                      title="Previous Panel"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>

                    <Button
                      onClick={handlePlayPause}
                      variant="ghost"
                      size="icon"
                      className="p-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-colors"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? (
                        <Pause className="w-8 h-8" />
                      ) : (
                        <Play className="w-8 h-8" />
                      )}
                    </Button>

                    <Button
                      onClick={goToNextPanel}
                      disabled={isLastPanel}
                      variant="ghost"
                      size="icon"
                      className="p-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                      title="Next Panel"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </div>

                  {/* Mute button */}
                  <Button
                    onClick={toggleMute}
                    variant="ghost"
                    size="icon"
                    className="p-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-colors"
                    title={isAudioMuted ? "Unmute" : "Mute"}
                  >
                    {isAudioMuted ? (
                      <VolumeX className="w-6 h-6" />
                    ) : (
                      <Volume2 className="w-6 h-6" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Read Again Button */}
        {isStoryFinished && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center pb-8"
          >
            <Button
              onClick={restartStory}
              variant="outline"
              className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 rounded-xl"
            >
              <RotateCcw className="mr-2 w-4 h-4" />
              Read Again
            </Button>
          </motion.div>
        )}

        {/* Audio element (hidden) */}
        {currentPanelData && (
          <audio
            ref={audioRef}
            key={`panel-${currentPanelIndex}-audio`}
            src={currentPanelData.narrationUrl}
            preload="metadata"
            muted={isAudioMuted}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={handleAudioEnded}
            onError={(e) =>
              console.error(
                `❌ Audio error for panel ${currentPanelIndex + 1}:`,
                e
              )
            }
            className="hidden"
          />
        )}
      </div>
    </SigninGradientBackground>
  );
};

export default MangaViewer;
