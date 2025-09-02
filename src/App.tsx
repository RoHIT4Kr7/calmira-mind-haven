import { useState, useEffect, useRef } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import OnboardingScreen from "./components/OnboardingScreen";
import LoadingScreen from "./components/LoadingScreen";
import MangaViewer from "./components/manga-viewer/MangaViewer";
import BeforeOnboarding from "./pages/beforeOnboarding/BeforeOnboarding";
import VoiceChat from "./pages/voiceChat/VoiceChat";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Backend API configuration
const API_BASE_URL = "http://localhost:8000/api/v1";

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

// Mental Wellness App Component
const MentalWellnessApp = () => {
  const [appState, setAppState] = useState<'onboarding' | 'loading' | 'viewing'>('onboarding');
  const [story, setStory] = useState<StoryPanel[] | null>(null);
  const [storyId, setStoryId] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<string>("");
  const socketRef = useRef<Socket | null>(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    // Always connect to Socket.IO when component mounts
    if (!socketRef.current) {
      console.log('🔌 Initializing Socket.IO connection...');
      socketRef.current = io('http://localhost:8000', {
        transports: ['polling', 'websocket'], // prefer polling to avoid WS handshake failures
        reconnectionAttempts: 10,
        reconnectionDelay: 500,
      });

      socketRef.current.on('connect', () => {
        console.log('✅ Connected to backend Socket.IO');
      });

      // Debug: Listen to all events
      socketRef.current.onAny((eventName, ...args) => {
        console.log(`🔔 Socket event received: ${eventName}`, args);
      });

      // Listen for room join confirmation
      socketRef.current.on('joined_generation', (data: any) => {
        console.log('✅ Successfully joined story generation room:', data);
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from backend Socket.IO');
      });

      // Listen for story generation progress (global events)
      socketRef.current.on('generation_progress', (data: any) => {
        console.log('🚨 CRITICAL: Generation progress received:', data);

        // Join story room ASAP when we see the first event containing story_id
        if (data?.data?.story_id && socketRef.current && !storyId) {
          console.log(`🔗 Auto-joining story room from progress event: ${data.data.story_id}`);
          socketRef.current.emit('join_story_generation', { story_id: data.data.story_id });
          setStoryId(data.data.story_id);
        }

        if (data.event_type === 'story_generation_complete') {
          // Story generation completed
          if (data.data && data.data.story) {
            const storyData = data.data.story;
            setStoryId(storyData.story_id);

            // Convert backend panels to frontend format
            const panels: StoryPanel[] = storyData.panels.map((panel: any) => ({
              id: panel.id || panel.panel_number?.toString() || (Math.random() * 1000).toString(),
              imageUrl: panel.imageUrl || panel.image_url || '',
              narrationUrl: panel.narrationUrl || panel.tts_url || '',
              backgroundMusicUrl: panel.backgroundMusicUrl || panel.music_url || '/src/assets/audio/background-music.mp3'
            }));

            setStory(panels);
            setAppState('viewing');
          }
        } else if (data.event_type === 'story_generation_error') {
          console.error('Story generation failed:', data.data?.error);
          setLoadingProgress("Story generation failed. Please try again.");
        } else if (data.event_type === 'panel_processing_complete') {
          // Handle panel completion here too
          console.log('🎯 PANEL COMPLETED via generation_progress:', data);
          const panelNumber = data.data?.panel_number || 'X';
          setLoadingProgress(`Panel ${panelNumber} completed! Assets generated.`);
          
          // Start slideshow as soon as first panel is ready
          if (panelNumber === 1 && data.data?.panel_data) {
            const firstPanel = data.data.panel_data;
            
            // Validate that we have the required data
            if (!firstPanel.image_url || !firstPanel.tts_url) {
              console.warn('Panel 1 missing required assets:', firstPanel);
              return;
            }
            
            const initialPanel: StoryPanel = {
              id: '1',
              imageUrl: firstPanel.image_url,
              narrationUrl: firstPanel.tts_url,
              backgroundMusicUrl: firstPanel.music_url || '/src/assets/audio/background-music.mp3'
            };
            
            // Set initial story with first panel and start viewing
            setStory([initialPanel]);
            setStoryId(data.story_id || data.data.story_id);
            setAppState('viewing');
            
            console.log('🎬 STARTING SLIDESHOW IMMEDIATELY!', initialPanel);
          }
        } else {
          // Update loading progress
          setLoadingProgress(getProgressMessage(data.event_type, data.data));
        }
      });

      // Listen for individual panel updates
      socketRef.current.on('panel_processing_complete', (data: any) => {
        console.log('Panel completed:', data);
        const panelNumber = data.data?.panel_number || 'X';
        setLoadingProgress(`Panel ${panelNumber} completed! Assets generated.`);
        
        // Start slideshow as soon as first panel is ready
        if (panelNumber === 1 && data.data?.panel_data) {
          const firstPanel = data.data.panel_data;
          
          // Validate that we have the required data
          if (!firstPanel.image_url || !firstPanel.tts_url) {
            console.warn('Panel 1 missing required assets:', firstPanel);
            return;
          }
          
          const initialPanel: StoryPanel = {
            id: '1',
            imageUrl: firstPanel.image_url,
            narrationUrl: firstPanel.tts_url,
            backgroundMusicUrl: firstPanel.music_url || '/src/assets/audio/background-music.mp3'
          };
          
          // Set initial story with first panel and start viewing
          setStory([initialPanel]);
          setStoryId(data.story_id || data.data.story_id);
          setAppState('viewing');
          
          console.log('🎬 Starting slideshow with first panel!', initialPanel);
        }
      });

      // Listen for additional panels and update existing story
      socketRef.current.on('panel_update', (data: any) => {
        console.log('Panel update received:', data);
        
        // Update existing story with new panel
        if (data.data?.panel_data && story) {
          const newPanel: StoryPanel = {
            id: data.data.panel_number.toString(),
            imageUrl: data.data.panel_data.image_url || '',
            narrationUrl: data.data.panel_data.tts_url || '',
            backgroundMusicUrl: data.data.panel_data.music_url || '/src/assets/audio/background-music.mp3'
          };
          
          setStory(prevStory => {
            if (!prevStory) return [newPanel];
            
            // Add or update panel in story
            const updatedStory = [...prevStory];
            const existingIndex = updatedStory.findIndex(p => p.id === newPanel.id);
            
            if (existingIndex >= 0) {
              updatedStory[existingIndex] = newPanel;
            } else {
              updatedStory.push(newPanel);
            }
            
            // Sort panels by ID to maintain order
            return updatedStory.sort((a, b) => parseInt(a.id) - parseInt(b.id));
          });
        }
      });

      // Listen for music streaming events
      socketRef.current.on('music_streaming_started', () => {
        console.log('🎵 Music streaming started');
        setLoadingProgress("Background music streaming started...");
      });

      socketRef.current.on('audio_chunk', (data: any) => {
        // Handle real-time audio chunks
        console.log('Received audio chunk:', data.timestamp);
      });

      return () => {
        if (socketRef.current) {
          console.log('🔌 Disconnecting Socket.IO...');
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, []); // Only run once when component mounts

  // Convert progress events to user-friendly messages
  const getProgressMessage = (eventType: string, data: any): string => {
    switch (eventType) {
      case 'story_generation_start':
        return "Starting your personalized manga story...";
      case 'panel_ready':
        return `Creating panel ${data.panel_number} of 6...`;
      case 'panel_processing_start':
        return `Generating assets for panel ${data.panel_number}...`;
      case 'image_generation_start':
        return `Creating artwork for panel ${data.panel_number}...`;
      case 'music_generation_start':
        return `Composing music for panel ${data.panel_number}...`;
      case 'tts_generation_start':
        return `Recording narration for panel ${data.panel_number}...`;
      case 'panel_processing_complete':
        return `Panel ${data.panel_number} completed!`;
      case 'music_streaming_start':
        return "Setting up background music streaming...";
      case 'music_extraction_start':
        return "Finalizing background music...";
      default:
        return "Creating your story...";
    }
  };

  const handleCreateStory = async (userData: {
    mood: string;
    animeGenre: string;
    archetype: string;
    supportSystem: string;
    coreValue: string;
    pastResilience: string;
    innerDemon: string;
    mangaTitle: string;
    nickname: string;
    secretWeapon: string;
    age: string;
    gender: string;
  }) => {
    try {
      console.log("Creating story with user data:", userData);
      setAppState('loading');
      setLoadingProgress("Connecting to AI services...");

      // Convert age to proper format
      const ageValue = userData.age === 'teen' ? 16 :
                      userData.age === 'young-adult' ? 22 :
                      userData.age === 'adult' ? 30 :
                      userData.age === 'mature' ? 45 :
                      userData.age === 'senior' ? 65 : 16;

      // Prepare API request payload
      const requestData = {
        inputs: {
          mood: userData.mood,
          vibe: userData.animeGenre, // Map animeGenre to vibe
          archetype: userData.archetype,
          dream: userData.pastResilience, // Map pastResilience to dream
          mangaTitle: userData.mangaTitle,
          nickname: userData.nickname,
          hobby: userData.secretWeapon, // Map secretWeapon to hobby
          age: ageValue,
          gender: userData.gender,
          supportSystem: userData.supportSystem,
          coreValue: userData.coreValue,
          innerDemon: userData.innerDemon
        }
      };

      // We'll join the story room after getting the real story ID from backend response

      // Start the story generation
      setLoadingProgress("AI is crafting your personalized story...");

      const response = await fetch(`${API_BASE_URL}/generate-manga-streaming`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      let result: any = null;
      try {
        result = await response.json();
      } catch (_) {
        // If backend failed to serialize, we still rely on socket events
        console.warn('Non-JSON response from backend, proceeding with socket events only.');
      }
      console.log('Story generation initiated:', result);

      if (result?.story_id) {
        setStoryId(result.story_id);
        setLoadingProgress("AI is creating your panels, images, and music...");
        
        // Join the actual story room with the real story ID from backend
        if (socketRef.current) {
          console.log(`🔗 Joining actual story room: ${result.story_id}`);
          console.log(`🔌 Socket connected: ${socketRef.current.connected}`);
          
          // Ensure socket is connected before joining room
          if (socketRef.current.connected) {
            socketRef.current.emit('join_story_generation', {
              story_id: result.story_id
            });
          } else {
            // Wait for connection then join
            socketRef.current.on('connect', () => {
              console.log(`🔗 Now joining story room after connection: ${result.story_id}`);
              socketRef.current?.emit('join_story_generation', {
                story_id: result.story_id
              });
            });
          }
        }
      }

    } catch (error) {
      console.error('Error creating story:', error);
      setLoadingProgress("Failed to create story. Please try again.");
      setTimeout(() => {
        setAppState('onboarding');
      }, 3000);
    }
  };

  const renderCurrentComponent = () => {
    switch (appState) {
      case 'onboarding':
        return <OnboardingScreen onCreateStory={handleCreateStory} />;
      case 'loading':
        return <LoadingScreen progressMessage={loadingProgress} />;
      case 'viewing':
        return story ? (
          <MangaViewer
            storyData={story}
            storyId={storyId}
            socket={socketRef.current}
            onPanelUpdate={(updatedPanels) => setStory(updatedPanels)}
          />
        ) : <LoadingScreen />;
      default:
        return <OnboardingScreen onCreateStory={handleCreateStory} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderCurrentComponent()}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/before-onboarding" element={<BeforeOnboarding />} />
          <Route path="/mental-wellness" element={<MentalWellnessApp />} />
          <Route path="/voice" element={<VoiceChat />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
