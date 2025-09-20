/**
 * MangaService.tsx - Enhanced Manga Generation Service
 *
 * Features:
 * - Multiple AI pipeline support (Nano-Banana, Gemini, Unified, Optimized, Streaming)
 * - Real-time progress tracking with Socket.IO
 * - Development pipeline selector for testing
 * - Automatic pipeline-specific handling (streaming vs direct response)
 *
 * Default Pipeline: Nano-Banana Workflow (~1 min generation)
 * Available Pipelines:
 * - nano-banana: LangGraph + Gemini 2.5 Flash + Chirp 3 HD (fastest)
 * - gemini: Pure Gemini 2.5 Flash Image Preview
 * - unified: Hybrid Google AI Studio + Vertex AI (production)
 * - optimized: Enhanced Imagen 4.0 with consistency
 * - streaming: Original real-time pipeline
 */
import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import LightServiceNavigation from "@/components/navigation/LightServiceNavigation";
import OnboardingScreen from "@/components/OnboardingScreen";
import LoadingScreen from "@/components/LoadingScreen";
import MangaViewer from "@/components/manga-viewer/MangaViewer";
import { useAuth } from "@/context/AuthContext";

// Backend API configuration
const API_BASE_URL = "http://localhost:8000/api/v1";

// Pipeline options for manga generation
interface PipelineOption {
  id: string;
  name: string;
  endpoint: string;
  description: string;
  features: string[];
  estimatedTime: string;
}

const PIPELINE_OPTIONS: PipelineOption[] = [
  {
    id: "nano-banana",
    name: "Nano-Banana Workflow",
    endpoint: "/generate-manga-nano-banana",
    description: "LangGraph workflow with Gemini 2.5 Flash + Chirp 3 HD",
    features: [
      "Reference image bootstrapping",
      "Parallel generation",
      "500 RPM rate limit",
    ],
    estimatedTime: "~1 minute",
  },
  {
    id: "streaming",
    name: "Streaming Pipeline",
    endpoint: "/generate-manga-streaming",
    description: "Original pipeline with real-time progress updates",
    features: [
      "Real-time updates",
      "Socket.IO streaming",
      "Progressive loading",
    ],
    estimatedTime: "~3 minutes",
  },
  {
    id: "original",
    name: "Original Pipeline",
    endpoint: "/generate-manga",
    description: "Original complete manga generation pipeline",
    features: ["Story planning", "Image generation", "Audio generation"],
    estimatedTime: "~2 minutes",
  },
];

// Story data interface
interface StoryPanel {
  id: string;
  imageUrl: string;
  narrationUrl: string;
  backgroundMusicUrl?: string;
}

interface StoryData {
  story_id: string;
  panels: StoryPanel[];
  status: string;
  created_at: string;
}

const MangaService: React.FC = () => {
  const { token } = useAuth();
  const [appState, setAppState] = useState<
    "onboarding" | "loading" | "viewing"
  >("onboarding");
  const [story, setStory] = useState<StoryPanel[] | null>(null);
  const [storyId, setStoryId] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<string>("");
  const socketRef = useRef<Socket | null>(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (!socketRef.current) {
      console.log("🔌 Initializing Socket.IO connection...");
      socketRef.current = io("http://localhost:8000", {
        transports: ["polling", "websocket"],
        reconnectionAttempts: 10,
        reconnectionDelay: 500,
      });

      socketRef.current.on("connect", () => {
        console.log("✅ Connected to backend Socket.IO");
      });

      socketRef.current.onAny((eventName, ...args) => {
        console.log(`🔔 Socket event received: ${eventName}`, args);
      });

      socketRef.current.on("joined_generation", (data: any) => {
        console.log("✅ Successfully joined story generation room:", data);
      });

      socketRef.current.on("disconnect", () => {
        console.log("Disconnected from backend Socket.IO");
      });

      // Listen for story generation progress with enhanced panel handling
      socketRef.current.on("generation_progress", (data: any) => {
        console.log("🚨 Generation progress received:", data);

        if (data?.data?.story_id && socketRef.current && !storyId) {
          console.log(`🔗 Auto-joining story room: ${data.data.story_id}`);
          socketRef.current.emit("join_story_generation", {
            story_id: data.data.story_id,
          });
          setStoryId(data.data.story_id);
        }

        if (data.event_type === "story_generation_complete") {
          console.log("🎬 Story generation complete received:", data);
          if (data.data && data.data.story) {
            const storyData = data.data.story;
            setStoryId(storyData.story_id);

            const panels: StoryPanel[] = storyData.panels.map(
              (panel: any, index: number) => ({
                id: panel.id || (index + 1).toString(),
                imageUrl: panel.imageUrl || panel.image_url || "",
                narrationUrl:
                  panel.narrationUrl ||
                  panel.narration_url ||
                  panel.tts_url ||
                  "",
                backgroundMusicUrl:
                  panel.backgroundMusicUrl ||
                  panel.music_url ||
                  panel.background_music_url ||
                  "/src/assets/audio/background-music.mp3",
              })
            );

            console.log("🎬 Processed panels for viewing:", panels);
            setStory(panels);
            setAppState("viewing");
          }
        } else if (data.event_type === "story_generation_error") {
          console.error("Story generation failed:", data.data?.error);
          setLoadingProgress("Story generation failed. Please try again.");
        } else if (data.event_type === "panel_processing_complete") {
          console.log("🎯 PANEL COMPLETED:", data);
          const panelNumber = data.data?.panel_number || "X";
          setLoadingProgress(
            `Panel ${panelNumber} completed! Assets generated.`
          );

          // Handle first panel - start slideshow immediately
          if (panelNumber === 1 && data.data?.panel_data) {
            const firstPanel = data.data.panel_data;

            // Validate required assets before starting slideshow
            if (!firstPanel.image_url || !firstPanel.tts_url) {
              console.warn("Panel 1 missing required assets:", firstPanel);
              return;
            }

            const initialPanel: StoryPanel = {
              id: "1",
              imageUrl: firstPanel.image_url,
              narrationUrl: firstPanel.tts_url,
              backgroundMusicUrl:
                firstPanel.music_url ||
                "/src/assets/audio/background-music.mp3",
            };

            console.log(
              "🎬 Starting slideshow with first panel!",
              initialPanel
            );
            setStory([initialPanel]);
            setStoryId(data.story_id || data.data.story_id);
            setAppState("viewing");
          }

          // Handle subsequent panels - update existing story dynamically
          else if (panelNumber > 1 && data.data?.panel_data) {
            const newPanelData = data.data.panel_data;

            if (newPanelData.image_url && newPanelData.tts_url) {
              const newPanel: StoryPanel = {
                id: panelNumber.toString(),
                imageUrl: newPanelData.image_url,
                narrationUrl: newPanelData.tts_url,
                backgroundMusicUrl:
                  newPanelData.music_url ||
                  "/src/assets/audio/background-music.mp3",
              };

              console.log(`📱 Adding panel ${panelNumber} to existing story`);
              setStory((prevStory) => {
                if (!prevStory) return [newPanel];

                // Add new panel if it doesn't exist, or update if it does
                const existingIndex = prevStory.findIndex(
                  (p) => p.id === panelNumber.toString()
                );
                if (existingIndex >= 0) {
                  const updatedStory = [...prevStory];
                  updatedStory[existingIndex] = newPanel;
                  return updatedStory.sort(
                    (a, b) => parseInt(a.id) - parseInt(b.id)
                  );
                } else {
                  return [...prevStory, newPanel].sort(
                    (a, b) => parseInt(a.id) - parseInt(b.id)
                  );
                }
              });
            }
          }
        } else {
          setLoadingProgress(getProgressMessage(data.event_type, data.data));
        }
      });

      // Listen for panel updates and dynamic story building
      socketRef.current.on("panel_update", (data: any) => {
        console.log("🔄 Panel update received:", data);

        if (data.data?.panel_data && data.data?.panel_number) {
          const panelData = data.data.panel_data;
          const panelNum = data.data.panel_number;

          if (panelData.image_url && panelData.tts_url) {
            const updatedPanel: StoryPanel = {
              id: panelNum.toString(),
              imageUrl: panelData.image_url,
              narrationUrl: panelData.tts_url,
              backgroundMusicUrl:
                panelData.music_url || "/src/assets/audio/background-music.mp3",
            };

            console.log(`🔄 Updating panel ${panelNum} in story`);
            setStory((prevStory) => {
              if (!prevStory) return [updatedPanel];

              const existingIndex = prevStory.findIndex(
                (p) => p.id === panelNum.toString()
              );
              if (existingIndex >= 0) {
                const updatedStory = [...prevStory];
                updatedStory[existingIndex] = updatedPanel;
                return updatedStory.sort(
                  (a, b) => parseInt(a.id) - parseInt(b.id)
                );
              } else {
                return [...prevStory, updatedPanel].sort(
                  (a, b) => parseInt(a.id) - parseInt(b.id)
                );
              }
            });
          }
        }
      });

      // Also listen for individual panel completion events
      socketRef.current.on("panel_processing_complete", (data: any) => {
        console.log("Panel processing complete:", data);
        const panelNumber = data.data?.panel_number || "X";
        setLoadingProgress(`Panel ${panelNumber} completed! Assets generated.`);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []); // Only run once on mount

  const getProgressMessage = (eventType: string, data: any): string => {
    const pipelineName = "Nano-Banana Pipeline";

    switch (eventType) {
      case "story_creation_started":
        return `🎭 ${pipelineName} is creating your personalized story...`;
      case "panels_generation_started":
        return `🎨 ${pipelineName} is generating story panels...`;
      case "reference_generation_started":
        return `🎯 ${pipelineName} is creating reference images for character consistency...`;
      case "reference_generation_complete":
        return `✅ Reference images ready! Starting panel generation...`;
      case "image_generation_started":
        return `🖼️ ${pipelineName} is creating image for panel ${
          data?.panel_number || ""
        }...`;
      case "image_generation_complete":
        return `✅ Panel ${
          data?.panel_number || ""
        } image ready with ${pipelineName}!`;
      case "tts_generation_started":
        return `🎙️ Adding narration to panel ${data?.panel_number || ""}...`;
      case "tts_generation_complete":
        return `🔊 Panel ${data?.panel_number || ""} narration ready!`;
      case "music_generation_started":
        return `🎵 Composing background music for panel ${
          data?.panel_number || ""
        }...`;
      case "music_generation_complete":
        return `🎶 Panel ${data?.panel_number || ""} music ready!`;
      case "parallel_generation_started":
        return `⚡ ${pipelineName} is generating all 6 panels in parallel...`;
      case "parallel_generation_complete":
        return `🚀 All panels generated with ${pipelineName}! Finalizing...`;
      default:
        return `${pipelineName} processing: ${eventType}`;
    }
  };

  const handleCreateStory = async (userData: {
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
  }) => {
    try {
      console.log("Creating story with user data:", userData);

      console.log(
        `🚀 Using pipeline: Nano-Banana Pipeline (/api/v1/generate-manga-nano-banana)`
      );

      setAppState("loading");
      setLoadingProgress(`Connecting to Nano-Banana Pipeline...`);

      const ageValue =
        userData.age === "teen"
          ? 16
          : userData.age === "young-adult"
          ? 22
          : userData.age === "adult"
          ? 30
          : userData.age === "mature"
          ? 45
          : userData.age === "senior"
          ? 65
          : 16;

      // Map desiredOutcome to valid vibe enum
      const mapDesiredOutcomeToVibe = (desiredOutcome: string): string => {
        const outcome = desiredOutcome.toLowerCase();
        if (
          outcome.includes("confident") ||
          outcome.includes("strong") ||
          outcome.includes("motivated")
        ) {
          return "motivational";
        } else if (
          outcome.includes("peaceful") ||
          outcome.includes("calm") ||
          outcome.includes("tranquil")
        ) {
          return "calm";
        } else if (
          outcome.includes("adventure") ||
          outcome.includes("explore") ||
          outcome.includes("journey")
        ) {
          return "adventure";
        } else if (
          outcome.includes("music") ||
          outcome.includes("sing") ||
          outcome.includes("creative")
        ) {
          return "musical";
        } else if (
          outcome.includes("slice") ||
          outcome.includes("daily") ||
          outcome.includes("simple")
        ) {
          return "slice-of-life";
        } else if (
          outcome.includes("fantasy") ||
          outcome.includes("magical") ||
          outcome.includes("mystical")
        ) {
          return "fantasy";
        } else if (
          outcome.includes("isekai") ||
          outcome.includes("world") ||
          outcome.includes("reborn")
        ) {
          return "isekai";
        } else if (
          outcome.includes("shonen") ||
          outcome.includes("battle") ||
          outcome.includes("fight")
        ) {
          return "shonen";
        } else {
          return "motivational"; // Safe default
        }
      };

      // Map the userData to the expected backend format
      const requestData = {
        inputs: {
          mood: userData.mood,
          vibe: mapDesiredOutcomeToVibe(
            userData.desiredOutcome || "motivational"
          ),
          archetype: "hero", // Default archetype
          dream: userData.pastResilience,
          mangaTitle: `${userData.nickname}'s Journey`, // Generate title from nickname
          nickname: userData.nickname,
          hobby: userData.secretWeapon,
          age: ageValue,
          gender: userData.gender,
          supportSystem: userData.supportSystem,
          coreValue: userData.coreValue,
          innerDemon: userData.innerDemon,
        },
      };

      setLoadingProgress(
        `Nano-Banana Pipeline is crafting your personalized story...`
      );

      const response = await fetch(
        `${API_BASE_URL}/api/v1/generate-manga-nano-banana`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      let result: any = null;
      try {
        result = await response.json();
      } catch (parseError) {
        console.warn("Non-JSON response from backend:", parseError);

        // For streaming endpoint, proceed with socket events only
        // Note: nano-banana pipeline doesn't use streaming
        throw new Error("Invalid response format from server");
      }

      console.log("Story generation result:", result);

      // Handle different response formats - nano-banana uses direct response
      // Non-streaming pipelines - direct response handling
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
          console.log(
            `✅ Story generated successfully with Nano-Banana Pipeline:`,
            panels.length,
            "panels"
          );
        } else {
          throw new Error(
            `Generation failed or incomplete. Status: ${result?.status}`
          );
        }
      }
    } catch (error) {
      console.error("Error creating story:", error);
      setLoadingProgress(
        `Failed to create story with Nano-Banana Pipeline. Please try again.`
      );
      setTimeout(() => {
        setAppState("onboarding");
      }, 3000);
    }
  };

  const renderCurrentComponent = () => {
    console.log(
      "🎬 Rendering component - AppState:",
      appState,
      "Story:",
      story
    );

    try {
      switch (appState) {
        case "onboarding":
          return (
            <OnboardingScreen
              onCreateStory={(userData) => handleCreateStory(userData)}
            />
          );
        case "loading":
          return <LoadingScreen progressMessage={loadingProgress} />;
        case "viewing":
          if (story && story.length > 0) {
            console.log("🎬 Rendering MangaViewer with story:", story);
            return (
              <MangaViewer
                storyData={story}
                storyId={storyId}
                socket={socketRef.current}
                onPanelUpdate={(updatedPanels) => setStory(updatedPanels)}
              />
            );
          } else {
            console.log("🎬 No story data, showing loading screen");
            return (
              <LoadingScreen
                progressMessage={loadingProgress || "Loading story..."}
              />
            );
          }
        default:
          return (
            <OnboardingScreen
              onCreateStory={(userData) => handleCreateStory(userData)}
            />
          );
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background-soft to-background flex">
      <LightServiceNavigation />

      <div className="flex-1 ml-0 lg:ml-64">{renderCurrentComponent()}</div>
    </div>
  );
};

export default MangaService;
