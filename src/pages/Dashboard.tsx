import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroLeft from "@/components/dashboard/HeroLeft";
import HeroRight from "@/components/dashboard/HeroRight";
import ServicesSection from "@/components/dashboard/ServicesSection";
import RevealTextSection from "@/components/dashboard/RevealTextSection";
import "@/pages/page.css";


const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col dashboard-bg">
      {/* Navbar */}
      <Navbar />
      {/* Animated Reveal Text Section */}
      <RevealTextSection />

      <main className="pt-28 pb-16 px-4 md:px-8 flex-1">
        <div className="max-w-7xl mx-auto flex flex-col gap-20">
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <HeroLeft />
            <HeroRight />
          </div>

          {/* Services Section */}
          <ServicesSection />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
