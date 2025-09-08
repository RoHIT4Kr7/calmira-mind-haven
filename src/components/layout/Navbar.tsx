import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, BarChart3 } from "lucide-react";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Profile", path: "/profile" },
  { name: "Services", path: "#services" }, // anchor scroll
];

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Sticky frosted navbar */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div
          className="
            w-full bg-white/80 backdrop-blur-md
            border-b border-gray-200 shadow-sm
          "
        >
          <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* LEFT: Logo */}
              <Link
                to="/"
                className="flex items-center gap-2 font-bold text-xl text-gray-900"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-10 h-10 flex items-center justify-center rounded-lg
                             bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                >
                  C
                </motion.div>
                <span className="hidden sm:inline">Calmira AI</span>
              </Link>

              {/* CENTER: Navigation links (desktop) */}
              <nav className="hidden lg:flex items-center gap-8">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.path}
                    className="relative text-gray-700 font-medium transition-colors hover:text-indigo-600"
                  >
                    {link.name}
                    {/* Animated underline */}
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                ))}
              </nav>

              {/* RIGHT: Buttons */}
              <div className="flex items-center gap-3">
                {/* Analytics */}
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-md
                             text-gray-700 hover:text-indigo-600 transition"
                >
                  <BarChart3 size={18} />
                  Analytics
                </motion.button>

                {/* Sign Up */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow-md
                             hover:bg-indigo-500 transition"
                >
                  Sign Up
                </motion.button>

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
            className="fixed inset-x-0 top-16 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg z-40"
          >
            <div className="px-6 py-6 space-y-4">
              <nav className="flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={() => setMobileOpen(false)}
                    className="text-gray-800 font-medium px-4 py-2 rounded-md hover:bg-indigo-50 transition"
                  >
                    {link.name}
                  </a>
                ))}
              </nav>

              <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md
                             text-gray-700 border border-gray-300 hover:bg-gray-100 transition"
                >
                  <BarChart3 size={18} />
                  Analytics
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-4 py-2 rounded-md bg-indigo-600 text-white font-medium shadow hover:bg-indigo-500 transition"
                >
                  Sign Up
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
