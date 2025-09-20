import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, BarChart3 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Menu as NavMenu,
  MenuItem,
  ProductItem,
} from "@/components/ui/navbar-menu";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Profile", path: "/profile" },
];

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <>
      {/* Sticky frosted navbar */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div
          className="
            w-full bg-black/20 backdrop-blur-lg
            border-b border-white/10 shadow-lg
          "
        >
          <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* LEFT: Logo */}
              <Link
                to="/"
                className="flex items-center gap-2 font-bold text-xl text-white"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-10 h-10 flex items-center justify-center rounded-lg overflow-hidden"
                >
                  <img
                    src="/images/logocalmira.jpg"
                    alt="Calmira"
                    className="w-full h-full object-contain"
                  />
                </motion.div>
                <span className="hidden sm:inline">Calmira AI</span>
              </Link>

              {/* CENTER: Navigation links (desktop) */}
              <nav className="hidden lg:flex items-center gap-8">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.path}
                    className="relative text-white/80 font-medium transition-colors hover:text-white"
                  >
                    {link.name}
                    {/* Animated underline */}
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
                  </a>
                ))}

                {/* Services Menu */}
                <div className="relative">
                  <NavMenu setActive={setActive}>
                    <MenuItem
                      setActive={setActive}
                      active={active}
                      item="Services"
                    >
                      <div className="text-sm grid grid-cols-2 gap-6 p-6 w-[600px]">
                        <ProductItem
                          title="Manga Stories"
                          href="/services/manga"
                          src="/images/mangaimage.jpg"
                          description="Generate personalized manga stories for emotional healing and growth"
                        />
                        <ProductItem
                          title="Voice Chat"
                          href="/services/voice"
                          src="/images/voiceagent.png"
                          description="Talk with an AI companion for emotional support and guidance"
                        />
                        <ProductItem
                          title="Meditation"
                          href="/services/meditation"
                          src="/images/meditate.jpg"
                          description="Guided meditation sessions for mindfulness and stress relief"
                        />
                        <ProductItem
                          title="Chat AI"
                          href="/services/chat"
                          src="/images/dhyaan-default.jpg"
                          description="AI-powered chat for personalized wellness conversations"
                        />
                      </div>
                    </MenuItem>
                  </NavMenu>
                </div>
              </nav>

              {/* RIGHT: Buttons */}
              <div className="flex items-center gap-3">
                {/* Auth state */}
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    {user?.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name || "User"}
                        className="w-8 h-8 rounded-full object-cover border border-white/20"
                        onError={(e) => {
                          console.error(
                            "Failed to load profile picture:",
                            user.picture
                          );
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                        <span className="text-white text-xs font-medium">
                          {user?.name?.charAt(0)?.toUpperCase() ||
                            user?.email?.charAt(0)?.toUpperCase() ||
                            "U"}
                        </span>
                      </div>
                    )}
                    <span className="hidden sm:block text-white/80 text-sm">
                      {user?.name || user?.email}
                    </span>
                    <button
                      onClick={logout}
                      className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm border border-white/20"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium shadow-md border border-white/20 transition"
                  >
                    Login
                  </Link>
                )}

                {/* Hamburger (mobile only) */}
                <button
                  onClick={() => setMobileOpen((s) => !s)}
                  className="lg:hidden p-2 rounded-md text-gray-700 hover:text-indigo-600 transition"
                >
                  {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE DROPDOWN */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ y: -200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -200, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 top-16 bg-black/20 backdrop-blur-lg border-b border-white/10 shadow-lg z-40"
          >
            <div className="px-6 py-6 space-y-4">
              <nav className="flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={() => setMobileOpen(false)}
                    className="text-white/80 font-medium px-4 py-2 rounded-md hover:bg-white/10 transition"
                  >
                    {link.name}
                  </a>
                ))}

                {/* Mobile Services */}
                <div className="space-y-2">
                  <p className="text-white/60 font-medium px-4 py-2">
                    Services
                  </p>
                  <Link
                    to="/services/manga"
                    onClick={() => setMobileOpen(false)}
                    className="text-white/80 font-medium px-4 py-2 rounded-md hover:bg-white/10 transition block ml-4"
                  >
                    Manga Stories
                  </Link>
                  <Link
                    to="/services/voice"
                    onClick={() => setMobileOpen(false)}
                    className="text-white/80 font-medium px-4 py-2 rounded-md hover:bg-white/10 transition block ml-4"
                  >
                    Voice Chat
                  </Link>
                  <Link
                    to="/services/meditation"
                    onClick={() => setMobileOpen(false)}
                    className="text-white/80 font-medium px-4 py-2 rounded-md hover:bg-white/10 transition block ml-4"
                  >
                    Meditation
                  </Link>
                  <Link
                    to="/services/chat"
                    onClick={() => setMobileOpen(false)}
                    className="text-white/80 font-medium px-4 py-2 rounded-md hover:bg-white/10 transition block ml-4"
                  >
                    Chat AI
                  </Link>
                </div>
              </nav>

              <div className="flex flex-col gap-3 pt-4 border-t border-white/20">
                {!isAuthenticated && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium shadow border border-white/20 transition"
                  >
                    Sign Up
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
