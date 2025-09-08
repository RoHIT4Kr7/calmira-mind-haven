import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white/95 backdrop-blur-lg border-t border-border shadow-md mt-16">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        
        {/* Left: Logo + Name */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-bold">MW</span>
          </div>
          <span className="text-lg inter-bold text-foreground">Mental Wellness</span>
        </div>

        {/* Center: Quick Links */}
        <div className="flex items-center space-x-6">
          <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms</Link>
          <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy</Link>
          <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link>
          <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">About</Link>
        </div>

        {/* Right: Copyright */}
        <p className="text-sm text-muted-foreground text-center md:text-right">
          © {new Date().getFullYear()} Mental Wellness App. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
