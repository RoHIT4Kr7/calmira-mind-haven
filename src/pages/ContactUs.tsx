import React from "react";
import { motion } from "framer-motion";
import LightServiceNavigation from "@/components/navigation/LightServiceNavigation";
import { SigninGradientBackground } from "@/components/ui/signin-gradient-background";
import { ArrowLeft, Mail, Phone, MapPin, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const ContactUs: React.FC = () => {
  return (
    <SigninGradientBackground>
      <div className="min-h-screen flex">
        <LightServiceNavigation />

        <main className="flex-1 ml-0 lg:ml-64 px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 mb-6">
                Contact Us
              </h1>
              <p className="text-white/80 text-lg">
                We are here to help and would love to hear from you.
              </p>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Get in Touch
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">
                        Registered Name
                      </h3>
                      <p className="text-white/80">Calmira AI</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">
                        Operating Address
                      </h3>
                      <p className="text-white/80">
                        Joka, Kolkata, West Bengal - 700104
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Website</h3>
                      <a
                        href="https://calmira-mind-haven.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        https://calmira-mind-haven.vercel.app
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">
                        Support Email
                      </h3>
                      <a
                        href="mailto:rohitworks.ai@gmail.com"
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        rohitworks.ai@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">
                        Support Phone
                      </h3>
                      <a
                        href="tel:+918012345678"
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        +91 80 1234 5678
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <p className="text-white/70 text-sm">
                    For any queries, support requests, or feedback, please reach
                    out to us via email for the quickest response.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </SigninGradientBackground>
  );
};

export default ContactUs;
