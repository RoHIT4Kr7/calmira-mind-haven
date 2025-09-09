import React from "react";
import { useNavigate } from "react-router-dom";
import ServiceCard from "@/components/dashboard/ServiceCard";

const services = [
  {
    id: "manga",
    title: "Manga Creation",
    description: "Create personalized manga stories based on your mood and preferences",
    icon: "📚",
    path: "/mental-wellness",
    gradient: "from-primary-dark/20 to-primary-medium/20",
  },
  {
    id: "voice",
    title: "Voice Chat",
    description: "Have voice conversations with AI friends, therapists, or teachers",
    icon: "🎙️",
    path: "/voice",
    gradient: "from-primary-medium/20 to-primary-dark/20",
  },
  {
    id: "chat",
    title: "Chat",
    description: "Text-based conversations with AI companions",
    icon: "💬",
    path: "/services/chat",
    gradient: "from-accent/20 to-primary/20",
  },
];

const ServicesSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="services" className="mt-20" aria-label="Services section">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
        Choose Your Service
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc) => (
          <ServiceCard
            key={svc.id}
            {...svc}
            onClick={() => navigate(svc.path)}
          />
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
