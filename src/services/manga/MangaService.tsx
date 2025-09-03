import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import ServiceNavigation from '@/components/navigation/ServiceNavigation';
import OnboardingScreen from '@/components/OnboardingScreen';
import LoadingScreen from '@/components/LoadingScreen';
import MangaViewer from './MangaViewer';

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

const MangaService: React.FC = () => {
  const [appState, setAppState] = useState<'onboarding' | 'loading' | 'viewing'>('onboarding');
  const [story, setStory] = useState<StoryPanel[] | null>(null);
  const [storyId, setStoryId] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<string>("");
  const socketRef = useRef<Socket | null>(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (!socketRef.current) {
      console.log('🔌 Initializing Socket.IO connection...');
      socketRef.current = io('http://localhost:8000', {
        transports: ['polling', 'websocket'],
        reconnectionAttempts: 10,
        reconnectionDelay: 500,
      });

      socketRef.current.on('connect', () => {
        console.log('✅ Connected to backend Socket.IO');
      });

      socketRef.current.onAny((eventName, ...args) => {
        console.log(`🔔 Socket event received: ${eventName}`, args);
      });

      socketRef.current.on('joined_generation', (data: any) => {
        console.log('✅ Successfully joined story generation room:', data);
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from backend Socket.IO');
      });

      // Listen for story generation progress
      socketRef.current.on('generation_progress', (data: any) => {
        console.log('🚨 Generation progress received:', data);

        if (data?.data?.story_id && socketRef.current && !storyId) {
          console.log(`🔗 Auto-joining story room: ${data.data.story_id}`);
          socketRef.current.emit('join_story_generation', { story_id: data.data.story_id });
          setStoryId(data.data.story_id);
        }

        if (data.event_type === 'story_generation_complete') {
          if (data.data && data.data.story) {
            const storyData = data.data.story;
            setStoryId(storyData.story_id);

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
          console.log('🎯 PANEL COMPLETED:', data);
          const panelNumber = data.data?.panel_number || 'X';
          setLoadingProgress(`Panel ${panelNumber} completed! Assets generated.`);
          
          if (panelNumber === 1 && data.data?.panel_data) {
            const firstPanel = data.data.panel_data;
            
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
            
            setStory([initialPanel]);
            setStoryId(data.story_id || data.data.story_id);
            setAppState('viewing');
          }
        } else {
          setLoadingProgress(getProgressMessage(data.event_type, data.data));
        }
      });

      // Listen for panel updates
      socketRef.current.on('panel_processing_complete', (data: any) => {
        console.log('Panel completed:', data);
        const panelNumber = data.data?.panel_number || 'X';
        setLoadingProgress(`Panel ${panelNumber} completed! Assets generated.`);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [storyId]);

  const getProgressMessage = (eventType: string, data: any): string => {
    switch (eventType) {
      case 'story_creation_started':
        return "🎭 Creating your personalized story...";
      case 'panels_generation_started':
        return "🎨 Generating story panels...";
      case 'image_generation_started':
        return `🖼️ Creating image for panel ${data?.panel_number || ''}...`;
      case 'image_generation_complete':
        return `✅ Panel ${data?.panel_number || ''} image ready!`;
      case 'tts_generation_started':
        return `🎙️ Adding narration to panel ${data?.panel_number || ''}...`;
      case 'tts_generation_complete':
        return `🔊 Panel ${data?.panel_number || ''} narration ready!`;
      case 'music_generation_started':
        return `🎵 Composing background music for panel ${data?.panel_number || ''}...`;
      case 'music_generation_complete':
        return `🎶 Panel ${data?.panel_number || ''} music ready!`;
      default:
        return `Processing: ${eventType}`;
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

      const ageValue = userData.age === 'teen' ? 16 :
                      userData.age === 'young-adult' ? 22 :
                      userData.age === 'adult' ? 30 :
                      userData.age === 'mature' ? 45 :
                      userData.age === 'senior' ? 65 : 16;

      const requestData = {
        inputs: {
          mood: userData.mood,
          vibe: userData.animeGenre,
          archetype: userData.archetype,
          dream: userData.pastResilience,
          mangaTitle: userData.mangaTitle,
          nickname: userData.nickname,
          hobby: userData.secretWeapon,
          age: ageValue,
          gender: userData.gender,
          supportSystem: userData.supportSystem,
          coreValue: userData.coreValue,
          innerDemon: userData.innerDemon
        }
      };

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
        console.warn('Non-JSON response from backend, proceeding with socket events only.');
      }
      
      console.log('Story generation initiated:', result);

      if (result?.story_id) {
        setStoryId(result.story_id);
        setLoadingProgress("AI is creating your panels, images, and music...");
        
        if (socketRef.current) {
          console.log(`🔗 Joining story room: ${result.story_id}`);
          
          if (socketRef.current.connected) {
            socketRef.current.emit('join_story_generation', {
              story_id: result.story_id
            });
          } else {
            socketRef.current.on('connect', () => {
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
    <div className="min-h-screen bg-background font-kalam">
      <ServiceNavigation />
      <div className="pt-16">
        {renderCurrentComponent()}
      </div>
    </div>
  );
};

export default MangaService;