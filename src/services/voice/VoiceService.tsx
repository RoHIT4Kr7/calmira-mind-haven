import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ServiceNavigation from '@/components/navigation/ServiceNavigation';
import ChatInterface from '@/services/chat/ChatInterface';

interface VoiceOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  personality: string;
  gradient: string;
}

const VoiceService: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const navigate = useNavigate();

  const voiceOptions: VoiceOption[] = [
    {
      id: 'friend',
      title: 'Talk to Friend',
      description: 'Chat with a supportive AI friend who listens and understands',
      icon: '👥',
      personality: 'Friendly, casual, supportive, and understanding',
      gradient: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      id: 'therapist',
      title: 'Talk to Therapist',
      description: 'Professional AI therapist for mental health support and guidance',
      icon: '🧠',
      personality: 'Professional, empathetic, trained in therapeutic techniques',
      gradient: 'from-green-500/20 to-teal-500/20'
    },
    {
      id: 'teacher',
      title: 'Talk to Teacher',
      description: 'Educational AI that helps you learn and grow intellectually',
      icon: '🎓',
      personality: 'Knowledgeable, patient, encouraging, and educational',
      gradient: 'from-purple-500/20 to-indigo-500/20'
    }
  ];

  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleBackToOptions = () => {
    setSelectedOption(null);
  };

  const getContactInfo = (optionId: string) => {
    const option = voiceOptions.find(opt => opt.id === optionId);
    switch (optionId) {
      case 'friend':
        return {
          name: 'Alex - Your AI Friend',
          avatar: '/images/friend-avatar.png',
          status: 'Ready to chat and listen'
        };
      case 'therapist':
        return {
          name: 'Dr. Sarah - AI Therapist',
          avatar: '/images/therapist-avatar.png',
          status: 'Professional support available'
        };
      case 'teacher':
        return {
          name: 'Prof. Morgan - AI Educator',
          avatar: '/images/teacher-avatar.png',
          status: 'Ready to help you learn'
        };
      default:
        return {
          name: 'AI Assistant',
          avatar: '/images/default-avatar.png',
          status: 'Online'
        };
    }
  };

  if (selectedOption) {
    const contactInfo = getContactInfo(selectedOption);
    const option = voiceOptions.find(opt => opt.id === selectedOption);
    
    return (
      <div className="min-h-screen bg-background font-kalam">
        <ServiceNavigation />
        
        <div className="pt-16 h-screen">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4 }}
            className="h-full flex flex-col"
          >
            {/* Back Button */}
            <div className="p-4 border-b border-border">
              <Button
                variant="ghost"
                onClick={handleBackToOptions}
                className="text-foreground hover:text-primary hover:bg-primary/10 rounded-xl"
              >
                ← Back to Options
              </Button>
            </div>

            {/* Chat Interface */}
            <div className="flex-1">
              <ChatInterface
                contactName={contactInfo.name}
                contactAvatar={contactInfo.avatar}
                contactStatus={contactInfo.status}
                initialMessages={[
                  {
                    id: 'welcome',
                    content: `Hello! I'm here to ${option?.description.toLowerCase()}. How can I help you today?`,
                    sender: 'ai',
                    timestamp: new Date(),
                    type: 'text'
                  }
                ]}
                onSendMessage={(message) => {
                  console.log(`Message to ${selectedOption}:`, message);
                  // Handle message sending to specific AI type
                }}
                onVoiceMessage={() => {
                  console.log(`Voice message for ${selectedOption}`);
                  // Handle voice messages
                }}
                onVoiceCall={() => {
                  console.log(`Voice call with ${selectedOption}`);
                  // Handle voice calls
                }}
                onVideoCall={() => {
                  console.log(`Video call with ${selectedOption}`);
                  // Handle video calls
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-kalam">
      <ServiceNavigation />
      
      <main className="lg:ml-64 min-h-screen pt-20 lg:pt-0 px-4 pb-8">
        <div className="max-w-6xl mx-auto py-8 lg:py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl kalam-bold text-foreground mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Voice Chat Service
            </h1>
            <p className="text-muted-foreground text-xl md:text-2xl max-w-4xl mx-auto kalam-light leading-relaxed">
              Choose who you'd like to talk with. Each AI companion has been trained with different personalities and expertise to support you.
            </p>
          </motion.div>

          {/* Voice Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {voiceOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className={`service-card cursor-pointer bg-gradient-to-br ${option.gradient} backdrop-blur-sm border-border/50 hover:border-primary/50 h-full`}>
                  <CardContent className="p-8 h-full flex flex-col">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="text-6xl">{option.icon}</div>
                      <h3 className="text-2xl kalam-bold text-foreground">{option.title}</h3>
                    </div>
                    
                    <p className="text-muted-foreground mb-6 flex-grow text-lg kalam-light leading-relaxed">
                      {option.description}
                    </p>
                    
                    <div className="mb-8 p-4 bg-background/50 rounded-xl border border-border/30">
                      <p className="text-base text-muted-foreground kalam-light">
                        <strong className="text-foreground kalam-regular">Personality:</strong> {option.personality}
                      </p>
                    </div>
                    
                    <Button
                      onClick={() => handleSelectOption(option.id)}
                      className="w-full bg-gradient-to-r from-primary to-primary-medium hover:from-primary-medium hover:to-primary text-primary-foreground kalam-regular font-semibold py-4 text-lg rounded-2xl transition-all duration-300"
                    >
                      Start Conversation
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Features Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 p-6 bg-card/50 rounded-2xl border border-border/30 backdrop-blur-sm"
          >
            <h3 className="text-2xl md:text-3xl kalam-bold text-foreground mb-8 text-center">
              Voice Chat Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-4">
                <div className="text-4xl">🎙️</div>
                <p className="text-base kalam-light text-muted-foreground">Real-time voice conversations</p>
              </div>
              <div className="space-y-4">
                <div className="text-4xl">🧠</div>
                <p className="text-base kalam-light text-muted-foreground">AI trained for emotional support</p>
              </div>
              <div className="space-y-4">
                <div className="text-4xl">🔒</div>
                <p className="text-base kalam-light text-muted-foreground">Private and secure conversations</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default VoiceService;