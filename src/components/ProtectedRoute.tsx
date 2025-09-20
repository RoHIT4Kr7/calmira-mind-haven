import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LightRays from "./LightRays";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();

  // While auth is initializing (restoring token/profile), don't redirect
  if (initializing) {
    return null; // or a tiny splash; routes behind this guard will render once ready
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background light rays layer */}
      <div className="absolute inset-0 z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#00ffff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="w-full h-full"
        />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;
