import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MangaPanel {
  id: string;
  image: string;
  dialogue: string;
  caption: string;
  audio: string;
}

interface MangaViewerProps {
  storyData: any[]; // Keeping original prop for compatibility
}

const MangaViewer = ({ storyData }: MangaViewerProps) => {
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Dummy manga data with immersive content
  const mangaPanels: MangaPanel[] = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      dialogue: "I will overcome this challenge!",
      caption: "The hero stands at the crossroads of destiny, ready to face whatever lies ahead...",
      audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      dialogue: "Every step forward is a victory...",
      caption: "Through the darkness, a glimmer of hope emerges like the first light of dawn.",
      audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
      dialogue: "The journey within begins now!",
      caption: "In the quiet moments, we discover our true strength and purpose.",
      audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    {
      id: "4",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop",
      dialogue: "This is just the beginning of my story...",
      caption: "And so, the hero's journey continues, with endless possibilities ahead.",
      audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    }
  ];

  const currentPanel = mangaPanels[currentPanelIndex];
  const isFirstPanel = currentPanelIndex === 0;
  const isLastPanel = currentPanelIndex === mangaPanels.length - 1;

  // Audio playback effect
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      
      if (currentPanel?.audio) {
        audioRef.current.src = currentPanel.audio;
        if (isAudioPlaying) {
          audioRef.current.play().catch((error) => {
            console.log("Audio playback failed:", error);
            setIsAudioPlaying(false);
          });
        }
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [currentPanelIndex, currentPanel?.audio, isAudioPlaying]);

  const goToNextPanel = () => {
    if (!isLastPanel) {
      setCurrentPanelIndex(prev => prev + 1);
      setUserReaction(null); // Reset reaction for new panel
    }
  };

  const goToPreviousPanel = () => {
    if (!isFirstPanel) {
      setCurrentPanelIndex(prev => prev - 1);
      setUserReaction(null); // Reset reaction for new panel
    }
  };

  const restartStory = () => {
    setCurrentPanelIndex(0);
    setUserReaction(null);
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      } else {
        audioRef.current.play().catch((error) => {
          console.log("Audio playback failed:", error);
          setIsAudioPlaying(false);
        });
        setIsAudioPlaying(true);
      }
    }
  };

  const handleReaction = (reaction: string) => {
    setUserReaction(userReaction === reaction ? null : reaction);
  };

  // Touch/swipe functionality for mobile
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
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && !isLastPanel) {
      goToNextPanel();
    } else if (isRightSwipe && !isFirstPanel) {
      goToPreviousPanel();
    }
  };

  const reactions = [
    { emoji: "❤️", label: "Love", value: "love" },
    { emoji: "😢", label: "Touched", value: "touched" },
    { emoji: "🌸", label: "Beautiful", value: "beautiful" },
    { emoji: "✨", label: "Inspired", value: "inspired" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Hidden audio element */}
      <audio 
        ref={audioRef} 
        preload="auto" 
        onEnded={() => setIsAudioPlaying(false)}
        onError={() => setIsAudioPlaying(false)}
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        <div className="relative max-w-4xl w-full">
          {/* Navigation arrows - Desktop */}
          <div className="hidden md:flex absolute inset-0 items-center justify-between pointer-events-none z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPreviousPanel}
              disabled={isFirstPanel}
              className="pointer-events-auto bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 disabled:opacity-50 border border-white/20"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNextPanel}
              disabled={isLastPanel}
              className="pointer-events-auto bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 disabled:opacity-50 border border-white/20"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>

          {/* Manga Panel Container */}
          <div
            className="relative w-full max-w-2xl mx-auto"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <motion.div
              key={currentPanelIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative"
            >
              {/* Panel Card */}
              <div className="bg-gradient-to-br from-white/95 to-gray-50/95 rounded-xl shadow-2xl overflow-hidden border border-white/20 backdrop-blur-sm">
                {/* Panel Image */}
                <div className="relative">
                  <img
                    src={currentPanel.image}
                    alt={`Panel ${currentPanelIndex + 1}`}
                    className="w-full h-auto object-cover"
                    style={{ maxHeight: "70vh" }}
                  />
                  
                  {/* Speech Bubble */}
                  <div className="absolute top-4 left-4 right-4">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 max-w-xs">
                      <p className="text-gray-800 font-medium text-sm leading-relaxed">
                        "{currentPanel.dialogue}"
                      </p>
                      {/* Speech bubble tail */}
                      <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white/95 transform rotate-45 border-r border-b border-white/50"></div>
                    </div>
                  </div>

                  {/* Audio Control Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleAudio}
                    className="absolute bottom-4 right-4 bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 border border-white/20"
                  >
                    {isAudioPlaying ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                </div>

                {/* Caption Bar */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4">
                  <p className="text-sm leading-relaxed font-medium">
                    {currentPanel.caption}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mt-8 text-center space-y-4 max-w-2xl w-full">
          {/* Panel Counter */}
          <p className="text-white/90 font-medium text-lg">
            Panel {currentPanelIndex + 1} of {mangaPanels.length}
          </p>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentPanelIndex + 1) / mangaPanels.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
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

        {/* Read Again button - only on last panel */}
        {isLastPanel && (
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="outline"
              onClick={restartStory}
              className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Read Again
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MangaViewer;
