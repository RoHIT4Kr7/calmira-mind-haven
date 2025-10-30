import React from "react";
import { motion } from "framer-motion";
import LightServiceNavigation from "@/components/navigation/LightServiceNavigation";
import { SigninGradientBackground } from "@/components/ui/signin-gradient-background";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AboutUs: React.FC = () => {
  return (
    <SigninGradientBackground>
      <div className="min-h-screen flex">
        <LightServiceNavigation />

        <main className="flex-1 ml-0 lg:ml-64 px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 mb-6">
                About Calmira AI
              </h1>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose prose-invert max-w-none"
            >
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 space-y-6">
                <p className="text-white/90 text-lg leading-relaxed">
                  Welcome to Calmira AI, your personal sanctuary for mental
                  wellness, designed with care for the modern mind.
                </p>

                <p className="text-white/80 leading-relaxed">
                  Founded in 2025, Calmira was born from a desire to combine
                  cutting-edge artificial intelligence with the profound need
                  for accessible, engaging, and personalized mental health
                  support. We believe that wellness tools should be as unique as
                  the individuals who use them.
                </p>

                <p className="text-white/80 leading-relaxed">
                  Our mission is to provide a creative and comforting space
                  where users, especially youth, can navigate their feelings and
                  build resilience. We do this through a unique suite of
                  AI-powered services, including:
                </p>

                <ul className="space-y-4 text-white/80 list-none ml-0">
                  <li className="flex items-start gap-3">
                    <span className="text-purple-400 mt-1">✦</span>
                    <div>
                      <strong className="text-white">AI Manga Creation:</strong>{" "}
                      Transform your personal journey, moods, and challenges
                      into a unique, visually compelling manga story.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-400 mt-1">✦</span>
                    <div>
                      <strong className="text-white">AI Voice Chat:</strong>{" "}
                      Engage in supportive, empathetic conversations with an AI
                      companion trained to listen and assist.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-400 mt-1">✦</span>
                    <div>
                      <strong className="text-white">
                        DhyaanAI Meditation:
                      </strong>{" "}
                      Receive personalized, AI-generated guided meditation
                      sessions tailored to your current emotional state and
                      wellness goals.
                    </div>
                  </li>
                </ul>

                <p className="text-white/90 text-lg leading-relaxed pt-4 border-t border-white/10">
                  At Calmira, we are a team of technologists, mental health
                  advocates, and artists dedicated to finding your calm in the
                  chaos.
                </p>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </SigninGradientBackground>
  );
};

export default AboutUs;
