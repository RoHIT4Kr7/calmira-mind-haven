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
    <div className="min-h-screen bg-gradient-to-br from-background via-background-soft to-background overflow-auto">
      {/* Top Navigation Bar - Full Width */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="px-6 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-semibold inter-semibold">MW</span>
            </div>
            <div className="inter-bold text-xl font-bold text-foreground">
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
              className="inter-medium text-foreground hover:text-primary transition-all duration-300 relative group px-3 py-2 rounded-lg hover:bg-primary/10"
            >
              Home
            </Link>
            <Link 
              to="/profile" 
              className="inter-medium text-foreground hover:text-primary transition-all duration-300 relative group px-3 py-2 rounded-lg hover:bg-primary/10"
            >
              Profile
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl poppins-bold text-foreground mb-6">
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
            <h2 className="text-4xl md:text-5xl lg:text-6xl poppins-bold text-foreground mb-12 text-center">
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

        </div>
      </main>

      {/* Sticky Mini Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-border shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="inter-regular text-sm text-muted-foreground">
              &copy; 2024 Mental Wellness App
            </p>
            <div className="flex items-center space-x-6">
              <Link to="/terms" className="inter-regular text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms
              </Link>
              <Link to="/privacy" className="inter-regular text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link to="/contact" className="inter-regular text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;