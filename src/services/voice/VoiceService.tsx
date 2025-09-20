import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LightServiceNavigation from "@/components/navigation/LightServiceNavigation";
import VoiceInterface from "@/components/voice/VoiceInterface";
import { SigninGradientBackground } from "@/components/ui/signin-gradient-background";

interface VoiceOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  personality: string;
  gradient: string;
}

const VoiceService: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const voiceOptions: VoiceOption[] = [
    {
      id: "therapist",
      title: "Talk to Therapist",
      description:
        "Professional AI therapist for mental health support and guidance",
      icon: "🧠",
      personality:
        "Professional, empathetic, trained in therapeutic techniques",
      gradient: "from-green-500/20 to-teal-500/20",
    },
  ];

  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleBackToOptions = () => {
    setSelectedOption(null);
  };

  const getContactInfo = (optionId: string) => {
    return {
      name: "Dr. Sarah - AI Therapist",
      avatar: "/images/therapist-avatar.png",
      status: "Professional support available",
    };
  };

  if (selectedOption) {
    const contactInfo = getContactInfo(selectedOption);

    return (
      <SigninGradientBackground>
        <div className="min-h-screen flex">
          <LightServiceNavigation />

          <div className="flex-1 ml-0 lg:ml-64">
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
              className="h-screen flex flex-col"
            >
              {/* Back Button */}
              <div className="p-6 bg-black/20 backdrop-blur-lg border-b border-white/10">
                <Button
                  variant="ghost"
                  onClick={handleBackToOptions}
                  className="text-white hover:bg-white/10 rounded-xl"
                >
                  ← Back to Options
                </Button>
              </div>

              {/* Voice Interface */}
              <div className="flex-1">
                <VoiceInterface
                  contactName={contactInfo.name.split(" - ")[0]}
                  contactDescription={contactInfo.status}
                  onVoiceStart={() => {
                    console.log(`Voice session started with ${selectedOption}`);
                  }}
                  onVoiceStop={() => {
                    console.log(`Voice session stopped with ${selectedOption}`);
                  }}
                  onVoiceMessage={(message) => {
                    console.log(`Voice message to ${selectedOption}:`, message);
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </SigninGradientBackground>
    );
  }

  return (
    <SigninGradientBackground>
      <div className="min-h-screen flex">
        <LightServiceNavigation />

        <main className="flex-1 ml-0 lg:ml-64 px-4 py-8">
          <div className="max-w-6xl mx-auto py-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                Voice Chat Service
              </h1>
              <p className="text-white/70 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
                Choose who you'd like to talk with. Each AI companion has been
                trained with different personalities and expertise to support
                you.
              </p>
            </motion.div>

            {/* Voice Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {voiceOptions.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="cursor-pointer bg-white/5 backdrop-blur-lg border-white/10 hover:border-white/20 hover:bg-white/10 h-full transition-all duration-300">
                    <CardContent className="p-8 h-full flex flex-col">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="text-6xl">{option.icon}</div>
                        <h3 className="text-2xl font-semibold text-white">
                          {option.title}
                        </h3>
                      </div>

                      <p className="text-white/70 mb-6 flex-grow text-lg leading-relaxed">
                        {option.description}
                      </p>

                      <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
                        <p className="text-base text-white/70">
                          <strong className="text-white font-medium">
                            Personality:
                          </strong>{" "}
                          {option.personality}
                        </p>
                      </div>

                      <Button
                        onClick={() => handleSelectOption(option.id)}
                        className="w-full bg-gradient-to-r from-purple-800 to-purple-900 hover:from-purple-900 hover:to-black text-white font-semibold py-4 text-lg rounded-xl transition-all duration-300"
                      >
                        Start Voice Chat
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Features Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10"
            >
              <h3 className="text-2xl md:text-3xl font-semibold text-white mb-8 text-center">
                Voice Chat Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-4">
                  <div className="text-4xl">🎙️</div>
                  <p className="text-base text-white/70">
                    Real-time voice conversations
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="text-4xl">🧠</div>
                  <p className="text-base text-white/70">
                    AI trained for emotional support
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="text-4xl">🔒</div>
                  <p className="text-base text-white/70">
                    Private and secure conversations
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </SigninGradientBackground>
  );
};

export default VoiceService;
