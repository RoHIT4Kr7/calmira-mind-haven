import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  X,
  Menu,
  Home,
  User,
  BookOpen,
  Mic,
  MessageCircle,
} from "lucide-react";

interface ImprovedNavigationProps {
  transparent?: boolean;
}

const ImprovedNavigation: React.FC<ImprovedNavigationProps> = ({
  transparent = false,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/dashboard" },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
    {
      id: "manga",
      label: "Manga Creation",
      icon: BookOpen,
      path: "/mental-wellness",
    },
    { id: "voice", label: "Voice Chat", icon: Mic, path: "/voice" },
    {
      id: "chat",
      label: "Dhyaan AI",
      icon: MessageCircle,
      path: "/services/chat",
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isCurrentPath = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64">
        <div className="flex h-full flex-col bg-background/95 backdrop-blur-xl border-r border-border">
          {/* Logo/Brand */}
          <div className="flex items-center px-6 py-8">
            <div className="flex items-center space-x-3">
              <img
                src="/images/logocalmira.jpg"
                alt="Calmira"
                className="w-10 h-10 object-contain"
              />
              <div>
                <h2 className="font-bold text-foreground text-xl kalam-bold">
                  CalmiraAI
                </h2>
                <p className="text-muted-foreground text-sm kalam-light">
                  Your companion
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 space-y-2">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ x: 4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-4 rounded-xl text-left transition-all duration-300 kalam-regular ${
                  isCurrentPath(item.path)
                    ? "bg-primary/20 text-primary border border-primary/30 shadow-lg"
                    : "text-foreground hover:bg-primary/10 hover:text-primary hover:shadow-md"
                }`}
              >
                <item.icon className="h-6 w-6" />
                <span className="font-medium text-lg">{item.label}</span>
              </motion.button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-border/30">
            <p className="text-muted-foreground text-sm text-center kalam-light">
              Supporting your wellness journey
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden">
        <div
          className={`fixed top-0 left-0 right-0 z-40 ${
            transparent
              ? "bg-transparent backdrop-blur-sm border-b border-border/20"
              : "bg-background/95 backdrop-blur-lg border-b border-border/50"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2 hover:bg-primary/10 rounded-xl"
            >
              <Menu className="h-6 w-6 text-foreground" />
            </Button>

            {/* Mobile Brand */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-medium rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MW</span>
              </div>
              <span className="font-bold text-foreground kalam-bold">
                Wellness
              </span>
            </div>

            {/* Spacer for balance */}
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Navigation Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-background/98 backdrop-blur-xl border-r border-border z-50 overflow-y-auto lg:hidden"
            >
              <div className="p-6">
                {/* Panel Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <img
                      src="/images/logocalmira.jpg"
                      alt="Calmira"
                      className="w-10 h-10 object-contain"
                    />
                    <div>
                      <h2 className="font-bold text-foreground kalam-bold">
                        CalmiraAI
                      </h2>
                      <p className="text-muted-foreground text-sm kalam-light">
                        Your companion
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-primary/10 rounded-xl"
                  >
                    <X className="h-5 w-5 text-foreground" />
                  </Button>
                </div>

                {/* Mobile Navigation Items */}
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center space-x-3 p-4 rounded-xl text-left transition-all duration-200 kalam-regular ${
                        isCurrentPath(item.path)
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "text-foreground hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      <item.icon className="h-6 w-6" />
                      <span className="font-medium text-lg">{item.label}</span>
                    </motion.button>
                  ))}
                </nav>

                {/* Mobile Panel Footer */}
                <div className="mt-8 pt-6 border-t border-border/30">
                  <p className="text-muted-foreground text-sm text-center kalam-light">
                    Supporting your wellness journey
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

export default ImprovedNavigation;
