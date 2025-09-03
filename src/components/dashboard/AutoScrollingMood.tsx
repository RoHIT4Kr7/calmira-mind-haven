import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AutoScrollingMood: React.FC = () => {
  const moods = [
    'Happy',
    'Depressed',
    'Feeling not well',
    'Anxious',
    'Excited',
    'Overwhelmed',
    'Peaceful',
    'Confused',
    'Hopeful',
    'Tired',
    'Grateful',
    'Frustrated'
  ];

  const [currentMoodIndex, setCurrentMoodIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMoodIndex((prevIndex) => (prevIndex + 1) % moods.length);
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval);
  }, [moods.length]);

  return (
    <div className="h-12 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMoodIndex}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ 
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1]
          }}
          className="text-2xl md:text-3xl inter-light text-muted-foreground"
        >
          {moods[currentMoodIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AutoScrollingMood;