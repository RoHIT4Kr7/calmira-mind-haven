import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import { authHeader, API_BASE_URL } from "@/lib/api";
import LumaSpin from "@/components/ui/luma-spin";
import { SigninGradientBackground } from "@/components/ui/signin-gradient-background";

interface MeditationForm {
  currentFeeling: string;
  desiredFeeling: string;
  experience: string;
}

interface MeditationData {
  meditation_id: string;
  title: string;
  duration: number;
  audio_url: string;
  background_music_url: string;
  script: string;
  guidance_type: string;
  created_at: string;
}

interface DhyaanAIProps {
  onBack?: () => void;
}

const DhyaanAI: React.FC<DhyaanAIProps> = ({ onBack }) => {
  const [step, setStep] = useState<"form" | "meditation" | "loading">("form");
  const [form, setForm] = useState<MeditationForm>({
    currentFeeling: "",
    desiredFeeling: "",
    experience: "",
  });
  const [meditationData, setMeditationData] = useState<MeditationData | null>(
    null
  );
  const [error, setError] = useState<string>("");
  const { user, token } = useAuth();

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);
  const backgroundAudioRef = useRef<HTMLAudioElement>(null);

  const currentFeelings = [
    "Sad",
    "Upset",
    "Anxious",
    "Fearful",
    "Lonely",
    "Guilty",
    "Depressed",
  ];

  const desiredFeelings = [
    "Joy",
    "Love",
    "Peaceful",
    "Gratitude",
    "Acceptance",
  ];

  const experienceLevels = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  // Scroll to top when component mounts
  useEffect(() => {
    // Use setTimeout to ensure scroll happens after any route transitions
    const scrollTimer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, 100);

    return () => clearTimeout(scrollTimer);
  }, []);

  // Audio player effects
  useEffect(() => {
    const audio = audioRef.current;
    const backgroundAudio = backgroundAudioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", () => setIsPlaying(false));

    // Sync background music with main audio
    if (backgroundAudio && meditationData) {
      backgroundAudio.volume = volume * 0.3; // Keep background music lower
      if (isPlaying) {
        backgroundAudio.play().catch(console.warn);
      } else {
        backgroundAudio.pause();
      }
      backgroundAudio.currentTime = audio.currentTime;
    }

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, [step, isPlaying, volume, meditationData]);

  const handleFormSubmit = async () => {
    if (form.currentFeeling && form.desiredFeeling && form.experience) {
      setStep("loading");
      setError("");

      // Debug authentication
      console.log("🔐 Auth Debug:", {
        user,
        token: token ? "present" : "missing",
      });
      console.log("🔗 API Call:", `${API_BASE_URL}/generate-meditation`);

      // Debug authentication
      console.log("🔐 Auth Debug:", {
        user,
        token: token ? "present" : "missing",
      });
      console.log("🔗 API Call:", `${API_BASE_URL}/generate-meditation`);

      try {
        const headers = {
          "Content-Type": "application/json",
          ...authHeader(token),
        };
        console.log("📤 Request headers:", headers);

        const response = await fetch(`${API_BASE_URL}/generate-meditation`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            inputs: {
              currentFeeling: form.currentFeeling,
              desiredFeeling: form.desiredFeeling,
              experience: form.experience,
            },
          }),
        });

        console.log("📥 Response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("❌ API Error:", errorData);
          throw new Error(
            errorData.detail?.message ||
              `HTTP ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("✅ Meditation data received:", data);
        setMeditationData(data);
        setStep("meditation");
      } catch (err) {
        console.error("💥 Failed to generate meditation:", err);
        setError(
          err instanceof Error ? err.message : "Failed to generate meditation"
        );
        setStep("form");
      }
    }
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    const backgroundAudio = backgroundAudioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      if (backgroundAudio) backgroundAudio.pause();
    } else {
      audio.play();
      if (backgroundAudio) {
        backgroundAudio.volume = volume * 0.3;
        backgroundAudio.play().catch(console.warn);
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    const backgroundAudio = backgroundAudioRef.current;
    if (!audio) return;

    const newTime = (value[0] / 100) * duration;
    audio.currentTime = newTime;
    if (backgroundAudio) {
      backgroundAudio.currentTime = newTime;
    }
    setCurrentTime(newTime);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const generateMeditationTitle = (): string => {
    return meditationData?.title || "Mindfulness Meditation";
  };

  if (step === "loading") {
    return (
      <SigninGradientBackground>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="text-center space-y-6 flex flex-col items-center">
            <LumaSpin />
            <div>
              <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 mb-4">
                Generating Your Meditation
              </h2>
              <p className="text-white/70 text-lg">
                Creating a personalized meditation experience just for you...
              </p>
            </div>
          </div>
        </div>
      </SigninGradientBackground>
    );
  }

  if (step === "meditation") {
    return (
      <SigninGradientBackground>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-black/20 backdrop-blur-lg border-b border-white/10">
            <Button
              variant="ghost"
              onClick={() => setStep("form")}
              className="p-2 hover:bg-white/10 rounded-xl text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
              Dhyaan AI
            </h1>
            <div className="w-10" /> {/* Spacer */}
          </div>

          {/* Meditation Player */}
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            {/* Wave Animation */}
            <div className="mb-12">
              <svg
                width="300"
                height="100"
                viewBox="0 0 300 100"
                className="text-white/60"
              >
                <motion.path
                  d="M0,50 Q75,20 150,50 T300,50"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.path
                  d="M0,50 Q75,30 150,50 T300,50"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  opacity={0.7}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                />
                <motion.path
                  d="M0,50 Q75,40 150,50 T300,50"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                  opacity={0.5}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                />
              </svg>
            </div>

            {/* Meditation Title */}
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 mb-8 text-center">
              {generateMeditationTitle()}
            </h2>

            {/* Play/Pause Button */}
            <motion.button
              onClick={togglePlayPause}
              className="w-20 h-20 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full flex items-center justify-center mb-8 shadow-lg hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? (
                <Pause className="h-8 w-8 text-white" />
              ) : (
                <Play className="h-8 w-8 text-white ml-1" />
              )}
            </motion.button>

            {/* Progress Bar */}
            <div className="w-full max-w-md mb-4">
              <div className="relative">
                <Progress
                  value={duration > 0 ? (currentTime / duration) * 100 : 0}
                  className="h-2 bg-gray-200 cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={duration > 0 ? (currentTime / duration) * 100 : 0}
                  onChange={(e) => handleSeek([parseInt(e.target.value)])}
                  className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Time Display */}
            <div className="flex justify-between w-full max-w-md text-sm text-white/60 mb-8">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            {/* Add to Playlist Button */}
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-white/60 hover:text-white hover:bg-white/10"
            >
              <Volume2 className="h-4 w-4" />
              <span>Add to Playlist</span>
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Button>

            {/* Hidden Audio Elements */}
            <audio
              ref={audioRef}
              src={meditationData?.audio_url}
              preload="metadata"
            />
            {meditationData?.background_music_url && (
              <audio
                ref={backgroundAudioRef}
                src={meditationData.background_music_url}
                preload="metadata"
              />
            )}
          </div>
        </div>
      </SigninGradientBackground>
    );
  }

  // Form render
  return (
    <SigninGradientBackground>
      <div className="min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-black/20 backdrop-blur-lg border-b border-white/10">
          <Button
            variant="ghost"
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-xl text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            Dhyaan AI
          </h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        <div className="p-6">
          {/* Dhyaan AI Header */}
          <Card className="mb-6 bg-white/5 backdrop-blur-lg border-white/10">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🧘</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                    Dhyaan AI
                  </h2>
                  <span className="text-xs bg-white/20 text-white px-2 py-1 rounded">
                    BETA
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <Info className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Description */}
          <div className="mb-8">
            <p className="text-white/70 text-lg leading-relaxed">
              Generate a personalized meditation with the power of AI and step
              by step guidance.
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <Card className="mb-6 bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 text-red-700">
                  <Info className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form */}
          <div className="space-y-6">
            {/* Current Feeling */}
            <div>
              <label className="block text-white font-medium mb-3">
                What are you feeling right now?
              </label>
              <Select
                value={form.currentFeeling}
                onValueChange={(value) =>
                  setForm({ ...form, currentFeeling: value })
                }
              >
                <SelectTrigger className="w-full bg-white/10 border-white/20 rounded-xl text-white">
                  <SelectValue placeholder="Sad" />
                </SelectTrigger>
                <SelectContent>
                  {currentFeelings.map((feeling) => (
                    <SelectItem key={feeling} value={feeling.toLowerCase()}>
                      {feeling}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Desired Feeling */}
            <div>
              <label className="block text-white font-medium mb-3">
                What do you want to feel?
              </label>
              <Select
                value={form.desiredFeeling}
                onValueChange={(value) =>
                  setForm({ ...form, desiredFeeling: value })
                }
              >
                <SelectTrigger className="w-full bg-white/10 border-white/20 rounded-xl text-white">
                  <SelectValue placeholder="Peaceful" />
                </SelectTrigger>
                <SelectContent>
                  {desiredFeelings.map((feeling) => (
                    <SelectItem key={feeling} value={feeling.toLowerCase()}>
                      {feeling}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-white font-medium mb-3">
                What is your meditation expertise?
              </label>
              <div className="space-y-3">
                {experienceLevels.map((level) => (
                  <label
                    key={level.value}
                    className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-white/10 transition-all duration-200"
                  >
                    <input
                      type="radio"
                      name="experience"
                      value={level.value}
                      checked={form.experience === level.value}
                      onChange={(e) =>
                        setForm({ ...form, experience: e.target.value })
                      }
                      className="w-5 h-5 text-white border-white/30 focus:ring-white/50"
                    />
                    <span className="text-white">{level.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Start Meditation Button */}
          <Button
            onClick={handleFormSubmit}
            disabled={
              !form.currentFeeling || !form.desiredFeeling || !form.experience
            }
            className="w-full bg-gradient-to-r from-purple-800 to-purple-900 hover:from-purple-900 hover:to-black text-white py-4 rounded-xl text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-8"
          >
            Start Meditation
          </Button>
        </div>
      </div>
    </SigninGradientBackground>
  );
};

export default DhyaanAI;
