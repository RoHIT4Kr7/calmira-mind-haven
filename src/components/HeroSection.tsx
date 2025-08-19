import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

const HeroSection = () => {
  const unicornRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Unicorn Studio script
    if (!(window as any).UnicornStudio && unicornRef.current) {
      (window as any).UnicornStudio = { isInitialized: false };
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js";
      script.onload = () => {
        if (!(window as any).UnicornStudio.isInitialized) {
          (window as any).UnicornStudio.init();
          (window as any).UnicornStudio.isInitialized = true;
        }
      };
      document.head.appendChild(script);
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Unicorn Studio Background - Full Screen */}
      <div className="unicorn-container">
        <div 
          ref={unicornRef}
          className="unicorn-embed"
          data-us-project="8ang4pHeAG7s5edlM5DX"
        />
      </div>
      
      {/* Glass overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/20 backdrop-blur-[0.5px]" />
      
      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <h1 className="font-michroma text-4xl md:text-6xl lg:text-7xl font-bold mb-6 gradient-text glow-effect">
          Find Your Calm in the Chaos
        </h1>
        
        <p className="text-lg md:text-xl lg:text-2xl text-foreground/90 mb-12 max-w-3xl mx-auto leading-relaxed">
          Meet Calmira, your AI companion for mental wellness. Designed for youth, built with care, powered by understanding.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button variant="hero" size="lg" className="text-lg px-8 py-4">
            Start Your Journey
          </Button>
          <Button variant="ghost" size="lg" className="text-lg px-8 py-4 border border-foreground/20 hover:bg-foreground/10">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

// Extend window type for TypeScript
declare global {
  interface Window {
    UnicornStudio: {
      isInitialized: boolean;
    };
  }
}

export default HeroSection;