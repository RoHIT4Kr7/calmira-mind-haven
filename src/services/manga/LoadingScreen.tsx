import { motion } from "framer-motion";
import { Component as LumaSpin } from "@/components/ui/luma-spin";

const LoadingScreen = () => {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4">
        <LumaSpin />
      </div>
      <p className="text-white text-lg font-medium">Loading next panel...</p>
    </motion.div>
  );
};

export default LoadingScreen;
