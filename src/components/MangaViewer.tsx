import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

//audio files
import dialogue1 from "../assets/audio/dialogue1.mp3";
import dialogue2 from "../assets/audio/dialogue2.mp3";
import dialogue3 from "../assets/audio/dialogue3.mp3";
import dialogue4 from "../assets/audio/dialogue4.mp3";
import background from "../assets/audio/background-music.mp3";

interface MangaPanel {
  id: string;
  image: string;
  dialogueAudio: string; // dialogue audio instead of text
}

interface MangaViewerProps {
  storyData: any[]; // Keeping original prop for compatibility
}

const MangaViewer = ({ storyData }: MangaViewerProps) => {
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
  const [isStoryFinished, setIsStoryFinished] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [userReaction, setUserReaction] = useState<string | null>(null);

  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const dialogueAudioRef = useRef<HTMLAudioElement | null>(null);

  // Panels with dialogue audio
  const mangaPanels: MangaPanel[] = [
    {
      id: "1",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      dialogueAudio: dialogue1,
    },
    {
      id: "2",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      dialogueAudio: dialogue2,
    },
    {
      id: "3",
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
      dialogueAudio: dialogue3,
    },
    {
      id: "4",
      image:
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop",
      dialogueAudio: dialogue4,
    },
  ];

  const currentPanel = mangaPanels[currentPanelIndex];
  const isFirstPanel = currentPanelIndex === 0;
  const isLastPanel = currentPanelIndex === mangaPanels.length - 1;

  // Play looping background music once
  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0.4;
      bgMusicRef.current.currentTime = 0;
      bgMusicRef.current
        .play()
        .catch(() => console.log("Background autoplay blocked"));
    }
  }, []);

  // Handle dialogue audio playback
  useEffect(() => {
    if (dialogueAudioRef.current) {
      dialogueAudioRef.current.pause();
      dialogueAudioRef.current.src = currentPanel.dialogueAudio;
      dialogueAudioRef.current.currentTime = 0;

      dialogueAudioRef.current
        .play()
        .catch(() => console.log("Dialogue autoplay blocked"));

      dialogueAudioRef.current.onended = () => {
        if (!isLastPanel) {
          setCurrentPanelIndex((prev) => prev + 1);
        } else {
          setIsStoryFinished(true);
          if (bgMusicRef.current) {
            bgMusicRef.current.pause();
          }
        }
      };
    }
  }, [currentPanelIndex]);

  const goToNextPanel = () => {
    if (!isLastPanel) setCurrentPanelIndex((prev) => prev + 1);
  };

  const goToPreviousPanel = () => {
    if (!isFirstPanel) setCurrentPanelIndex((prev) => prev - 1);
  };

  const restartStory = () => {
    setCurrentPanelIndex(0);
    setIsStoryFinished(false);

    if (bgMusicRef.current) {
      bgMusicRef.current.currentTime = 0;
      bgMusicRef.current.play().catch(() => console.log("BG restart blocked"));
    }
  };

  const toggleMute = () => {
    if (bgMusicRef.current) {
      bgMusicRef.current.muted = !isAudioMuted;
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const handleReaction = (reaction: string) => {
    setUserReaction(userReaction === reaction ? null : reaction);
  };

  // Touch/swipe functionality
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance && !isLastPanel) goToNextPanel();
    if (distance < -minSwipeDistance && !isFirstPanel) goToPreviousPanel();
  };

  const reactions = [
    { emoji: "❤️", label: "Love", value: "love" },
    { emoji: "😢", label: "Touched", value: "touched" },
    { emoji: "🌸", label: "Beautiful", value: "beautiful" },
    { emoji: "✨", label: "Inspired", value: "inspired" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Hidden audio elements */}
      <audio ref={bgMusicRef} src={background} preload="auto" />
      <audio ref={dialogueAudioRef} preload="auto" />

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        <div className="relative max-w-4xl w-full">
          {/* Arrows Desktop */}
          <div className="hidden md:flex absolute inset-0 items-center justify-between pointer-events-none z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPreviousPanel}
              disabled={isFirstPanel}
              className="pointer-events-auto bg-black/20 text-white"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNextPanel}
              disabled={isLastPanel}
              className="pointer-events-auto bg-black/20 text-white"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>

          {/* Manga Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPanelIndex}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="w-full max-w-3xl mx-auto p-4"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-lg border border-white/10">
                {/* Progress bar OVER the image */}
                <div className="absolute top-0 left-0 w-full z-20">
                  <div className="w-full bg-white/20 h-2 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-purple-400 to-pink-400 h-2"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          ((currentPanelIndex + 1) / mangaPanels.length) * 100
                        }%`,
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Manga Image */}
                <img
                  src={currentPanel.image}
                  alt={`Panel ${currentPanelIndex + 1}`}
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: "70vh" }}
                />

                {/* Mute/Unmute Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="absolute bottom-4 right-4 bg-black/30 text-white"
                >
                  {isAudioMuted ? <VolumeX /> : <Volume2 />}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Reactions Section */}
        <div className="mt-6 flex justify-center space-x-4">
          {reactions.map((reaction) => (
            <button
              key={reaction.value}
              onClick={() => handleReaction(reaction.value)}
              className={`p-3 rounded-full transition-all duration-200 hover:scale-110 ${
                userReaction === reaction.value
                  ? "bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg"
                  : "bg-black/20 backdrop-blur-sm border border-white/10 hover:bg-black/30"
              }`}
              title={reaction.label}
            >
              <span className="text-2xl">{reaction.emoji}</span>
            </button>
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-center mt-6 space-x-4">
          <Button
            variant="outline"
            onClick={goToPreviousPanel}
            disabled={isFirstPanel}
            className="bg-black/20 backdrop-blur-sm text-white border-white/20 hover:bg-black/40"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={goToNextPanel}
            disabled={isLastPanel}
            className="bg-black/20 backdrop-blur-sm text-white border-white/20 hover:bg-black/40"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Read Again */}
        {isStoryFinished && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <Button
              variant="outline"
              onClick={restartStory}
              className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20"
            >
              <RotateCcw className="mr-2" /> Read Again
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MangaViewer;
