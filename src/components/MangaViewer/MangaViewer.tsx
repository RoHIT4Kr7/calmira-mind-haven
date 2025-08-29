import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// components
import MangaPanel from "./MangaPanel";
import Navigation from "./Navigation";
import Reactions from "./Reactions";
import ReadAgain from "./ReadAgain";

// audio
import dialogue1 from "../../assets/audio/dialogue1.mp3";
import dialogue2 from "../../assets/audio/dialogue2.mp3";
import dialogue3 from "../../assets/audio/dialogue3.mp3";
import dialogue4 from "../../assets/audio/dialogue4.mp3";
import background from "../../assets/audio/background-music.mp3";

interface MangaPanelType {
  id: string;
  image: string;
  dialogueAudio: string;
}

interface MangaViewerProps {
  storyData: any[];
}

const MangaViewer = ({ storyData }: MangaViewerProps) => {
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
  const [isStoryFinished, setIsStoryFinished] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [userReaction, setUserReaction] = useState<string | null>(null);

  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const dialogueAudioRef = useRef<HTMLAudioElement | null>(null);

  const mangaPanels: MangaPanelType[] = [
    { id: "1", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop", dialogueAudio: dialogue1 },
    { id: "2", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop", dialogueAudio: dialogue2 },
    { id: "3", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop", dialogueAudio: dialogue3 },
    { id: "4", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop", dialogueAudio: dialogue4 },
  ];

  const currentPanel = mangaPanels[currentPanelIndex];
  const isFirstPanel = currentPanelIndex === 0;
  const isLastPanel = currentPanelIndex === mangaPanels.length - 1;

  // play background
  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0.4;
      bgMusicRef.current.currentTime = 0;
      bgMusicRef.current.play().catch(() => console.log("Background autoplay blocked"));
    }
  }, []);

  // play dialogue audio
  useEffect(() => {
    if (dialogueAudioRef.current) {
      dialogueAudioRef.current.pause();
      dialogueAudioRef.current.src = currentPanel.dialogueAudio;
      dialogueAudioRef.current.currentTime = 0;

      dialogueAudioRef.current.play().catch(() => console.log("Dialogue autoplay blocked"));

      dialogueAudioRef.current.onended = () => {
        if (!isLastPanel) {
          setCurrentPanelIndex((prev) => prev + 1);
        } else {
          setIsStoryFinished(true);
          bgMusicRef.current?.pause();
        }
      };
    }
  }, [currentPanelIndex]);

  const goToNextPanel = () => !isLastPanel && setCurrentPanelIndex((prev) => prev + 1);
  const goToPreviousPanel = () => !isFirstPanel && setCurrentPanelIndex((prev) => prev - 1);

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

  // swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance && !isLastPanel) goToNextPanel();
    if (distance < -minSwipeDistance && !isFirstPanel) goToPreviousPanel();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <audio ref={bgMusicRef} src={background} preload="auto" />
      <audio ref={dialogueAudioRef} preload="auto" />

      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        <Navigation
          goToPreviousPanel={goToPreviousPanel}
          goToNextPanel={goToNextPanel}
          isFirstPanel={isFirstPanel}
          isLastPanel={isLastPanel}
        />

        <MangaPanel
          currentPanel={currentPanel}
          currentPanelIndex={currentPanelIndex}
          mangaPanels={mangaPanels}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          toggleMute={toggleMute}
          isAudioMuted={isAudioMuted}
        />

        <Reactions userReaction={userReaction} handleReaction={handleReaction} />

        <ReadAgain isStoryFinished={isStoryFinished} restartStory={restartStory} />
      </div>
    </div>
  );
};

export default MangaViewer;
