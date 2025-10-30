import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 px-6 border-t border-white/10 bg-black/20 backdrop-blur-lg">
      <div className="container mx-auto max-w-7xl">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/apple-touch-icon.png"
                alt="Calmira"
                className="h-12 w-12 select-none rounded-lg"
                draggable={false}
              />
              <h3 className="text-white font-bold text-xl">Calmira AI</h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Your personal sanctuary for mental wellness. Finding calm in the
              chaos with AI-powered support.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:rohitworks.ai@gmail.com"
                  className="text-white/70 hover:text-white transition-colors text-sm break-all"
                >
                  rohitworks.ai@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <a
                  href="tel:+918012345678"
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  +91 96 08765 599
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <span className="text-white/70 text-sm">
                  Joka, Kolkata, WB - 700104
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-sm text-white/60 text-center">
            © 2025 Calmira AI. Mental wellness for the next generation. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
