import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white/10 dark:bg-black/20 backdrop-blur-lg border-t border-white/20 shadow-lg mt-16">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        
        {/* Left: Logo + Name */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#0f0c29] to-[#24243e] rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-bold drop-shadow-md">MW</span>
          </div>
          <span className="text-lg inter-bold text-white drop-shadow-md">Mental Wellness</span>
        </div>

        {/* Center: Quick Links */}
        <div className="flex items-center space-x-6">
          <Link 
            to="/terms" 
            className="text-sm text-white drop-shadow-md hover:text-[#ee4444] hover:underline underline-offset-4 transition-colors duration-300"
          >
            Terms
          </Link>
          <Link 
            to="/privacy" 
            className="text-sm text-white drop-shadow-md hover:text-[#ee4444] hover:underline underline-offset-4 transition-colors duration-300"
          >
            Privacy
          </Link>
          <Link 
            to="/contact" 
            className="text-sm text-white drop-shadow-md hover:text-[#ee4444] hover:underline underline-offset-4 transition-colors duration-300"
          >
            Contact
          </Link>
          <Link 
            to="/about" 
            className="text-sm text-white drop-shadow-md hover:text-[#ee4444] hover:underline underline-offset-4 transition-colors duration-300"
          >
            About
          </Link>
        </div>

        {/* Right: Copyright */}
        <p className="text-sm text-white drop-shadow-md text-center md:text-right">
          © {new Date().getFullYear()} Mental Wellness App. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
