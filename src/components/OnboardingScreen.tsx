import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Feather, Mountain, Music, Zap, Sword, Star } from "lucide-react";

interface OnboardingScreenProps {
  onCreateStory: (data: {
    mood: string;
    vibe: string;
    archetype: string;
    dream: string;
    mangaTitle: string;
    nickname: string;
    hobby: string;
  }) => void;
}

const OnboardingScreen = ({ onCreateStory }: OnboardingScreenProps) => {
  const [step, setStep] = useState(1);
  const [storyInputs, setStoryInputs] = useState({
    mood: '',
    vibe: '',
    archetype: '',
    dream: '',
    mangaTitle: '',
    nickname: '',
    hobby: ''
  });

  const totalSteps = 4;

  const updateStoryInputs = (key: string, value: string) => {
    setStoryInputs(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateStory(storyInputs);
  };

  const isStep4Valid = storyInputs.nickname.trim() && 
                      storyInputs.hobby.trim() && 
                      storyInputs.mangaTitle.trim();

  // Step 1: Mood Check-in
  const renderMoodStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">
          How are you feeling right now?
        </h1>
        <p className="text-muted-foreground">
          Choose the emotion that resonates with you most
        </p>
      </div>
      
      <div className="grid grid-cols-5 gap-3">
        {[
          { emoji: '😊', label: 'Happy', value: 'happy' },
          { emoji: '😟', label: 'Stressed', value: 'stressed' },
          { emoji: '😐', label: 'Neutral', value: 'neutral' },
          { emoji: '😤', label: 'Frustrated', value: 'frustrated' },
          { emoji: '😢', label: 'Sad', value: 'sad' }
        ].map((mood) => (
          <button
            key={mood.value}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              updateStoryInputs('mood', mood.value);
            }}
            className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
              storyInputs.mood === mood.value
                ? 'border-primary bg-primary/10 shadow-lg'
                : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            <div className="text-3xl mb-2">{mood.emoji}</div>
            <div className="text-sm font-medium text-foreground">{mood.label}</div>
          </button>
        ))}
      </div>
    </div>
  );

  // Step 2: Story Vibe
  const renderVibeStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">
          What kind of vibe are you looking for?
        </h1>
        <p className="text-muted-foreground">
          Pick the energy that speaks to your soul
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: Feather, label: 'Calm & Relaxing', value: 'calm' },
          { icon: Sword, label: 'Adventure', value: 'adventure' },
          { icon: Music, label: 'Musical', value: 'musical' },
          { icon: Zap, label: 'Motivational', value: 'motivational' }
        ].map((vibe) => (
          <button
            key={vibe.value}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              updateStoryInputs('vibe', vibe.value);
            }}
            className={`p-6 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
              storyInputs.vibe === vibe.value
                ? 'border-primary bg-primary/10 shadow-lg'
                : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            <vibe.icon className="w-8 h-8 mx-auto mb-3 text-foreground" />
            <div className="text-sm font-medium text-foreground">{vibe.label}</div>
          </button>
        ))}
      </div>
    </div>
  );

  // Step 3: Main Character
  const renderCharacterStep = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">
          Every story needs a hero...
        </h1>
        <p className="text-muted-foreground">
          Let's discover who you are in this journey
        </p>
      </div>
      
      {/* Archetype Selection */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-foreground text-center">
          Who do you connect with more?
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {[
            { emoji: '🧙', label: 'Mentor', value: 'mentor' },
            { emoji: '🦸', label: 'Hero', value: 'hero' },
            { emoji: '🐉', label: 'Companion', value: 'companion' },
            { emoji: '🎭', label: 'Comedian', value: 'comedian' }
          ].map((archetype) => (
            <button
              key={archetype.value}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                updateStoryInputs('archetype', archetype.value);
              }}
              className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                storyInputs.archetype === archetype.value
                  ? 'border-primary bg-primary/10 shadow-lg'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="text-2xl mb-2">{archetype.emoji}</div>
              <div className="text-xs font-medium text-foreground">{archetype.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Dream/Aspiration */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-foreground text-center">
          What's something you dream about achieving?
        </h2>
        <Textarea
          value={storyInputs.dream}
          onChange={(e) => updateStoryInputs('dream', e.target.value)}
          placeholder="e.g., To feel more confident..."
          className="bg-card border-border text-foreground placeholder:text-muted-foreground min-h-[100px] resize-none"
        />
      </div>
    </div>
  );

  // Step 4: Final Details
  const renderFinalStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">
          Let's add the final touches
        </h1>
        <p className="text-muted-foreground">
          These details will make your story truly personal
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nickname" className="text-foreground">
            What should we call your character?
          </Label>
          <Input
            id="nickname"
            value={storyInputs.nickname}
            onChange={(e) => updateStoryInputs('nickname', e.target.value)}
            placeholder="Enter character name"
            className="bg-card border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hobby" className="text-foreground">
            What is their favorite activity?
          </Label>
          <Input
            id="hobby"
            value={storyInputs.hobby}
            onChange={(e) => updateStoryInputs('hobby', e.target.value)}
            placeholder="Their passion or hobby"
            className="bg-card border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mangaTitle" className="text-foreground">
            If this chapter of your life were a manga, what would the title be?
          </Label>
          <Input
            id="mangaTitle"
            value={storyInputs.mangaTitle}
            onChange={(e) => updateStoryInputs('mangaTitle', e.target.value)}
            placeholder="e.g., The Journey Within"
            className="bg-card border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderMoodStep();
      case 2:
        return renderVibeStep();
      case 3:
        return renderCharacterStep();
      case 4:
        return renderFinalStep();
      default:
        return renderMoodStep();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-6">
          {/* Progress Bar */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Step {step} of {totalSteps}</span>
              <span className="text-sm text-muted-foreground">
                {Math.round((step / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {renderCurrentStep()}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
                className="text-foreground border-border hover:bg-card disabled:opacity-50"
              >
                Back
              </Button>
              
              {step === totalSteps ? (
                <Button
                  type="submit"
                  disabled={!isStep4Valid}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create My Story
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (step === 1 && !storyInputs.mood) ||
                    (step === 2 && !storyInputs.vibe) ||
                    (step === 3 && (!storyInputs.archetype || !storyInputs.dream.trim()))
                  }
                  className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingScreen;
