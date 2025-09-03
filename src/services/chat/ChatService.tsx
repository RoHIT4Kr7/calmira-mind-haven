import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LightServiceNavigation from '@/components/navigation/LightServiceNavigation';
import ChatInterface from './ChatInterface';

interface ChatAgent {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  personality: string;
  avatar: string;
  status: string;
  gradient: string;
  specialties: string[];
}

const ChatService: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const navigate = useNavigate();

  const chatAgents: ChatAgent[] = [
    {
      id: 'wellness-coach',
      name: 'Maya',
      title: 'Wellness Coach',
      description: 'Specialized in mental health, mindfulness, and emotional support',
      icon: '🧘‍♀️',
      personality: 'Empathetic, calm, and supportive with expertise in mindfulness techniques',
      avatar: '/images/wellness-coach-avatar.png',
      status: 'Ready to support your wellness journey',
      gradient: 'from-green-500/20 to-emerald-500/20',
      specialties: ['Mindfulness', 'Stress Management', 'Emotional Support']
    },
    {
      id: 'life-coach',
      name: 'Alex',
      title: 'Life Coach',
      description: 'Helps with goal setting, productivity, and personal development',
      icon: '🎯',
      personality: 'Motivational, organized, and goal-oriented with practical advice',
      avatar: '/images/life-coach-avatar.png',
      status: 'Ready to help you achieve your goals',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      specialties: ['Goal Setting', 'Productivity', 'Personal Growth']
    },
    {
      id: 'therapist',
      name: 'Dr. Sarah',
      title: 'AI Therapist',
      description: 'Professional therapeutic support for mental health concerns',
      icon: '🧠',
      personality: 'Professional, empathetic, trained in therapeutic techniques',
      avatar: '/images/therapist-avatar.png',
      status: 'Professional support available',
      gradient: 'from-purple-500/20 to-indigo-500/20',
      specialties: ['Cognitive Therapy', 'Anxiety Support', 'Depression Help']
    },
    {
      id: 'companion',
      name: 'Riley',
      title: 'AI Companion',
      description: 'Friendly companion for casual conversations and daily support',
      icon: '🤝',
      personality: 'Friendly, casual, understanding, and always ready to listen',
      avatar: '/images/companion-avatar.png',
      status: 'Always here to chat',
      gradient: 'from-orange-500/20 to-pink-500/20',
      specialties: ['Daily Support', 'Casual Chat', 'Companionship']
    }
  ];

  const handleSelectAgent = (agentId: string) => {
    setSelectedAgent(agentId);
  };

  const handleBackToAgents = () => {
    setSelectedAgent(null);
  };

  const getSelectedAgentInfo = (agentId: string) => {
    return chatAgents.find(agent => agent.id === agentId);
  };

  const handleSendMessage = (message: string) => {
    console.log(`Message sent to ${selectedAgent}:`, message);
    // Here you would typically send the message to your backend API
  };

  const handleVoiceMessage = () => {
    console.log(`Voice message requested for ${selectedAgent}`);
    // Implement voice recording functionality
  };

  const handleVoiceCall = () => {
    console.log(`Voice call requested with ${selectedAgent}`);
    // Implement voice call functionality
  };

  const handleVideoCall = () => {
    console.log(`Video call requested with ${selectedAgent}`);
    // Implement video call functionality
  };

  if (selectedAgent) {
    const agent = getSelectedAgentInfo(selectedAgent);
    if (!agent) return null;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background-soft to-background flex">
        <LightServiceNavigation currentPage="Chat" />
        
        <div className="flex-1 ml-0 lg:ml-64">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4 }}
            className="h-screen flex flex-col"
          >
            {/* Back Button */}
            <div className="p-6 bg-white/95 backdrop-blur-lg border-b border-border">
              <Button
                variant="ghost"
                onClick={handleBackToAgents}
                className="text-foreground hover:text-primary hover:bg-primary/10 rounded-xl inter-medium"
              >
                ← Back to Agents
              </Button>
            </div>

            {/* Chat Interface */}
            <div className="flex-1">
              <ChatInterface
                contactName={agent.name}
                contactAvatar={agent.avatar}
                contactStatus={agent.status}
                initialMessages={[
                  {
                    id: 'welcome',
                    content: `Hello! I'm ${agent.name}, your ${agent.title}. ${agent.description}. How can I help you today?`,
                    sender: 'ai',
                    timestamp: new Date(),
                    type: 'text'
                  }
                ]}
                onSendMessage={handleSendMessage}
                onVoiceMessage={handleVoiceMessage}
                onVoiceCall={handleVoiceCall}
                onVideoCall={handleVideoCall}
              />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-soft to-background flex">
      <LightServiceNavigation currentPage="Chat" />
      
      <main className="flex-1 ml-0 lg:ml-64 px-4 py-8">
        <div className="max-w-6xl mx-auto py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl poppins-bold text-foreground mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Chat Service
            </h1>
            <p className="text-muted-foreground text-xl md:text-2xl max-w-4xl mx-auto inter-regular leading-relaxed">
              Choose your ideal AI companion. Each agent has unique specialties and personalities to support different aspects of your wellness journey.
            </p>
          </motion.div>

          {/* Chat Agents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {chatAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="service-card cursor-pointer bg-white/95 backdrop-blur-sm border border-border/50 hover:border-primary/50 hover:shadow-lg h-full transition-all duration-300">
                  <CardContent className="p-8 h-full flex flex-col">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="text-6xl">{agent.icon}</div>
                      <div>
                        <h3 className="text-2xl poppins-semibold text-foreground">{agent.name}</h3>
                        <p className="text-lg inter-medium text-primary">{agent.title}</p>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-6 flex-grow text-lg inter-regular leading-relaxed">
                      {agent.description}
                    </p>
                    
                    <div className="mb-6 p-4 bg-background/50 rounded-xl border border-border/30">
                      <p className="text-base text-muted-foreground inter-regular mb-3">
                        <strong className="text-foreground inter-medium">Personality:</strong> {agent.personality}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {agent.specialties.map((specialty, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-primary/20 text-primary text-sm inter-regular rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleSelectAgent(agent.id)}
                      className="w-full bg-gradient-to-r from-primary to-primary-medium hover:from-primary-medium hover:to-primary text-primary-foreground inter-medium font-semibold py-4 text-lg rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Start Chat
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
            className="p-8 bg-white/95 rounded-2xl border border-border/30 backdrop-blur-sm shadow-lg"
          >
            <h3 className="text-2xl md:text-3xl poppins-semibold text-foreground mb-8 text-center">
              Chat Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-4">
                <div className="text-4xl">💬</div>
                <p className="text-base inter-regular text-muted-foreground">Real-time messaging</p>
              </div>
              <div className="space-y-4">
                <div className="text-4xl">🎭</div>
                <p className="text-base inter-regular text-muted-foreground">Multiple personalities</p>
              </div>
              <div className="space-y-4">
                <div className="text-4xl">🧠</div>
                <p className="text-base inter-regular text-muted-foreground">Specialized expertise</p>
              </div>
              <div className="space-y-4">
                <div className="text-4xl">🔒</div>
                <p className="text-base inter-regular text-muted-foreground">Private & secure</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ChatService;