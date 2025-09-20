import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LightServiceNavigation from "@/components/navigation/LightServiceNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Settings,
  Heart,
  BarChart3,
  Calendar,
  Bell,
  TrendingUp,
  Activity,
  Target,
} from "lucide-react";
import { SigninGradientBackground } from "@/components/ui/signin-gradient-background";
import { useAuth } from "@/context/AuthContext";
import { api, authHeader } from "@/lib/api";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";

const Profile: React.FC = () => {
  const { token, user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!token) return;
      try {
        const res = await api.get("/dashboard/stats", {
          headers: { ...authHeader(token) },
        });
        setAnalytics(res.data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [token]);

  return (
    <SigninGradientBackground>
      <div className="min-h-screen flex">
        <LightServiceNavigation />

        <main className="flex-1 ml-0 lg:ml-64 px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-white/20">
                <AvatarImage
                  src={user?.picture}
                  alt="User"
                  onError={() =>
                    console.error(
                      "Failed to load profile picture:",
                      user?.picture
                    )
                  }
                />
                <AvatarFallback className="bg-white/10 backdrop-blur-lg text-white text-4xl">
                  {user?.name?.charAt(0)?.toUpperCase() ||
                    user?.email?.charAt(0)?.toUpperCase() || (
                      <User className="h-16 w-16" />
                    )}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 mb-4">
                {user?.name || "Your Profile"}
              </h1>
              <p className="text-white/70 text-lg">
                Manage your wellness journey and track your progress
              </p>
            </motion.div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Consistency Streak */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                      <Activity className="h-5 w-5 text-white" />
                      <span>Consistency Streak</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-white mb-2">
                      {analytics?.consistency_streak_days ?? 0} days
                    </p>
                    <p className="text-white/60 text-sm">
                      Keep up the great work!
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Mood Improvement */}
              <motion.div
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                      <TrendingUp className="h-5 w-5 text-white" />
                      <span>Mood Improvement</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-white mb-2">
                      {analytics?.mood_improvement_pct ?? 0}%
                    </p>
                    <p className="text-white/60 text-sm">Progress this month</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Total Sessions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                      <Target className="h-5 w-5 text-white" />
                      <span>Total Creations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-white mb-2">
                      {analytics?.recent_creations?.length ?? 0}
                    </p>
                    <p className="text-white/60 text-sm">
                      Stories & meditations
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Mood Trend Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                    Mood Trend Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics?.mood_trend_30d || []}>
                      <XAxis dataKey="date" hide />
                      <YAxis
                        domain={[1, 5]}
                        ticks={[1, 2, 3, 4, 5]}
                        tick={{ fill: "white" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "8px",
                          backdropFilter: "blur(10px)",
                          color: "white",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="mood"
                        stroke="#ffffff"
                        strokeWidth={3}
                        dot={{ fill: "#ffffff", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Profile Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Settings */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                      <Settings className="h-5 w-5 text-white" />
                      <span>Account Settings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Notification Settings
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Wellness Goals
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile Settings
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                      <Calendar className="h-5 w-5 text-white" />
                      <span>Recent Creations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {analytics?.recent_creations
                      ?.slice(0, 3)
                      .map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <span className="text-sm text-white/80">
                            {item.type === "meditation"
                              ? "🧘 Meditation session"
                              : "📚 Manga story"}
                            : {item.title || "Untitled"}
                          </span>
                        </div>
                      )) || (
                      <p className="text-white/60 text-sm">
                        No recent activity
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </SigninGradientBackground>
  );
};

export default Profile;
