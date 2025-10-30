import React from "react";
import { motion } from "framer-motion";
import LightServiceNavigation from "@/components/navigation/LightServiceNavigation";
import { SigninGradientBackground } from "@/components/ui/signin-gradient-background";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy: React.FC = () => {
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
                Privacy Policy
              </h1>
              <p className="text-white/80 text-lg">
                Your privacy is critically important to us. This policy outlines
                what data we collect and how we use it.
              </p>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Information We Collect
                  </h2>

                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Account Information
                      </h3>
                      <p className="text-white/80 leading-relaxed">
                        When you sign in (e.g., via Google), we collect your
                        name, email address, and profile picture as provided by
                        the authentication service.
                      </p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        User Inputs
                      </h3>
                      <p className="text-white/80 leading-relaxed">
                        We collect the information you provide during onboarding
                        and service use, such as your mood, core values,
                        challenges, nickname, age, and gender. This is used to
                        personalize your AI-generated content.
                      </p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Usage Data
                      </h3>
                      <p className="text-white/80 leading-relaxed">
                        We collect anonymous data about how you interact with
                        our services to improve our platform.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    How We Use Your Information
                  </h2>
                  <ul className="space-y-3 text-white/80">
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 mt-1">✦</span>
                      <span>
                        To provide and personalize our services (manga, voice,
                        meditation).
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 mt-1">✦</span>
                      <span>
                        To authenticate your account and provide customer
                        support.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 mt-1">✦</span>
                      <span>
                        To improve the safety and reliability of our AI models.
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Information Sharing
                  </h2>
                  <ul className="space-y-3 text-white/80">
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 mt-1">✦</span>
                      <span>
                        We do not sell your personal information to third-party
                        advertisers.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 mt-1">✦</span>
                      <span>
                        Your inputs may be processed by our third-party AI
                        service providers (e.g., for image generation,
                        text-to-speech) in an anonymized or non-identifiable
                        manner to generate your content.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 mt-1">✦</span>
                      <span>
                        We may share data if required by law or to protect the
                        safety and rights of our users or the public.
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Data Security
                  </h2>
                  <p className="text-white/80 leading-relaxed">
                    We implement industry-standard security measures, including
                    encryption and secure authentication, to protect your
                    personal information.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Data Protection
                  </h2>
                  <p className="text-white/80 leading-relaxed">
                    You have the right to access or request the deletion of your
                    personal data. Please contact us at{" "}
                    <a
                      href="mailto:rohitworks.ai@gmail.com"
                      className="text-purple-400 hover:text-purple-300"
                    >
                      rohitworks.ai@gmail.com
                    </a>{" "}
                    for such requests.
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

export default PrivacyPolicy;
