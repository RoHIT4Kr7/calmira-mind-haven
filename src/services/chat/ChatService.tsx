import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LightServiceNavigation from "@/components/navigation/LightServiceNavigation";
import DhyaanAI from "./DhyaanAI";

const ChatService: React.FC = () => {
  const [showDhyaanAI, setShowDhyaanAI] = useState(false);
  const navigate = useNavigate();

  // Scroll to top when component mounts or when showDhyaanAI changes
  useEffect(() => {
    // Use setTimeout to ensure scroll happens after any route transitions
    const scrollTimer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, 100);

    return () => clearTimeout(scrollTimer);
  }, [showDhyaanAI]);

  const handleStartDhyaanAI = () => {
    setShowDhyaanAI(true);
  };

  const handleBackFromDhyaanAI = () => {
    setShowDhyaanAI(false);
  };

  if (showDhyaanAI) {
    return <DhyaanAI onBack={handleBackFromDhyaanAI} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-soft to-background flex">
      <LightServiceNavigation currentPage="Dhyaan AI" />

      <main className="flex-1 ml-0 lg:ml-64 px-4 py-8">
        <div className="max-w-4xl mx-auto py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl poppins-bold text-foreground mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Dhyaan AI
            </h1>
            <p className="text-muted-foreground text-xl md:text-2xl max-w-4xl mx-auto inter-regular leading-relaxed">
              Generate personalized meditation experiences with the power of AI.
              Step-by-step guidance tailored to your current state and goals.
            </p>
          </motion.div>

          {/* Main Feature Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -8 }}
            className="mb-12"
          >
            <Card className="service-card cursor-pointer bg-white/95 backdrop-blur-sm border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-12 text-center">
                <div className="text-8xl mb-8">🧘‍♀️</div>
                <h2 className="text-3xl poppins-semibold text-foreground mb-4">
                  Personalized Meditation
                </h2>
                <p className="text-muted-foreground text-lg inter-regular leading-relaxed mb-8 max-w-2xl mx-auto">
                  Answer a few questions about how you're feeling and what you
                  want to achieve. Our AI will create a custom meditation
                  session just for you, with guided audio and background music
                  to help you find your inner peace.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="p-4 bg-background/50 rounded-xl border border-border/30">
                    <div className="text-3xl mb-2">🎯</div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Targeted
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Based on your current emotional state
                    </p>
                  </div>
                  <div className="p-4 bg-background/50 rounded-xl border border-border/30">
                    <div className="text-3xl mb-2">🎵</div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Audio Guided
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Soothing voice and background music
                    </p>
                  </div>
                  <div className="p-4 bg-background/50 rounded-xl border border-border/30">
                    <div className="text-3xl mb-2">⚡</div>
                    <h3 className="font-semibold text-foreground mb-2">
                      AI Powered
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Intelligent personalization
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleStartDhyaanAI}
                  className="bg-gradient-to-r from-primary to-primary-medium hover:from-primary-medium hover:to-primary text-primary-foreground inter-medium font-semibold py-4 px-8 text-lg rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Start Your Journey
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
          >
            <Card className="bg-white/95 backdrop-blur-sm border border-border/50">
              <CardContent className="p-8">
                <div className="text-5xl mb-4">🌱</div>
                <h3 className="text-xl poppins-semibold text-foreground mb-3">
                  Beginner Friendly
                </h3>
                <p className="text-muted-foreground inter-regular leading-relaxed">
                  Whether you're new to meditation or an experienced
                  practitioner, our AI adapts to your experience level and
                  provides appropriate guidance.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border border-border/50">
              <CardContent className="p-8">
                <div className="text-5xl mb-4">🎨</div>
                <h3 className="text-xl poppins-semibold text-foreground mb-3">
                  Multiple Styles
                </h3>
                <p className="text-muted-foreground inter-regular leading-relaxed">
                  Choose from various meditation types including mindfulness,
                  visualization, sound healing, and more to find what resonates
                  with you.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="p-8 bg-white/95 rounded-2xl border border-border/30 backdrop-blur-sm shadow-lg"
          >
            <h3 className="text-2xl md:text-3xl poppins-semibold text-foreground mb-8 text-center">
              How It Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h4 className="font-semibold text-foreground">
                  Share Your State
                </h4>
                <p className="text-sm inter-regular text-muted-foreground">
                  Tell us how you're feeling right now
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h4 className="font-semibold text-foreground">Set Your Goal</h4>
                <p className="text-sm inter-regular text-muted-foreground">
                  Choose what you want to feel
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h4 className="font-semibold text-foreground">AI Creates</h4>
                <p className="text-sm inter-regular text-muted-foreground">
                  Personalized meditation is generated
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">4</span>
                </div>
                <h4 className="font-semibold text-foreground">Find Peace</h4>
                <p className="text-sm inter-regular text-muted-foreground">
                  Enjoy your guided meditation
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ChatService;
