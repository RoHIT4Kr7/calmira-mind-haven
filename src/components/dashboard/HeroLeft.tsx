import React from "react";
import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import AutoScrollingMood from "@/components/dashboard/AutoScrollingMood";

const HeroLeft: React.FC = () => {
  return (
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

      {/* Buttons */}
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
  );
};

export default HeroLeft;
