import React from "react";
import { motion } from "framer-motion";
import GlowCard from "@/components/ui/spotlight-card"; // ✅ using GlowCard
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      {/* GlowCard instead of Card */}
      <GlowCard
        customSize
        className="h-full cursor-pointer rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 flex flex-col"
        glowColor="purple" // 🔥 you can change: blue | purple | green | red | orange
      >
        {/* Icon + Title */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="text-6xl">{icon}</div>
          <h3 className="text-3xl poppins-semibold text-white drop-shadow-lg">
            {title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-gray-300 mb-8 flex-grow text-lg inter-regular leading-relaxed drop-shadow-md">
          {description}
        </p>

        {/* Button */}
        <Button
          onClick={onClick}
          className="w-full bg-gradient-to-r from-[#24243e] to-[#0a053d] hover:from-[#0a053d] hover:to-[#24243e] text-white inter-medium font-medium py-4 text-lg rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Start {title}
        </Button>
      </GlowCard>
    </motion.div>
  );
};

export default ServiceCard;
