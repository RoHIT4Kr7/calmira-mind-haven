import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

const MangaPanel = ({
  currentPanel,
  currentPanelIndex,
  mangaPanels,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  toggleMute,
  isAudioMuted,
}: any) => {
  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPanelIndex}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="w-full mx-auto p-4"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-lg border border-white/10">
            {/* progress bar */}
            <div className="absolute top-0 left-0 w-full">
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden relative">
                <motion.div
                  className="absolute top-0 left-0 h-2 bg-gradient-to-r from-purple-500 via-pink-400 to-yellow-400 blur-md opacity-70"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentPanelIndex + 1) / mangaPanels.length) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
                <motion.div
                  className="relative bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-300 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentPanelIndex + 1) / mangaPanels.length) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </div>
            </div>
            <img src={currentPanel.image} alt={`Panel ${currentPanelIndex + 1}`} className="w-full h-auto object-cover" style={{ maxHeight: "70vh" }} />
            <Button variant="ghost" size="icon" onClick={toggleMute} className="absolute bottom-4 right-4 bg-black/30 text-white">
              {isAudioMuted ? <VolumeX /> : <Volume2 />}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MangaPanel;
