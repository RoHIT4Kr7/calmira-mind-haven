import { useState, useEffect } from "react";

const LoadingScreen = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  
  const messages = [
    "Sketching your first panel...",
    "Inking the details...",
    "Bringing your story to life..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8">
        {/* Animated SVG - Pulsating Ink Drop */}
        <div className="relative">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            className="mx-auto"
          >
            {/* Outer glow circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.3"
              className="animate-pulse"
            />
            
            {/* Main ink drop */}
            <path
              d="M60 20 C40 20 30 40 30 60 C30 80 40 100 60 100 C80 100 90 80 90 60 C90 40 80 20 60 20 Z"
              fill="currentColor"
              className="text-primary animate-pulse"
              style={{
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
              }}
            />
            
            {/* Inner highlight */}
            <ellipse
              cx="50"
              cy="45"
              rx="8"
              ry="12"
              fill="currentColor"
              opacity="0.3"
              className="text-primary-foreground"
            />
            
            {/* Dripping effect */}
            <path
              d="M55 100 L55 110 L65 110 L65 100"
              fill="currentColor"
              className="text-primary"
            />
          </svg>
        </div>

        {/* Cycling message */}
        <div className="space-y-2">
          <p className="text-foreground text-lg font-medium">
            {messages[messageIndex]}
          </p>
          <div className="flex justify-center space-x-1">
            {messages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === messageIndex
                    ? "bg-primary"
                    : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Additional calming text */}
        <p className="text-muted-foreground text-sm max-w-md">
          Take a deep breath while we craft something special just for you...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
