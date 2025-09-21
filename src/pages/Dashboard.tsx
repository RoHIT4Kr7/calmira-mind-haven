import React, { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/Footer";
import { Tilt } from "@/components/ui/tilt";
import { SigninGradientBackground } from "@/components/ui/signin-gradient-background";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { api, authHeader } from "@/lib/api";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useNavigate } from "react-router-dom";

type MoodDataPoint = {
  date: string;
  mood: number | null;
  color: string;
  count: number;
  sources: string[];
  mood_details: Array<{
    score: number;
    source: string;
    color: string;
    time: string;
    mood_text?: string;
  }>;
};

type DashboardStats = {
  consistency_streak_days: number;
  mood_improvement_pct: number | null;
  mood_trend_30d: Array<MoodDataPoint>;
  recent_creations: Array<
    | {
        type: "manga";
        title?: string | null;
        story_id?: string | null;
        thumbnail?: string | null;
        created_at?: string | null;
      }
    | {
        type: "meditation";
        title?: string | null;
        meditation_id?: string | null;
        thumbnail?: string | null;
        created_at?: string | null;
      }
    | {
        type: "voice";
        title?: string | null;
        session_id?: string | null;
        thumbnail?: string | null;
        created_at?: string | null;
      }
  >;
};

const Dashboard: React.FC = () => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mood, setMood] = useState<number>(0);
  const [journal, setJournal] = useState("");
  const [dailyQuote, setDailyQuote] = useState<string>("");
  const [showQuote, setShowQuote] = useState(false);
  const navigate = useNavigate();

  // Custom tooltip for mood data
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as MoodDataPoint;
      if (!data.mood) return null;

      const moodEmojis = {
        1: "😞",
        2: "🙁",
        3: "😐",
        4: "🙂",
        5: "😄",
      };

      const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      };

      return (
        <div className="bg-black/80 backdrop-blur-lg border border-white/20 rounded-lg p-3 text-white text-sm">
          <p className="font-medium">{formatDate(data.date)}</p>
          <p className="flex items-center gap-2">
            <span className="text-lg">
              {moodEmojis[Math.round(data.mood) as keyof typeof moodEmojis]}
            </span>
            Mood: {data.mood.toFixed(1)}/5
          </p>
          <p className="text-xs text-white/70">
            {data.count} entries from {data.sources.join(", ")}
          </p>
          {data.mood_details.length > 0 && (
            <div className="mt-2 space-y-1">
              {data.mood_details.slice(0, 3).map((detail, idx) => (
                <div key={idx} className="text-xs flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: detail.color }}
                  ></div>
                  <span className="capitalize">{detail.source}</span>
                  {detail.mood_text && (
                    <span className="text-white/60">({detail.mood_text})</span>
                  )}
                </div>
              ))}
              {data.mood_details.length > 3 && (
                <p className="text-xs text-white/60">
                  +{data.mood_details.length - 3} more
                </p>
              )}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom dot renderer for the line chart
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!payload.mood) return null;

    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={payload.color || "#ffffff"}
        stroke="#ffffff"
        strokeWidth={2}
        className="hover:r-8 transition-all cursor-pointer"
        style={{
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
        }}
      />
    );
  };

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/dashboard/stats`, {
          headers: { ...authHeader(token) },
        });
        setStats(res.data);
      } catch (e: any) {
        setError(
          e?.response?.data?.detail || e?.message || "Failed to load stats"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  const moodOptions = useMemo(
    () => [
      { value: 1, label: "😞" },
      { value: 2, label: "🙁" },
      { value: 3, label: "😐" },
      { value: 4, label: "🙂" },
      { value: 5, label: "😄" },
    ],
    []
  );

  const motivationalQuotes = useMemo(
    () => ({
      1: [
        // 😞 - Very sad
        "Every storm runs out of rain. This difficult moment will pass.",
        "You are stronger than you think and more resilient than you know.",
        "It's okay to not be okay. Healing takes time, and that's perfectly normal.",
        "Your current situation is not your final destination. Better days are coming.",
        "Even the darkest night will end and the sun will rise again.",
      ],
      2: [
        // 🙁 - Sad
        "Small steps forward are still progress. You're doing better than you think.",
        "It's okay to have difficult days. Tomorrow is a new opportunity.",
        "Your feelings are valid, and it's brave of you to acknowledge them.",
        "This too shall pass. You've overcome challenges before, and you will again.",
        "Be gentle with yourself today. You deserve kindness, especially from yourself.",
      ],
      3: [
        // 😐 - Neutral
        "Neutral days are okay too. Not every day needs to be extraordinary.",
        "Sometimes the best thing you can do is simply show up. You're here, and that matters.",
        "Balance is found in the quiet moments. Take time to appreciate the calm.",
        "Today is a blank canvas. What small positive thing will you add to it?",
        "Steady progress beats dramatic highs and lows. You're on the right path.",
      ],
      4: [
        // 🙂 - Happy
        "Your positive energy is contagious. Keep spreading those good vibes!",
        "Happiness looks good on you. Embrace this wonderful feeling.",
        "You're creating beautiful moments today. Keep building on this joy.",
        "Your smile can light up someone else's day. Share that beautiful energy.",
        "Good days remind us that life is full of possibilities. Keep shining!",
      ],
      5: [
        // 😄 - Very happy
        "Your joy is infectious! You're radiating pure happiness today.",
        "This is what living feels like! Soak up every moment of this beautiful day.",
        "You're absolutely glowing with happiness. The world is brighter because of your energy.",
        "Amazing days like this remind us how wonderful life can be. Celebrate yourself!",
        "Your enthusiasm is inspiring! Keep this incredible energy flowing.",
      ],
    }),
    []
  );

  const getDailyQuote = (moodValue: number) => {
    const today = new Date().toDateString();
    const savedQuote = localStorage.getItem(`dailyQuote_${today}`);
    const savedMood = localStorage.getItem(`dailyMood_${today}`);

    if (savedQuote && savedMood === moodValue.toString()) {
      return savedQuote;
    }

    const quotes =
      motivationalQuotes[moodValue as keyof typeof motivationalQuotes];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    localStorage.setItem(`dailyQuote_${today}`, randomQuote);
    localStorage.setItem(`dailyMood_${today}`, moodValue.toString());

    return randomQuote;
  };

  const submitCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood) return alert("Please select a mood rating");
    try {
      await api.post(
        `/dhyaan/checkin`,
        { mood_score: mood, journal_entry: journal },
        {
          headers: { "Content-Type": "application/json", ...authHeader(token) },
        }
      );

      // Get and show motivational quote
      const quote = getDailyQuote(mood);
      setDailyQuote(quote);
      setShowQuote(true);

      setJournal("");
      setMood(0);

      // Refresh stats after checkin
      const res = await api.get(`/dashboard/stats`, {
        headers: { ...authHeader(token) },
      });
      setStats(res.data);
    } catch (e: any) {
      alert(
        e?.response?.data?.detail || e?.message || "Failed to submit check-in"
      );
    }
  };

  return (
    <SigninGradientBackground>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="pt-24 pb-16 px-4 md:px-8 flex-1">
          <div className="max-w-7xl mx-auto space-y-10">
            {/* Greeting */}
            <div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 mb-4">
                Welcome back{user?.name ? `, ${user.name}` : ""} 👋
              </h1>
              <p className="text-white/70 text-lg">
                Here's your wellness snapshot.
              </p>
            </div>

            {loading && (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardContent className="p-4 text-sm text-white/80">
                  Loading your dashboard stats…
                </CardContent>
              </Card>
            )}

            {error && (
              <Card className="border-red-400/50 bg-red-500/20 backdrop-blur-lg">
                <CardContent className="p-4 text-sm text-red-200">
                  {error}
                </CardContent>
              </Card>
            )}

            {/* Mood Check-in */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                    How are you feeling today?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={submitCheckin} className="space-y-6">
                    <div className="flex gap-3 items-center flex-wrap">
                      {moodOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setMood(opt.value)}
                          className={`text-3xl p-3 rounded-xl border-2 transition-all duration-300 ${
                            mood === opt.value
                              ? "bg-white/20 border-white/60 scale-110 shadow-lg"
                              : "border-white/20 hover:border-white/40 hover:bg-white/10"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <Textarea
                      placeholder="Optional journal entry..."
                      value={journal}
                      onChange={(e) => setJournal(e.target.value)}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                    />
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-purple-800 to-purple-900 hover:from-purple-900 hover:to-black text-white px-8 py-2 text-sm"
                    >
                      Submit
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Motivational Quote Panel */}
              <div className="hidden lg:block">
                {showQuote && dailyQuote && (
                  <Card className="bg-white/5 backdrop-blur-lg border-white/10 h-full">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                        Your Daily Motivation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="text-4xl mb-4">✨</div>
                        <p className="text-white/80 text-lg leading-relaxed italic">
                          "{dailyQuote}"
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                    Consistency Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-white">
                    {stats?.consistency_streak_days ?? "—"} days
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                    Mood Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-white">
                    {stats?.mood_improvement_pct !== null &&
                    stats?.mood_improvement_pct !== undefined
                      ? `${stats.mood_improvement_pct > 0 ? "+" : ""}${
                          stats.mood_improvement_pct
                        }%`
                      : "—%"}
                  </p>
                  {stats?.mood_improvement_pct !== null &&
                    stats?.mood_improvement_pct !== undefined && (
                      <p className="text-sm text-white/70 mt-2">
                        {stats.mood_improvement_pct > 0
                          ? "📈 Mood is improving!"
                          : stats.mood_improvement_pct < 0
                          ? "📉 Let's work on boosting your mood"
                          : "😐 Mood is stable"}
                      </p>
                    )}
                </CardContent>
              </Card>
            </div>

            {/* Mood Trend Chart */}
            <Card className="bg-white/5 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                  Last 30 days mood trend
                </CardTitle>
              </CardHeader>
              <CardContent style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats?.mood_trend_30d || []}>
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "white", fontSize: 12 }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      domain={[1, 5]}
                      ticks={[1, 2, 3, 4, 5]}
                      tick={{ fill: "white", fontSize: 12 }}
                      tickFormatter={(value) => {
                        const emojis = {
                          1: "😞",
                          2: "🙁",
                          3: "😐",
                          4: "🙂",
                          5: "😄",
                        };
                        return (
                          emojis[value as keyof typeof emojis] ||
                          value.toString()
                        );
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="url(#moodGradient)"
                      strokeWidth={3}
                      dot={<CustomDot />}
                      connectNulls={false}
                    />
                    <defs>
                      <linearGradient
                        id="moodGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop
                          offset="0%"
                          style={{ stopColor: "#ef4444", stopOpacity: 1 }}
                        />
                        <stop
                          offset="25%"
                          style={{ stopColor: "#f97316", stopOpacity: 1 }}
                        />
                        <stop
                          offset="50%"
                          style={{ stopColor: "#eab308", stopOpacity: 1 }}
                        />
                        <stop
                          offset="75%"
                          style={{ stopColor: "#22c55e", stopOpacity: 1 }}
                        />
                        <stop
                          offset="100%"
                          style={{ stopColor: "#8b5cf6", stopOpacity: 1 }}
                        />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>

                {/* Mood Source Legend */}
                <div className="mt-4 flex flex-wrap gap-4 justify-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-white/70">Daily Check-in</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                    <span className="text-white/70">Manga Creation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-white/70">Meditation Session</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services Section */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 mb-8 text-center">
                Your Wellness Services
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Manga Service */}
                <Tilt
                  rotationFactor={8}
                  springOptions={{
                    stiffness: 26.7,
                    damping: 4.1,
                    mass: 0.2,
                  }}
                  className="cursor-pointer"
                >
                  <Card
                    className="overflow-hidden hover:shadow-2xl transition-all duration-300 h-full cursor-pointer bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 hover:scale-105"
                    onClick={() => navigate("/services/manga")}
                  >
                    <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center overflow-hidden">
                      <img
                        src="/images/mangaimage.jpg"
                        alt="Manga Stories"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-xl mb-3 text-white">
                        Manga Stories
                      </h3>
                      <p className="text-white/80 text-sm leading-relaxed">
                        Generate personalized manga stories for emotional
                        healing and growth
                      </p>
                    </CardContent>
                  </Card>
                </Tilt>

                {/* Voice Chat Service */}
                <Tilt
                  rotationFactor={8}
                  springOptions={{
                    stiffness: 26.7,
                    damping: 4.1,
                    mass: 0.2,
                  }}
                  className="cursor-pointer"
                >
                  <Card
                    className="overflow-hidden hover:shadow-2xl transition-all duration-300 h-full cursor-pointer bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 hover:scale-105"
                    onClick={() => navigate("/services/voice")}
                  >
                    <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center overflow-hidden">
                      <img
                        src="/images/voiceagent.png"
                        alt="Voice Chat"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-xl mb-3 text-white">
                        Voice Chat
                      </h3>
                      <p className="text-white/80 text-sm leading-relaxed">
                        Talk with an AI companion for emotional support and
                        guidance
                      </p>
                    </CardContent>
                  </Card>
                </Tilt>

                {/* Meditation Service */}
                <Tilt
                  rotationFactor={8}
                  springOptions={{
                    stiffness: 26.7,
                    damping: 4.1,
                    mass: 0.2,
                  }}
                  className="cursor-pointer"
                >
                  <Card
                    className="overflow-hidden hover:shadow-2xl transition-all duration-300 h-full cursor-pointer bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 hover:scale-105"
                    onClick={() => navigate("/services/meditation")}
                  >
                    <div className="w-full h-48 bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center overflow-hidden">
                      <img
                        src="/images/meditate.jpg"
                        alt="Meditation"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-xl mb-3 text-white">
                        DhyaanAI
                      </h3>
                      <p className="text-white/80 text-sm leading-relaxed">
                        Guided meditation sessions for mindfulness and stress
                        relief
                      </p>
                    </CardContent>
                  </Card>
                </Tilt>
              </div>
            </div>

            {/* Recent Creations */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 mb-8 text-center">
                Recent Creations
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {(stats?.recent_creations || [])
                  .slice(0, 3)
                  .map((item, idx) => (
                    <Card
                      key={idx}
                      className="overflow-hidden cursor-pointer bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300"
                      onClick={() =>
                        navigate(
                          item.type === "meditation"
                            ? "/services/meditation"
                            : item.type === "voice"
                            ? "/services/voice"
                            : "/services/manga"
                        )
                      }
                    >
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.title || "Creation"}
                          className="w-full h-40 object-cover"
                        />
                      ) : item.type === "meditation" ? (
                        <img
                          src="/images/dhyaan-default.jpg"
                          alt="Meditation thumbnail"
                          className="w-full h-40 object-cover"
                        />
                      ) : item.type === "voice" ? (
                        <img
                          src="/images/gifvoice.gif"
                          alt="Voice chat thumbnail"
                          className="w-full h-40 object-cover"
                        />
                      ) : (
                        <div className="w-full h-40 bg-white/5 flex items-center justify-center text-white/60">
                          No thumbnail
                        </div>
                      )}
                      <CardContent className="p-4">
                        <p className="text-white text-sm">
                          {item.title || "View creation"}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </SigninGradientBackground>
  );
};

export default Dashboard;
