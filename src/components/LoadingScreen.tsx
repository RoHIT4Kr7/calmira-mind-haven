import { useState, useEffect } from "react";
import { Component as LumaSpin } from "@/components/ui/luma-spin";
import { SigninGradientBackground } from "@/components/ui/signin-gradient-background";

interface LoadingScreenProps {
  progressMessage?: string;
}

const LoadingScreen = ({ progressMessage }: LoadingScreenProps) => {
  const [messageIndex, setMessageIndex] = useState(0);

  const defaultMessages = [
    "Connecting to AI services...",
    "Creating your personalized manga story...",
    "Generating artwork for your panels...",
    "Recording narration and audio...",
    "Finalizing your story experience...",
  ];

  useEffect(() => {
    // Only cycle through default messages if no specific progress message is provided
    if (!progressMessage) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % defaultMessages.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [progressMessage, defaultMessages.length]);

  // Use provided progress message or cycle through default messages
  const currentMessage = progressMessage || defaultMessages[messageIndex];

  return (
    <SigninGradientBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-8">
          {/* Unified loader */}
          <div className="flex items-center justify-center">
            <LumaSpin />
          </div>

          {/* Progress message */}
          <div className="space-y-2">
            <p className="text-white text-lg font-medium">{currentMessage}</p>
            {!progressMessage && (
              <div className="flex justify-center space-x-1">
                {defaultMessages.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index === messageIndex ? "bg-purple-400" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Additional calming text */}
          <p className="text-white/70 text-sm max-w-md">
            Take a deep breath while we craft something special just for you...
          </p>
        </div>
      </div>
    </SigninGradientBackground>
  );
};

export default LoadingScreen;
