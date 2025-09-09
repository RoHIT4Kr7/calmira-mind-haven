import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "https://cdn.pixabay.com/photo/2024/04/19/22/25/man-8707406_1280.png",
  "https://t4.ftcdn.net/jpg/14/27/28/67/360_F_1427286746_UwO6tRjhPCPZYKVsLcTqvqjFP6goJGzy.jpg",
  "https://www.shutterstock.com/shutterstock/videos/3685780505/thumb/4.jpg?ip=x480",
  "https://watermark.lovepik.com/photo/40195/1483.jpg_wh1200.jpg",
  "https://i.pinimg.com/736x/eb/4f/19/eb4f19903cfea9975818c9d36dbe8f9c.jpg",
];

const HeroRight: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const next = () => {
    setDirection("right");
    setCurrent((c) => (c + 1) % images.length);
  };
  const prev = () => {
    setDirection("left");
    setCurrent((c) => (c - 1 + images.length) % images.length);
  };

  const idx = (i: number) => (i + images.length) % images.length;
  const prevIdx = idx(current - 1);
  const nextIdx = idx(current + 1);

  const variants = {
    enterFromRight: { x: 300, opacity: 0, scale: 0.9, rotate: 10 },
    enterFromLeft: { x: -300, opacity: 0, scale: 0.9, rotate: -10 },
    center: { x: 0, opacity: 1, scale: 1, rotate: 0 },
    leftPeek: { x: -72, opacity: 0.95, scale: 0.92, rotate: -8 },
    rightPeek: { x: 72, opacity: 0.95, scale: 0.92, rotate: 8 },
    exitLeft: { x: -180, opacity: 0, scale: 0.9, rotate: -12 },
    exitRight: { x: 180, opacity: 0, scale: 0.9, rotate: 12 },
  };

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    const threshold = 80;
    if (info.offset.x < -threshold) next();
    else if (info.offset.x > threshold) prev();
  };

  return (
    <div className="flex justify-center lg:justify-end">
      <div className="relative" ref={containerRef}>
        {/* Left Arrow */}
        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute -left-12 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-3 hover:scale-105 transition z-20"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Cards viewport */}
        <div className="w-[320px] h-[420px] md:w-[380px] md:h-[480px] relative">
          <AnimatePresence initial={false}>
            {/* Previous card */}
            <motion.img
              key={`prev-${prevIdx}`}
              src={images[prevIdx]}
              alt={`prev-${prevIdx}`}
              initial={{ opacity: 0 }}
              animate={variants.leftPeek}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute top-0 left-0 w-full h-full object-cover rounded-xl shadow-lg border border-white/40"
              style={{ zIndex: 10 }}
              draggable={false}
            />

            {/* Current card */}
            <motion.div
              key={`current-${current}`}
              initial={
                direction === "right"
                  ? variants.enterFromRight
                  : variants.enterFromLeft
              }
              animate={variants.center}
              exit={direction === "right" ? variants.exitLeft : variants.exitRight}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              className="absolute top-0 left-0 w-full h-full rounded-xl cursor-grab"
              style={{ zIndex: 20 }}
            >
              <motion.img
                src={images[current]}
                alt={`current-${current}`}
                className="w-full h-full object-cover rounded-xl shadow-2xl border border-white/50"
                draggable={false}
              />
            </motion.div>

            {/* Next card */}
            <motion.img
              key={`next-${nextIdx}`}
              src={images[nextIdx]}
              alt={`next-${nextIdx}`}
              initial={{ opacity: 0 }}
              animate={variants.rightPeek}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute top-0 left-0 w-full h-full object-cover rounded-xl shadow-lg border border-white/40"
              style={{ zIndex: 9 }}
              draggable={false}
            />
          </AnimatePresence>
        </div>

        {/* Right Arrow */}
        <button
          onClick={next}
          aria-label="Next"
          className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-3 hover:scale-105 transition z-20"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
};

export default HeroRight;
