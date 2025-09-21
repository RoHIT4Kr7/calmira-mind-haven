import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "@/lib/api";

type DecodedToken = {
  sub?: string;
  email?: string;
  name?: string;
  picture?: string;
  exp?: number; // seconds since epoch
  [key: string]: any;
};

export type UserProfile = {
  id?: string;
  email?: string;
  name?: string;
  picture?: string;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  token: string | null;
  user: UserProfile | null;
  initializing: boolean;
  login: (googleCredential: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "calmira.jwt";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Read and validate stored token synchronously on first render to prevent redirect flicker
  const [token, setToken] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      const decoded = jwtDecode<DecodedToken>(stored);
      if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return stored;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  });

  const [user, setUser] = useState<UserProfile | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);

  // Fetch user profile from backend
  const fetchUserProfile = useCallback(async (authToken: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const userData = await res.json();
        console.log("User data from backend:", userData);
        setUser({
          id: userData.id?.toString(),
          email: userData.email,
          name: userData.full_name,
          picture: userData.profile_picture_url,
        });
        console.log("Set user picture:", userData.profile_picture_url);
      }
    } catch (e) {
      console.error("Failed to fetch user profile", e);
      // If fetching profile fails, try to get user info from token
      try {
        const decoded = jwtDecode<DecodedToken>(authToken);
        setUser({
          id: decoded.sub,
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture,
        });
      } catch {
        console.error("Token decode failed during profile fallback");
      }
    }
  }, []);

  // On mount or when token changes: fetch profile if token present; conclude initialization.
  useEffect(() => {
    const init = async () => {
      if (token) {
        try {
          await fetchUserProfile(token);
        } catch (error) {
          console.error("Failed to fetch profile during init:", error);
        }
      }
      setInitializing(false);
    };
    init();
  }, [token, fetchUserProfile]);

  const login = useCallback(
    async (googleCredential: string) => {
      console.log("🔐 Attempting login with backend:", API_BASE_URL);

      try {
        const res = await fetch(`${API_BASE_URL}/auth/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include", // Include cookies for CORS
          body: JSON.stringify({ credential: googleCredential }),
        });

        console.log("🔐 Login response status:", res.status);

        if (!res.ok) {
          let detail = "";
          try {
            detail = await res.text();
            console.error("🚨 Login error response:", detail);
          } catch (textError) {
            console.error("🚨 Could not read error response:", textError);
            detail = `HTTP ${res.status} ${res.statusText}`;
          }
          throw new Error(`Login failed: ${detail}`);
        }

        const data = await res.json();
        console.log("🔐 Login successful, response:", data);

        // Expect backend to return { token: "...", user: {...} }
        const appToken: string | undefined =
          data?.token || data?.access_token || data?.jwt;
        if (!appToken) {
          throw new Error("No token returned from backend");
        }
        localStorage.setItem(STORAGE_KEY, appToken);
        setToken(appToken);

        // Set user data from response or fetch from /auth/me
        if (data?.user) {
          console.log("Login user data:", data.user);
          setUser({
            id: data.user.id?.toString(),
            email: data.user.email,
            name: data.user.full_name,
            picture: data.user.profile_picture_url,
          });
          console.log(
            "Set user picture from login:",
            data.user.profile_picture_url
          );
        } else {
          fetchUserProfile(appToken);
        }
      } catch (error) {
        console.error("🚨 Login error:", error);
        throw error;
      }
    },
    [fetchUserProfile]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(token),
      token,
      user,
      initializing,
      login,
      logout,
    }),
    [login, logout, token, user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
