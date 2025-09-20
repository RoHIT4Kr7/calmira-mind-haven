import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SignInCard from "@/components/ui/sign-in-card-2";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from?.pathname || "/";

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const cred = credentialResponse?.credential;
    if (!cred) return;
    try {
      await login(cred);
      navigate(from, { replace: true });
    } catch (e) {
      console.error("Login error", e);
      const msg = e instanceof Error ? e.message : "Login failed.";
      alert(msg);
    }
  };

  const handleGoogleError = () => {
    alert("Google Sign-In failed. Check your Client ID and allowed origins.");
  };

  return (
    <div className="relative">
      <SignInCard
        onGoogleSuccess={handleGoogleSuccess}
        onGoogleError={handleGoogleError}
        useOneTap
      />
    </div>
  );
};

export default LoginPage;
