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
  Brain,
} from "lucide-react";

const LightServiceNavigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/dashboard" },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
    { id: "manga", label: "Manga", icon: BookOpen, path: "/services/manga" },
    { id: "voice", label: "Voice", icon: Mic, path: "/services/voice" },
    {
      id: "meditation",
      label: "Meditation",
      icon: Brain,
      path: "/services/meditation",
    },
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

  return (
    <>
      {/* Mobile Hamburger Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMobileMenu}
          className="p-3 bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 rounded-xl shadow-md"
        >
          <Menu className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Desktop Left Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className="hidden lg:flex fixed top-0 left-0 h-full w-64 bg-black/20 backdrop-blur-lg border-r border-white/10 flex-col z-40 shadow-lg"
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <img
              src="/images/logocalmira.jpg"
              alt="Calmira"
              className="w-10 h-10 object-contain"
            />
            <div>
              <h2 className="font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                CalmiraAI
              </h2>
              <p className="text-white/60 text-sm">Your companion</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-white/20 text-white border border-white/30 shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/50 text-center">
            &copy; 2025 CalmiraAI
          </p>
        </div>
      </motion.div>

      {/* Mobile Sliding Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Sliding Navigation Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="lg:hidden fixed top-0 left-0 h-full w-80 max-w-[80vw] bg-black/20 backdrop-blur-lg border-r border-white/10 z-50 overflow-y-auto shadow-2xl"
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
                      <h2 className="font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                        CalmiraAI
                      </h2>
                      <p className="text-white/60 text-sm">Your companion</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-xl"
                  >
                    <X className="h-5 w-5 text-white" />
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
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        location.pathname === item.path
                          ? "bg-white/20 text-white border border-white/30 shadow-lg"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </motion.button>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default LightServiceNavigation;
