import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, Menu, Home, User, BookOpen, Mic, MessageCircle } from 'lucide-react';

interface NavigationProps {
  transparent?: boolean;
  showHamburger?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ 
  transparent = false, 
  showHamburger = false 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isService = location.pathname.startsWith('/services/');

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/dashboard' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
    { id: 'manga', label: 'Manga Creation', icon: BookOpen, path: '/services/manga' },
    { id: 'voice', label: 'Voice Chat', icon: Mic, path: '/services/voice' },
    { id: 'chat', label: 'Chat', icon: MessageCircle, path: '/services/chat' }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // On dashboard: show transparent nav
  // On services: show hamburger menu
  const shouldShowHamburger = isService || showHamburger;
  const shouldBeTransparent = transparent && !isService;

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-40 ${
        shouldBeTransparent 
          ? 'bg-transparent backdrop-blur-sm border-b border-border/20' 
          : 'bg-background/95 backdrop-blur-lg border-b border-border/50'
      }`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-medium rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MW</span>
              </div>
              <span className="font-bold text-foreground">Wellness</span>
            </motion.div>

            {shouldShowHamburger ? (
              /* Hamburger Menu Button */
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMenu}
                className="p-2 hover:bg-primary/10 rounded-xl"
              >
                <Menu className="h-6 w-6 text-foreground" />
              </Button>
            ) : (
              /* Desktop Navigation Links */
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden md:flex items-center space-x-6"
              >
                {navItems.slice(0, 3).map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => handleNavigation(item.path)}
                    className={`text-foreground hover:text-primary hover:bg-primary/10 rounded-xl ${
                      location.pathname === item.path ? 'text-primary bg-primary/10' : ''
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </nav>

      {/* Sliding Navigation Panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Navigation Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-80 max-w-[80vw] nav-panel z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Panel Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-medium rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">MW</span>
                    </div>
                    <div>
                      <h2 className="font-bold text-foreground">Mental Wellness</h2>
                      <p className="text-muted-foreground text-sm">Your companion</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 hover:bg-primary/10 rounded-xl"
                  >
                    <X className="h-5 w-5 text-foreground" />
                  </Button>
                </div>

                {/* Navigation Items */}
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center space-x-3 p-4 rounded-xl text-left transition-all duration-200 ${
                        location.pathname === item.path
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-foreground hover:bg-primary/10 hover:text-primary'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  ))}
                </nav>

                {/* Panel Footer */}
                <div className="mt-8 pt-6 border-t border-border/30">
                  <p className="text-muted-foreground text-sm text-center">
                    Supporting your mental wellness journey
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;