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
  }) => void;
}

const OnboardingScreen = ({ onCreateStory }: OnboardingScreenProps) => {
  const [step, setStep] = useState(1);
  const [storyInputs, setStoryInputs] = useState({
    mood: '',
    animeGenre: '',
    archetype: '',
    supportSystem: '',
    coreValue: '',
    pastResilience: '',
    innerDemon: '',
    mangaTitle: '',
    nickname: '',
    secretWeapon: '',
    age: '',
    gender: ''
  });

  const totalSteps = 9;

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

  const isStep8Valid = storyInputs.nickname.trim() &&
                      storyInputs.secretWeapon.trim() &&
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

  // Step 2: Anime Genre Selection
  const renderAnimeGenreStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">
          What anime genre calls to you?
        </h1>
        <p className="text-muted-foreground">
          Choose the style that resonates with your story
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: Feather, label: 'Slice of Life', value: 'slice-of-life', description: 'Everyday moments, personal growth' },
          { icon: Sword, label: 'Shōnen', value: 'shonen', description: 'Action, friendship, determination' },
          { icon: Mountain, label: 'Isekai', value: 'isekai', description: 'New worlds, adventure, discovery' },
          { icon: Star, label: 'Fantasy', value: 'fantasy', description: 'Magic, wonder, epic journeys' }
        ].map((genre) => (
          <button
            key={genre.value}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              updateStoryInputs('animeGenre', genre.value);
            }}
            className={`p-6 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
              storyInputs.animeGenre === genre.value
                ? 'border-primary bg-primary/10 shadow-lg'
                : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            <genre.icon className="w-8 h-8 mx-auto mb-3 text-foreground" />
            <div className="text-sm font-medium text-foreground mb-1">{genre.label}</div>
            <div className="text-xs text-muted-foreground">{genre.description}</div>
          </button>
        ))}
      </div>
    </div>
  );

  // Step 3: Archetype Selection
  const renderArchetypeStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">
          Every story needs a hero...
        </h1>
        <p className="text-muted-foreground">
          Let's discover who you are in this journey
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium text-foreground text-center">
          Who do you connect with more?
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {[
            { emoji: '🧙', label: 'Mentor', value: 'mentor', description: 'Wise guide' },
            { emoji: '🦸', label: 'Hero', value: 'hero', description: 'Brave leader' },
            { emoji: '🐉', label: 'Companion', value: 'companion', description: 'Loyal friend' },
            { emoji: '🎭', label: 'Comedian', value: 'comedian', description: 'Brings joy' }
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
              <div className="text-xs font-medium text-foreground mb-1">{archetype.label}</div>
              <div className="text-xs text-muted-foreground">{archetype.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Step 4: Support System (Your Nakama)
  const renderSupportSystemStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">
          Your Nakama 🏘️
        </h1>
        <p className="text-muted-foreground">
          Every hero needs allies on their journey
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium text-foreground text-center">
          Who stands by your side?
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {[
            { emoji: '👨‍🏫', label: 'A Wise Mentor', value: 'mentor', description: 'Someone who guides and teaches you' },
            { emoji: '👯‍♂️', label: 'A Loyal Friend', value: 'friend', description: 'Your ride-or-die companion' },
            { emoji: '🏆', label: 'A Friendly Rival', value: 'rival', description: 'Someone who pushes you to be better' },
            { emoji: '👨‍👩‍👧‍👦', label: 'My Inner Circle', value: 'inner-circle', description: 'A group of trusted people' },
            { emoji: '📖', label: 'My Journal/Self', value: 'self-reflection', description: 'Your own wisdom and reflection' }
          ].map((support) => (
            <button
              key={support.value}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                updateStoryInputs('supportSystem', support.value);
              }}
              className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                storyInputs.supportSystem === support.value
                  ? 'border-primary bg-primary/10 shadow-lg'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{support.emoji}</div>
                <div className="text-left">
                  <div className="text-sm font-medium text-foreground">{support.label}</div>
                  <div className="text-xs text-muted-foreground">{support.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Step 5: Core Values (Your Ninja Way)
  const renderCoreValuesStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">
          Your Ninja Way 🥷
        </h1>
        <p className="text-muted-foreground">
          What principle guides your path?
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium text-foreground text-center">
          Choose your guiding principle
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { emoji: '💝', label: 'Kindness', value: 'kindness', description: 'Compassion for others' },
            { emoji: '🕊️', label: 'Freedom', value: 'freedom', description: 'Personal liberty' },
            { emoji: '⚡', label: 'Strength', value: 'strength', description: 'Inner power' },
            { emoji: '🎯', label: 'Purpose', value: 'purpose', description: 'Clear direction' },
            { emoji: '🌟', label: 'Growth', value: 'growth', description: 'Continuous improvement' },
            { emoji: '🤝', label: 'Connection', value: 'connection', description: 'Building bonds' },
            { emoji: '🔥', label: 'Passion', value: 'passion', description: 'Following your fire' },
            { emoji: '🧘', label: 'Peace', value: 'peace', description: 'Inner harmony' }
          ].map((value) => (
            <button
              key={value.value}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                updateStoryInputs('coreValue', value.value);
              }}
              className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                storyInputs.coreValue === value.value
                  ? 'border-primary bg-primary/10 shadow-lg'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="text-2xl mb-2">{value.emoji}</div>
              <div className="text-sm font-medium text-foreground mb-1">{value.label}</div>
              <div className="text-xs text-muted-foreground">{value.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Step 6: Past Resilience (Your Origin Story)
  const renderPastResilienceStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">
          Your Origin Story 📖
        </h1>
        <p className="text-muted-foreground">
          Every hero has overcome challenges before
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium text-foreground text-center">
          What's a challenge you've already conquered?
        </h2>
        <Textarea
          value={storyInputs.pastResilience}
          onChange={(e) => updateStoryInputs('pastResilience', e.target.value)}
          placeholder="e.g., I overcame my fear of public speaking by joining a debate club..."
          className="bg-card border-border text-foreground placeholder:text-muted-foreground min-h-[120px] resize-none"
        />
        <p className="text-sm text-muted-foreground text-center">
          This shows your inner strength and gives hope for future victories
        </p>
      </div>
    </div>
  );

  // Step 7: Inner Demon (Your Curse)
  const renderInnerDemonStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">
          Your Inner Demon 👹
        </h1>
        <p className="text-muted-foreground">
          What curse do you battle with daily?
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium text-foreground text-center">
          Name your primary internal struggle
        </h2>
        <Textarea
          value={storyInputs.innerDemon}
          onChange={(e) => updateStoryInputs('innerDemon', e.target.value)}
          placeholder="e.g., Self-doubt that whispers 'you're not good enough'..."
          className="bg-card border-border text-foreground placeholder:text-muted-foreground min-h-[120px] resize-none"
        />
        <p className="text-sm text-muted-foreground text-center">
          This becomes the villain in your story - the obstacle you must overcome
        </p>
      </div>
    </div>
  );

  // Step 8: Age & Gender
  const renderAgeGenderStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">
          Final Details 📝
        </h1>
        <p className="text-muted-foreground">
          A few more details to personalize your hero's journey
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Age Selection */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-foreground text-center">
            What's your age range?
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: '13-17', value: 'teen' },
              { label: '18-25', value: 'young-adult' },
              { label: '26-35', value: 'adult' },
              { label: '36-50', value: 'mature' },
              { label: '51+', value: 'senior' },
              { label: 'Prefer not to say', value: 'not-specified' }
            ].map((age) => (
              <button
                key={age.value}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  updateStoryInputs('age', age.value);
                }}
                className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                  storyInputs.age === age.value
                    ? 'border-primary bg-primary/10 shadow-lg'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <div className="text-sm font-medium text-foreground">{age.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Gender Selection */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-foreground text-center">
            How do you identify?
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Female', value: 'female' },
              { label: 'Male', value: 'male' },
              { label: 'Non-binary', value: 'non-binary' },
              { label: 'Prefer not to say', value: 'not-specified' }
            ].map((gender) => (
              <button
                key={gender.value}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  updateStoryInputs('gender', gender.value);
                }}
                className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                  storyInputs.gender === gender.value
                    ? 'border-primary bg-primary/10 shadow-lg'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <div className="text-sm font-medium text-foreground">{gender.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Step 5: Final Details
  const renderFinalStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">
          The Final Chapter ✨
        </h1>
        <p className="text-muted-foreground">
          Name your hero and title your manga story
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
          <Label htmlFor="secretWeapon" className="text-foreground">
            What is their secret weapon or source of strength?
          </Label>
          <Input
            id="secretWeapon"
            value={storyInputs.secretWeapon}
            onChange={(e) => updateStoryInputs('secretWeapon', e.target.value)}
            placeholder="e.g., Their creativity, kindness, or perseverance"
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
        return renderAnimeGenreStep();
      case 3:
        return renderArchetypeStep();
      case 4:
        return renderSupportSystemStep();
      case 5:
        return renderCoreValuesStep();
      case 6:
        return renderPastResilienceStep();
      case 7:
        return renderInnerDemonStep();
      case 8:
        return renderAgeGenderStep();
      case 9:
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
                  disabled={!isStep8Valid}
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
                    (step === 2 && !storyInputs.animeGenre) ||
                    (step === 3 && !storyInputs.archetype) ||
                    (step === 4 && !storyInputs.supportSystem) ||
                    (step === 5 && !storyInputs.coreValue) ||
                    (step === 6 && !storyInputs.pastResilience.trim()) ||
                    (step === 7 && !storyInputs.innerDemon.trim()) ||
                    (step === 8 && (!storyInputs.age || !storyInputs.gender))
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
