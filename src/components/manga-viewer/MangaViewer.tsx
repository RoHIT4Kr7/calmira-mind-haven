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
import { Socket } from "socket.io-client";
import { useAudioStateMachine, type PanelAudio } from "../AudioStateMachine";
import BackgroundVideo from "./BackgroundVideo";

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
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [mangaPanels, setMangaPanels] = useState<MangaPanel[]>(storyData);

  // Convert initial panel to AudioStateMachine format
  const initialPanelAudio: PanelAudio | undefined =
    storyData.length > 0
      ? {
          panelId: storyData[0].id,
          panelNumber:
            storyData[0].panelNumber || parseInt(storyData[0].id, 10),
          narrationUrl: storyData[0].narrationUrl,
          backgroundMusicUrl: storyData[0].backgroundMusicUrl,
          ready: Boolean(storyData[0].imageUrl && storyData[0].narrationUrl),
        }
      : undefined;

  // Use Audio State Machine for proper audio orchestration
  const {
    currentState,
    currentPanel,
    audioQueue,
    playPanel,
    pauseAudio,
    resumeAudio,
    stopAudio,
    isAudioMuted,
    toggleMute,
  } = useAudioStateMachine({
    storyId,
    socket,
    onPanelChange: (panelNumber) => {
      console.log(`🎬 Panel changed to ${panelNumber}`);
    },
    onStateChange: (state) => {
      console.log(`🎵 Audio state changed to ${state}`);
      if (state === "ended") {
        setIsStoryFinished(true);
      }
    },
    initialPanel: initialPanelAudio,
  });

  // Calculate current panel index from audio state machine
  const currentPanelIndex = mangaPanels.findIndex(
    (panel) => (panel.panelNumber || parseInt(panel.id, 10)) === currentPanel
  );
  const validCurrentPanelIndex = currentPanelIndex >= 0 ? currentPanelIndex : 0;
  const [isStoryFinished, setIsStoryFinished] = useState(false);

  // Update panels when storyData changes
  useEffect(() => {
    // Normalize incoming story data to include panelNumber and readiness
    const normalized = storyData.map((p) => ({
      ...p,
      panelNumber: p.panelNumber ?? parseInt(p.id, 10),
      ready: Boolean(p.imageUrl && p.narrationUrl),
    }));
    setMangaPanels(normalized);
  }, [storyData]);

  // Listen for panel updates via socket (for UI updates)
  useEffect(() => {
    if (socket && storyId) {
      const handlePanelUpdate = (data: any) => {
        console.log("MangaViewer received panel update:", data);

        if (data.data?.panel_data && data.story_id === storyId) {
          const panelNum: number = Number(data.data.panel_number);
          const imageUrl: string = data.data.panel_data.image_url || "";
          const ttsUrl: string = data.data.panel_data.tts_url || "";

          // Only consider a panel "ready" when both image and narration are available
          const isReady = Boolean(imageUrl && ttsUrl);
          if (!isReady) {
            // Do not add half-baked panels; wait until complete to avoid skipping
            return;
          }

          const newPanel: MangaPanel = {
            id: panelNum.toString(),
            panelNumber: panelNum,
            imageUrl,
            narrationUrl: ttsUrl,
            backgroundMusicUrl:
              data.data.panel_data.music_url ||
              "/src/assets/audio/background-music.mp3",
            ready: true,
          };

          setMangaPanels((prevPanels) => {
            const updatedPanels = [...prevPanels];
            const existingIndex = updatedPanels.findIndex(
              (p) => p.id === newPanel.id
            );

            if (existingIndex >= 0) {
              updatedPanels[existingIndex] = newPanel;
            } else {
              updatedPanels.push(newPanel);
              console.log(
                `🎬 New panel ${newPanel.id} added to story! Total panels: ${updatedPanels.length}`
              );
            }

            // Sort panels by panelNumber to maintain intended order
            const sortedPanels = updatedPanels.sort(
              (a, b) =>
                (a.panelNumber ?? parseInt(a.id)) -
                (b.panelNumber ?? parseInt(b.id))
            );

            // Notify parent component
            if (onPanelUpdate) {
              onPanelUpdate(sortedPanels);
            }

            return sortedPanels;
          });
        }
      };

      socket.on("panel_update", handlePanelUpdate);

      return () => {
        socket.off("panel_update", handlePanelUpdate);
      };
    }
  }, [socket, storyId, onPanelUpdate]);

  const currentPanelData = mangaPanels[validCurrentPanelIndex];
  const isFirstPanel = validCurrentPanelIndex === 0;
  const isLastPanel = validCurrentPanelIndex === mangaPanels.length - 1;

  // Set story finished when audio state machine ends
  useEffect(() => {
    if (currentState === "ended") {
      setIsStoryFinished(true);
    }
  }, [currentState]);

  const goToNextPanel = () => {
    const nextPanelNumber = currentPanel + 1;
    const nextPanel = mangaPanels.find(
      (p) => (p.panelNumber || parseInt(p.id, 10)) === nextPanelNumber
    );
    if (nextPanel && nextPanel.ready) {
      playPanel(nextPanelNumber);
    }
  };

  const goToPreviousPanel = () => {
    const prevPanelNumber = currentPanel - 1;
    if (prevPanelNumber >= 1) {
      const prevPanel = mangaPanels.find(
        (p) => (p.panelNumber || parseInt(p.id, 10)) === prevPanelNumber
      );
      if (prevPanel && prevPanel.ready) {
        playPanel(prevPanelNumber);
      }
    }
  };

  const restartStory = () => {
    setIsStoryFinished(false);
    if (mangaPanels.length > 0) {
      playPanel(1);
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
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col"
      data-current-panel={currentPanel}
      data-audio-state={currentState}
    >
      {/* Background Video */}
      <BackgroundVideo
        videoUrl="https://www.dropbox.com/scl/fi/3byxqbbsk0bkrev2go1mo/background.mp4?rlkey=7u3ka7doa68whlv2of61ndocd&st=9pyexi3u&raw=1"
        fallbackImage="/images/background-fallback.jpg"
      />

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
              key={currentPanel}
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
                {currentPanelData && (
                  <img
                    src={currentPanelData.imageUrl}
                    alt={`Panel ${currentPanel}`}
                    className="w-full h-auto object-cover"
                    style={{ maxHeight: "70vh" }}
                  />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="absolute bottom-4 right-4 bg-black/30 text-white"
                >
                  {isAudioMuted ? <VolumeX /> : <Volume2 />}
                </Button>

                {/* Audio state indicator */}
                <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  {currentState === "loading" && "🔄 Loading..."}
                  {currentState === "playing" && "▶️ Playing"}
                  {currentState === "transitioning" && "⏭️ Next..."}
                  {currentState === "ended" && "✅ Complete"}
                  {currentState === "idle" && "⏸️ Ready"}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="mt-8 text-center max-w-2xl w-full">
          <p className="text-white/90">
            Panel {currentPanel} of {mangaPanels.length}
            {audioQueue.size > 0 && ` (${audioQueue.size} ready)`}
          </p>
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-purple-400 to-pink-400 h-2"
              initial={{ width: 0 }}
              animate={{
                width: `${
                  mangaPanels.length > 0
                    ? (currentPanel / mangaPanels.length) * 100
                    : 0
                }%`,
              }}
              transition={{ duration: 0.5 }}
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
