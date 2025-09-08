import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface OnboardingScreenProps {
  onCreateStory: (data: {
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
  }) => void;
}

const OnboardingScreen = ({ onCreateStory }: OnboardingScreenProps) => {
  const [step, setStep] = useState(1);
  const [storyInputs, setStoryInputs] = useState({
    mood: '',
    coreValue: '',
    supportSystem: '',
    pastResilience: '',
    innerDemon: '',
    desiredOutcome: '',
    nickname: '',
    secretWeapon: '',
    age: '',
    gender: ''
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
                      storyInputs.secretWeapon.trim() &&
                      storyInputs.age &&
                      storyInputs.gender;

  // Step 1: Your Inner Compass
  const renderInnerCompassStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-semibold text-foreground">
          Your Inner Compass 🧭
        </h1>
        <p className="text-sm text-muted-foreground">
          Let's ground you in your present emotional state and core values
        </p>
      </div>
      
      {/* Mood Section */}
      <div className="space-y-3">
        <h2 className="text-base font-medium text-foreground text-center">
          How are you feeling right now?
        </h2>
        <div className="grid grid-cols-5 gap-2">
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
              className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                storyInputs.mood === mood.value
                  ? 'border-primary bg-primary/10 shadow-lg'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="text-2xl mb-1">{mood.emoji}</div>
              <div className="text-xs font-medium text-foreground">{mood.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Core Value Section */}
      <div className="space-y-3">
        <h2 className="text-base font-medium text-foreground text-center">
          What principle guides your path?
        </h2>
        <div className="grid grid-cols-2 gap-2">
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
              className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                storyInputs.coreValue === value.value
                  ? 'border-primary bg-primary/10 shadow-lg'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="text-xl mb-1">{value.emoji}</div>
              <div className="text-xs font-medium text-foreground mb-1">{value.label}</div>
              <div className="text-xs text-muted-foreground">{value.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Step 2: Your Source of Strength
  const renderSourceOfStrengthStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-semibold text-foreground">
          Your Source of Strength 💪
        </h1>
        <p className="text-sm text-muted-foreground">
          Let's recognize your resilience and support systems
        </p>
      </div>

      {/* Support System Section */}
      <div className="space-y-3">
        <h2 className="text-base font-medium text-foreground text-center">
          Who stands by your side?
        </h2>
        <div className="grid grid-cols-1 gap-2">
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
              className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                storyInputs.supportSystem === support.value
                  ? 'border-primary bg-primary/10 shadow-lg'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="text-xl">{support.emoji}</div>
                <div className="text-left">
                  <div className="text-sm font-medium text-foreground">{support.label}</div>
                  <div className="text-xs text-muted-foreground">{support.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Past Resilience Section */}
      <div className="space-y-3">
        <h2 className="text-base font-medium text-foreground text-center">
          What's a challenge you've already conquered?
        </h2>
        <Textarea
          value={storyInputs.pastResilience}
          onChange={(e) => updateStoryInputs('pastResilience', e.target.value)}
          placeholder="e.g., I overcame my fear of public speaking by joining a debate club..."
          className="bg-card border-border text-foreground placeholder:text-muted-foreground min-h-[80px] resize-none"
        />
        <p className="text-xs text-muted-foreground text-center">
          This shows your inner strength and gives hope for future victories
        </p>
      </div>
    </div>
  );

  // Step 3: The Challenge Ahead
  const renderChallengeAheadStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-semibold text-foreground">
          The Challenge Ahead ⚔️
        </h1>
        <p className="text-sm text-muted-foreground">
          Let's identify your primary struggle and desired outcome
        </p>
      </div>

      {/* Inner Demon Section */}
      <div className="space-y-3">
        <h2 className="text-base font-medium text-foreground text-center">
          What is the main internal struggle you're facing?
        </h2>
        <Textarea
          value={storyInputs.innerDemon}
          onChange={(e) => updateStoryInputs('innerDemon', e.target.value)}
          placeholder="e.g., Self-doubt that whispers 'you're not good enough'..."
          className="bg-card border-border text-foreground placeholder:text-muted-foreground min-h-[80px] resize-none"
        />
        <p className="text-xs text-muted-foreground text-center">
          This becomes the villain in your story - the obstacle you must overcome
        </p>
      </div>

      {/* Desired Outcome Section */}
      <div className="space-y-3">
        <h2 className="text-base font-medium text-foreground text-center">
          What would overcoming this struggle look like for you?
        </h2>
        <Textarea
          value={storyInputs.desiredOutcome}
          onChange={(e) => updateStoryInputs('desiredOutcome', e.target.value)}
          placeholder="e.g., Feeling confident in my abilities and pursuing my dreams without fear..."
          className="bg-card border-border text-foreground placeholder:text-muted-foreground min-h-[80px] resize-none"
        />
        <p className="text-xs text-muted-foreground text-center">
          This is your hero's ultimate goal - the victory you're working towards
        </p>
      </div>
    </div>
  );

  // Step 4: Your Hero's Identity
  const renderHeroIdentityStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-semibold text-foreground">
          Your Hero's Identity 🦸
        </h1>
        <p className="text-sm text-muted-foreground">
          Let's personalize your character and frame their inner strength as a superpower
        </p>
      </div>

      {/* Hero Name and Superpower */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nickname" className="text-sm text-foreground">
            What is your hero's name?
          </Label>
          <Input
            id="nickname"
            value={storyInputs.nickname}
            onChange={(e) => updateStoryInputs('nickname', e.target.value)}
            placeholder="Enter your hero's name"
            className="bg-card border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="secretWeapon" className="text-sm text-foreground">
            What is your secret superpower?
          </Label>
          <Input
            id="secretWeapon"
            value={storyInputs.secretWeapon}
            onChange={(e) => updateStoryInputs('secretWeapon', e.target.value)}
            placeholder="e.g., your kindness, your creativity, your perseverance"
            className="bg-card border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Demographics */}
      <div className="space-y-4">
        {/* Age Selection */}
        <div className="space-y-3">
          <h2 className="text-base font-medium text-foreground text-center">
            What's your age range?
          </h2>
          <div className="grid grid-cols-3 gap-2">
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
                className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                  storyInputs.age === age.value
                    ? 'border-primary bg-primary/10 shadow-lg'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <div className="text-xs font-medium text-foreground">{age.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Gender Selection */}
        <div className="space-y-3">
          <h2 className="text-base font-medium text-foreground text-center">
            How do you identify?
          </h2>
          <div className="grid grid-cols-2 gap-2">
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
                className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                  storyInputs.gender === gender.value
                    ? 'border-primary bg-primary/10 shadow-lg'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <div className="text-xs font-medium text-foreground">{gender.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );


  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderInnerCompassStep();
      case 2:
        return renderSourceOfStrengthStep();
      case 3:
        return renderChallengeAheadStep();
      case 4:
        return renderHeroIdentityStep();
      default:
        return renderInnerCompassStep();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-4">
          {/* Progress Bar */}
          <div className="space-y-3">
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderCurrentStep()}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
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
                    (step === 1 && (!storyInputs.mood || !storyInputs.coreValue)) ||
                    (step === 2 && (!storyInputs.supportSystem || !storyInputs.pastResilience.trim())) ||
                    (step === 3 && (!storyInputs.innerDemon.trim() || !storyInputs.desiredOutcome.trim()))
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
