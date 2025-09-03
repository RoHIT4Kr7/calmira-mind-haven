import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const MoodCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const moods = [
    { id: 1, emoji: '😊', label: 'Happy', color: 'from-green-400/20 to-green-600/20' },
    { id: 2, emoji: '😢', label: 'Sad', color: 'from-blue-400/20 to-blue-600/20' },
    { id: 3, emoji: '😴', label: 'Tired', color: 'from-purple-400/20 to-purple-600/20' },
    { id: 4, emoji: '😰', label: 'Anxious', color: 'from-yellow-400/20 to-yellow-600/20' },
    { id: 5, emoji: '😌', label: 'Fine', color: 'from-primary/20 to-primary-medium/20' },
    { id: 6, emoji: '😔', label: 'Depressed', color: 'from-gray-400/20 to-gray-600/20' },
    { id: 7, emoji: '😡', label: 'Angry', color: 'from-red-400/20 to-red-600/20' },
    { id: 8, emoji: '🤗', label: 'Loved', color: 'from-pink-400/20 to-pink-600/20' },
    { id: 9, emoji: '😎', label: 'Confident', color: 'from-orange-400/20 to-orange-600/20' },
    { id: 10, emoji: '🤔', label: 'Thoughtful', color: 'from-teal-400/20 to-teal-600/20' },
    { id: 11, emoji: '😵', label: 'Overwhelmed', color: 'from-indigo-400/20 to-indigo-600/20' },
    { id: 12, emoji: '😊', label: 'Grateful', color: 'from-emerald-400/20 to-emerald-600/20' }
  ];

  // Auto-scroll functionality
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrame: number;
    const scrollSpeed = 0.5; // pixels per frame

    const autoScroll = () => {
      if (scrollContainer) {
        scrollContainer.scrollLeft += scrollSpeed;
        
        // Reset scroll when reaching the end (seamless loop)
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrame = requestAnimationFrame(autoScroll);
    };

    // Start auto-scroll after a short delay
    const timer = setTimeout(() => {
      autoScroll();
    }, 1000);

    // Pause on hover
    const handleMouseEnter = () => {
      cancelAnimationFrame(animationFrame);
    };

    const handleMouseLeave = () => {
      autoScroll();
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrame);
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
        scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Duplicate moods for seamless scrolling
  const duplicatedMoods = [...moods, ...moods];

  return (
    <div className="w-full">
      <h3 className="text-2xl md:text-3xl kalam-bold text-foreground mb-8 text-center">
        Select your current mood
      </h3>
      
      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-hidden scrollbar-hide px-4"
        style={{ scrollBehavior: 'auto' }}
      >
        {duplicatedMoods.map((mood, index) => (
          <motion.button
            key={`${mood.id}-${index}`}
            className={`mood-chip flex-shrink-0 flex flex-col items-center space-y-2 min-w-[120px] h-[100px] bg-gradient-to-br ${mood.color} border border-primary/30 hover:border-primary/50 transition-all duration-300`}
            whileHover={{ 
              scale: 1.05,
              y: -2
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // Handle mood selection
              console.log('Selected mood:', mood.label);
            }}
          >
            <span className="text-3xl">{mood.emoji}</span>
            <span className="text-base kalam-regular font-medium text-foreground">{mood.label}</span>
          </motion.button>
        ))}
      </div>
      
      <p className="text-center text-muted-foreground text-lg kalam-light mt-6">
        Hover to pause • Click to select your mood
      </p>
    </div>
  );
};

export default MoodCarousel;