import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AutoScrollingMood: React.FC = () => {
  const moods = [
    "It's okay to take a deep breath and slow down.",
    "Your feelings are valid, no matter how small they seem.",
    "Healing takes time—be gentle with yourself.",
    "Every step forward counts, even the tiny ones.",
    "You are stronger than you think you are.",
    "Asking for help is a sign of courage, not weakness.",
    "Peace of mind begins with self-kindness.",
    "It's okay to not be okay—you're not alone.",
    "Hope is the quiet voice that says 'try again tomorrow.'",
    "Gratitude can turn little things into enough.",
    "Rest is not a waste of time, it’s part of recovery.",
    "You deserve love, care, and happiness."
  ];

  const [currentMoodIndex, setCurrentMoodIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMoodIndex((prevIndex) => (prevIndex + 1) % moods.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [moods.length]);

  return (
    <div className="h-14 flex overflow-hidden items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMoodIndex}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.25, 0.1, 0.25, 1]
          }}
          className="text-xl md:text-2xl font-semibold italic text-[#575454] drop-shadow-[0_0_1px_rgba(255,255,255,0.3)]"
        >
          {moods[currentMoodIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AutoScrollingMood;
