import React from "react";
import { motion } from "framer-motion";

interface SigninGradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export const SigninGradientBackground: React.FC<
  SigninGradientBackgroundProps
> = ({ children, className = "" }) => {
  return (
    <div className={`min-h-screen w-full relative ${className}`}>
      {/* Fixed gradient background */}
      <div className="fixed inset-0 bg-black z-0" />
      <div className="fixed inset-0 bg-gradient-to-b from-purple-500/40 via-purple-700/50 to-black z-0" />
      <div
        className="fixed inset-0 opacity-[0.03] mix-blend-soft-light z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-purple-400/20 blur-[80px] z-0" />
      <motion.div
        className="fixed top-0 left-1/2 transform -translate-x-1/2 w-[100vh] h-[60vh] rounded-b-full bg-purple-300/20 blur-[60px] z-0"
        animate={{ opacity: [0.15, 0.3, 0.15], scale: [0.98, 1.02, 0.98] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
      />
      <motion.div
        className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[90vh] h-[90vh] rounded-t-full bg-purple-400/20 blur-[60px] z-0"
        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "mirror",
          delay: 1,
        }}
      />
      <div className="fixed left-1/4 top-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] animate-pulse opacity-40 z-0" />
      <div className="fixed right-1/4 bottom-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] animate-pulse delay-1000 opacity-40 z-0" />

      <div className="relative z-10">{children}</div>
    </div>
  );
};
