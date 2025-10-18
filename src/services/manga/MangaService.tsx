import React, { useEffect, useState, useRef } from "react";
import { Socket, io } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/api";
import MangaViewer from "@/components/manga-viewer/MangaViewer";
import OnboardingScreen from "@/components/OnboardingScreen";
import LoadingScreen from "@/components/LoadingScreen";
import LightServiceNavigation from "@/components/navigation/LightServiceNavigation";
import { SigninGradientBackground } from "@/components/ui/signin-gradient-background";

interface StoryPanel {
  id: string;
  imageUrl: string;
  narrationUrl: string;
  backgroundMusicUrl?: string;
}

interface UserData {
  mood: string;
  coreValue: string;
  supportSystem: string;
  pastResilience: string;
  innerDemon: string;
  desiredOutcome: string;
  nickname: string;
  secretWeapon: string;
  age: string;
  gender: string;
}

const MangaService: React.FC = () => {
  const { token } = useAuth();
  const [appState, setAppState] = useState<
    "onboarding" | "loading" | "viewing"
  >("onboarding");
  const [story, setStory] = useState<StoryPanel[] | null>(null);
  const [storyId, setStoryId] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<string>("");
  const [messageIndex, setMessageIndex] = useState(0);
  const socketRef = useRef<Socket | null>(null);

  const defaultMessages = [
    "Connecting to AI services...",
    "Creating your personalized manga story...",
    "Generating artwork for your panels...",
    "Recording narration and audio...",
    "Finalizing your story experience...",
  ];

  // Cycle through default messages when no specific progress message is provided
  useEffect(() => {
    if (!loadingProgress && appState === "loading") {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % defaultMessages.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [loadingProgress, appState, defaultMessages.length]);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (!socketRef.current) {
      // Convert API_BASE_URL to socket URL (remove /api/v1 suffix)
      const socketUrl = API_BASE_URL.replace("/api/v1", "");
      socketRef.current = io(socketUrl, {
        transports: ["polling", "websocket"],
        reconnectionAttempts: 10,
        reconnectionDelay: 500,
      });

      socketRef.current.on("connect", () => {});

      socketRef.current.on("disconnect", () => {});

      // Listen for story completion updates
      socketRef.current.on("story_complete", (data) => {
        if (data?.story && Array.isArray(data.story.panels)) {
          const panels: StoryPanel[] = data.story.panels.map(
            (panel: any, index: number) => ({
              id:
                panel.id ||
                panel.panel_number?.toString() ||
                (index + 1).toString(),
              imageUrl: panel.imageUrl || panel.image_url || "",
              narrationUrl:
                panel.narrationUrl ||
                panel.tts_url ||
                panel.narration_url ||
                "",
              backgroundMusicUrl:
                panel.backgroundMusicUrl ||
                panel.music_url ||
                panel.background_music_url ||
                "/src/assets/audio/background-music.mp3",
            })
          );

          setStory(panels);
          setAppState("viewing");
        }
      });

      // Listen for individual panel updates
      socketRef.current.on("panel_complete", () => {
        // Handle individual panel updates if needed
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const handleCreateStory = async (userData: UserData) => {
    if (!token) {
      if (import.meta.env.DEV) {
        console.error("No authentication token available");
      }
      return;
    }

    // Basic client-side validation for required fields to avoid 422s
    if (!userData.coreValue?.trim() || !userData.supportSystem?.trim()) {
      setLoadingProgress(
        "Please fill in your Core Value and Support System to create your story."
      );
      setTimeout(() => setAppState("onboarding"), 2000);
      return;
    }

    try {
      setAppState("loading");
      setLoadingProgress("Connecting to Nano-Banana Pipeline...");

      const response = await fetch(
        `${API_BASE_URL}/generate-manga-nano-banana`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            // Match backend models.schemas.StoryInputs exactly
            inputs: {
              mood: userData.mood, // required Literal
              coreValue: userData.coreValue.trim(), // required
              supportSystem: userData.supportSystem.trim(), // required
              pastResilience:
                userData.pastResilience?.trim() ||
                "I have overcome challenges before and learned from each experience, building my inner strength.",
              innerDemon:
                userData.innerDemon?.trim() ||
                "Sometimes I struggle with self-doubt and uncertainty about my path forward.",
              desiredOutcome:
                userData.desiredOutcome?.trim() ||
                "I want to feel more confident and at peace with myself, knowing I can handle whatever comes my way.",
              nickname: userData.nickname.trim(), // required
              secretWeapon:
                userData.secretWeapon?.trim() ||
                "inner strength and determination",
              age: userData.age, // teen | young-adult | adult (or string mapped by server)
              gender: userData.gender,
              // Legacy optional fields intentionally omitted (vibe, situation, etc.)
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setLoadingProgress("AI is creating your personalized manga story...");

      // Parse response
      const result = await response.json();

      // Handle direct response (non-streaming)
      if (result?.status === "completed" && result?.story) {
        const storyData = result.story;
        setStoryId(storyData.story_id);

        const panels: StoryPanel[] = storyData.panels.map((panel: any) => ({
          id:
            panel.id ||
            panel.panel_number?.toString() ||
            (Math.random() * 1000).toString(),
          imageUrl: panel.imageUrl || panel.image_url || "",
          narrationUrl:
            panel.narrationUrl || panel.tts_url || panel.narration_url || "",
          backgroundMusicUrl:
            panel.backgroundMusicUrl ||
            panel.music_url ||
            panel.background_music_url ||
            "/src/assets/audio/background-music.mp3",
        }));

        setStory(panels);
        setAppState("viewing");
      } else if (result?.story_id) {
        // Handle streaming/socket-based generation
        setStoryId(result.story_id);
        setLoadingProgress(
          "AI is creating your panels, images, and narration..."
        );

        if (socketRef.current) {
          socketRef.current.emit("join_story_generation", {
            story_id: result.story_id,
          });
        }
      } else {
        throw new Error(
          `Generation failed or incomplete. Status: ${result?.status}`
        );
      }
    } catch (error) {
      setLoadingProgress("Failed to create story. Please try again.");
      setTimeout(() => {
        setAppState("onboarding");
      }, 3000);
    }
  };

  const renderCurrentComponent = () => {
    try {
      switch (appState) {
        case "onboarding":
          return <OnboardingScreen onCreateStory={handleCreateStory} />;

        case "loading":
          const currentMessage =
            loadingProgress || defaultMessages[messageIndex];
          return <LoadingScreen progressMessage={currentMessage} />;

        case "viewing":
          if (story && story.length > 0) {
            return (
              <MangaViewer
                storyData={story}
                storyId={storyId}
                socket={socketRef.current}
                onPanelUpdate={(updatedPanels) => setStory(updatedPanels)}
              />
            );
          } else {
            return (
              <LoadingScreen
                progressMessage={loadingProgress || "Loading story..."}
              />
            );
          }

        default:
          return <OnboardingScreen onCreateStory={handleCreateStory} />;
      }
    } catch (error) {
      console.error("🎬 Error rendering component:", error);
      return (
        <div className="min-h-screen bg-red-900 flex items-center justify-center text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p>Please refresh the page and try again.</p>
            <pre className="mt-4 text-sm bg-black/20 p-4 rounded">
              {error?.toString()}
            </pre>
          </div>
        </div>
      );
    }
  };

  return (
    <SigninGradientBackground>
      <div className="min-h-screen flex">
        <LightServiceNavigation />
        <div className="flex-1 ml-0 lg:ml-64">{renderCurrentComponent()}</div>
      </div>
    </SigninGradientBackground>
  );
};

export default MangaService;
