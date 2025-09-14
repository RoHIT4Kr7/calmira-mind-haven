import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  ArrowLeft,
  Info,
} from "lucide-react";
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
import backgroundMusic from "@/assets/audio/background-music.mp3";

interface MeditationForm {
  currentFeeling: string;
  desiredFeeling: string;
  experience: string;
  meditationType: string;
}

interface DhyaanAIProps {
  onBack?: () => void;
}

const DhyaanAI: React.FC<DhyaanAIProps> = ({ onBack }) => {
  const [step, setStep] = useState<"form" | "meditation">("form");
  const [form, setForm] = useState<MeditationForm>({
    currentFeeling: "",
    desiredFeeling: "",
    experience: "",
    meditationType: "",
  });

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);

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
    "Feeling Gratitude",
    "Acceptance",
  ];

  const experienceLevels = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  const meditationTypes = [
    { value: "thought", label: "Thought" },
    { value: "sound", label: "Sound" },
    { value: "form", label: "Form" },
    { value: "visualization", label: "Visualization" },
    { value: "nothingness", label: "Nothingness" },
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
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, [step]);

  const handleFormSubmit = () => {
    if (
      form.currentFeeling &&
      form.desiredFeeling &&
      form.experience &&
      form.meditationType
    ) {
      setStep("meditation");
    }
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = (value[0] / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const generateMeditationTitle = (): string => {
    const typeMap: { [key: string]: string } = {
      thought: "Mindfulness",
      sound: "Sound Healing",
      form: "Body Awareness",
      visualization: "Guided Visualization",
      nothingness: "Silent",
    };
    return `${typeMap[form.meditationType] || "Mindfulness"} Meditation`;
  };

  if (step === "meditation") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-white/95 backdrop-blur-lg border-b border-border">
          <Button
            variant="ghost"
            onClick={() => setStep("form")}
            className="p-2 hover:bg-gray-100 rounded-xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Dhyaan AI</h1>
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
              className="text-gray-400"
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
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {generateMeditationTitle()}
          </h2>

          {/* Play/Pause Button */}
          <motion.button
            onClick={togglePlayPause}
            className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mb-8 shadow-lg hover:bg-gray-600 transition-colors"
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
          <div className="flex justify-between w-full max-w-md text-sm text-gray-600 mb-8">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Add to Playlist Button */}
          <Button
            variant="ghost"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <Volume2 className="h-4 w-4" />
            <span>Add to Playlist</span>
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Button>

          {/* Hidden Audio Element */}
          <audio ref={audioRef} src={backgroundMusic} preload="metadata" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white/95 backdrop-blur-lg border-b border-border">
        <Button
          variant="ghost"
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-xl"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-900">Pick a</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="p-6">
        {/* Dhyaan AI Header */}
        <Card className="mb-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm">🧘</span>
              </div>
              <div>
                <h2 className="font-semibold">Dhyaan AI</h2>
                <span className="text-xs bg-white/30 px-2 py-1 rounded">
                  BETA
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Info className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Description */}
        <div className="mb-8">
          <p className="text-gray-600 text-sm leading-relaxed">
            Generate a personalized meditation with the power of AI and step by
            step guidance.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Current Feeling */}
          <div>
            <label className="block text-gray-900 font-medium mb-3">
              What are you feeling right now?
            </label>
            <Select
              value={form.currentFeeling}
              onValueChange={(value) =>
                setForm({ ...form, currentFeeling: value })
              }
            >
              <SelectTrigger className="w-full bg-white border-gray-200 rounded-xl">
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
            <label className="block text-gray-900 font-medium mb-3">
              What do you want to feel?
            </label>
            <Select
              value={form.desiredFeeling}
              onValueChange={(value) =>
                setForm({ ...form, desiredFeeling: value })
              }
            >
              <SelectTrigger className="w-full bg-white border-gray-200 rounded-xl">
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
            <label className="block text-gray-900 font-medium mb-3">
              What is your meditation expertise?
            </label>
            <div className="space-y-3">
              {experienceLevels.map((level) => (
                <label
                  key={level.value}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="experience"
                    value={level.value}
                    checked={form.experience === level.value}
                    onChange={(e) =>
                      setForm({ ...form, experience: e.target.value })
                    }
                    className="w-5 h-5 text-red-500 border-gray-300 focus:ring-red-500"
                  />
                  <span className="text-gray-900">{level.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Meditation Type */}
          <div>
            <label className="block text-gray-900 font-medium mb-3">
              What type of meditation do you want to do?
            </label>
            <div className="space-y-3">
              {meditationTypes.map((type) => (
                <label
                  key={type.value}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="meditationType"
                    value={type.value}
                    checked={form.meditationType === type.value}
                    onChange={(e) =>
                      setForm({ ...form, meditationType: e.target.value })
                    }
                    className="w-5 h-5 text-red-500 border-gray-300 focus:ring-red-500"
                  />
                  <span className="text-gray-900">{type.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Start Meditation Button */}
        <Button
          onClick={handleFormSubmit}
          disabled={
            !form.currentFeeling ||
            !form.desiredFeeling ||
            !form.experience ||
            !form.meditationType
          }
          className="w-full bg-gray-700 hover:bg-gray-800 text-white py-4 rounded-xl text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-8"
        >
          Start Meditation
        </Button>
      </div>
    </div>
  );
};

export default DhyaanAI;
