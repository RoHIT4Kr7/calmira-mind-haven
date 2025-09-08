import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Phone, MessageCircle } from "lucide-react";
import ServiceCard from "@/components/dashboard/ServiceCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AutoScrollingMood from "@/components/dashboard/AutoScrollingMood";

const services = [
  {
    id: "manga",
    title: "Manga Creation",
    description:
      "Create personalized manga stories based on your mood and preferences",
    icon: "📚",
    path: "/mental-wellness",
    gradient: "from-primary-dark/20 to-primary-medium/20",
  },
  {
    id: "voice",
    title: "Voice Chat",
    description:
      "Have voice conversations with AI friends, therapists, or teachers",
    icon: "🎙️",
    path: "/voice",
    gradient: "from-primary-medium/20 to-primary-dark/20",
  },
  {
    id: "chat",
    title: "Chat",
    description: "Text-based conversations with AI companions",
    icon: "💬",
    path: "/services/chat",
    gradient: "from-accent/20 to-primary/20",
  },
];

// sample images
const images = [
  "https://cdn.pixabay.com/photo/2024/04/19/22/25/man-8707406_1280.png",
  "https://t4.ftcdn.net/jpg/14/27/28/67/360_F_1427286746_UwO6tRjhPCPZYKVsLcTqvqjFP6goJGzy.jpg",
  "https://www.shutterstock.com/shutterstock/videos/3685780505/thumb/4.jpg?ip=x480",
  "https://watermark.lovepik.com/photo/40195/1483.jpg_wh1200.jpg",
  "https://i.pinimg.com/736x/eb/4f/19/eb4f19903cfea9975818c9d36dbe8f9c.jpg",
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
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

  // index helpers
  const idx = (i: number) => (i + images.length) % images.length;
  const prevIdx = idx(current - 1);
  const nextIdx = idx(current + 1);

  // Framer motion variants
  const variants = {
    enterFromRight: { x: 300, opacity: 0, scale: 0.9, rotate: 10 },
    enterFromLeft: { x: -300, opacity: 0, scale: 0.9, rotate: -10 },
    center: { x: 0, opacity: 1, scale: 1, rotate: 0 },
    leftPeek: { x: -72, opacity: 0.95, scale: 0.92, rotate: -8 },
    rightPeek: { x: 72, opacity: 0.95, scale: 0.92, rotate: 8 },
    exitLeft: { x: -180, opacity: 0, scale: 0.9, rotate: -12 },
    exitRight: { x: 180, opacity: 0, scale: 0.9, rotate: 12 },
  };

  // swipe gestures
  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    const threshold = 80;
    if (info.offset.x < -threshold) next();
    else if (info.offset.x > threshold) prev();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-slate-50 to-slate-100">
      <Navbar />

      <main className="pt-28 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero section split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* LEFT SIDE */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-[80%] text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl poppins-bold text-foreground mb-4">
                How are you?
              </h1>

              {/* auto scroll aligned left */}
              <div className="mb-6">
                <AutoScrollingMood />
              </div>

              {/* Buttons aligned neatly */}
              <div className="flex flex-wrap gap-4 mt-4">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://wa.me/1234567890"
                  target="_blank"
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold shadow-lg flex items-center gap-2"
                >
                  <MessageCircle size={20} /> Talk to Expert
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="tel:+911234567890"
                  className="px-6 py-3 rounded-lg bg-white text-gray-800 font-semibold border border-gray-300 shadow flex items-center gap-2"
                >
                  <Phone size={20} /> Call Now
                </motion.a>
              </div>
            </motion.div>

            {/* RIGHT SIDE image slider */}
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
                  {/* Previous card */}
                  <AnimatePresence initial={false}>
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
                      exit={
                        direction === "right"
                          ? variants.exitLeft
                          : variants.exitRight
                      }
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
          </div>

          {/* Services section */}
          <section id="services" className="mt-20" aria-label="Services section">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
              Choose Your Service
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((svc) => (
                <ServiceCard
                  key={svc.id}
                  {...svc}
                  onClick={() => navigate(svc.path)}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
