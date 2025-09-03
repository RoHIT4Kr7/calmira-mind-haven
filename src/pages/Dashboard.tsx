import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AutoScrollingMood from '@/components/dashboard/AutoScrollingMood';
import ServiceCard from '@/components/dashboard/ServiceCard';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 'manga',
      title: 'Manga Creation',
      description: 'Create personalized manga stories based on your mood and preferences',
      icon: '📚',
      path: '/mental-wellness', // Direct to Mental Wellness app
      gradient: 'from-primary-dark/20 to-primary-medium/20'
    },
    {
      id: 'voice',
      title: 'Voice Chat',
      description: 'Have voice conversations with AI friends, therapists, or teachers',
      icon: '🎙️',
      path: '/voice', // Direct to Voice Chat interface
      gradient: 'from-primary-medium/20 to-primary-dark/20'
    },
    {
      id: 'chat',
      title: 'Chat',
      description: 'Text-based conversations with AI companions',
      icon: '💬',
      path: '/services/chat',
      gradient: 'from-accent/20 to-primary/20'
    }
  ];

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-background-deep via-primary-dark to-background overflow-hidden font-kalam">
      {/* Glassmorphism Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-6 mt-4 rounded-2xl bg-primary-dark/30 backdrop-blur-xl border border-primary/20 shadow-2xl">
          <div className="px-6 py-4 flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-medium rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold kalam-bold">MW</span>
              </div>
              <div className="kalam-bold text-xl font-bold text-white">
                Mental Wellness
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-6"
            >
              <Link 
                to="/" 
                className="kalam-regular text-white/90 hover:text-white hover:shadow-glow transition-all duration-300 relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-medium group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                to="/profile" 
                className="kalam-regular text-white/90 hover:text-white hover:shadow-glow transition-all duration-300 relative group"
              >
                Profile
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-medium group-hover:w-full transition-all duration-300"></span>
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Main Content - Full Viewport */}
      <main className="h-full w-full pt-24 pb-8 px-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl kalam-bold text-white mb-4 drop-shadow-2xl">
              How are you?
            </h1>
            <AutoScrollingMood />
          </motion.div>



          {/* Services Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl kalam-bold text-white mb-12 text-center drop-shadow-xl">
              Choose Your Service
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                >
                  <ServiceCard
                    {...service}
                    onClick={() => navigate(service.path)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Footer */}
          <footer className="mt-auto pt-8">
            <div className="text-center">
              <p className="kalam-light text-lg text-white/70">&copy; 2024 Mental Wellness App. Supporting your journey to better mental health.</p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;