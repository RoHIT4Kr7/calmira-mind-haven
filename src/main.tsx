import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/context/AuthContext";

const clientId =
  (import.meta as any).env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

if (clientId === "YOUR_GOOGLE_CLIENT_ID") {
  console.warn(
    "VITE_GOOGLE_CLIENT_ID is not set. Google Sign-In will fail with 400/invalid_audience."
  );
}

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={clientId}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </GoogleOAuthProvider>
);
