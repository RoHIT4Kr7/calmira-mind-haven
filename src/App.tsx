import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OnboardingScreen from "./components/OnboardingScreen";
import LoadingScreen from "./components/LoadingScreen";
import MangaViewer from "./components/MangaViewer";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Mock story data for demonstration
const mockStoryData = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    narrationUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  },
  {
    id: "2", 
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    narrationUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop", 
    narrationUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop",
    narrationUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  }
];

// Mental Wellness App Component
const MentalWellnessApp = () => {
  const [appState, setAppState] = useState<'onboarding' | 'loading' | 'viewing'>('onboarding');
  const [story, setStory] = useState<typeof mockStoryData | null>(null);

  const handleCreateStory = (userData: { 
    mood: string; 
    vibe: string; 
    archetype: string; 
    dream: string; 
    mangaTitle: string; 
    nickname: string; 
    hobby: string; 
  }) => {
    console.log("Creating story with user data:", userData);
    setAppState('loading');

    // Simulate API call
    setTimeout(() => {
      setStory(mockStoryData);
      setAppState('viewing');
    }, 5000);
  };

  const renderCurrentComponent = () => {
    switch (appState) {
      case 'onboarding':
        return <OnboardingScreen onCreateStory={handleCreateStory} />;
      case 'loading':
        return <LoadingScreen />;
      case 'viewing':
        return story ? <MangaViewer storyData={story} /> : <LoadingScreen />;
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
          <Route path="/mental-wellness" element={<MentalWellnessApp />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
