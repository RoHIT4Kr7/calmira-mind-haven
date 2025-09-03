import React from 'react';
import { motion } from 'framer-motion';
import LightServiceNavigation from '@/components/navigation/LightServiceNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Settings, Heart, BarChart3, Calendar, Bell } from 'lucide-react';

const Profile: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-soft to-background flex">
      <LightServiceNavigation currentPage="Profile" />
      
      <main className="flex-1 ml-0 lg:ml-64 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src="/images/user-avatar.png" alt="User" />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary-dark text-white text-2xl">
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <h1 className="text-3xl poppins-bold text-foreground mb-2">Your Profile</h1>
            <p className="text-muted-foreground inter-regular">Manage your mental wellness journey</p>
          </motion.div>

          {/* Profile Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Wellness Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="bg-white/95 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300 rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 poppins-semibold">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <span>Wellness Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground inter-regular">Sessions completed</span>
                    <span className="inter-semibold text-foreground">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground inter-regular">Days active</span>
                    <span className="inter-semibold text-foreground">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground inter-regular">Mood improvement</span>
                    <span className="inter-semibold text-green-500">+15%</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-white/95 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300 rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 poppins-semibold">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm text-muted-foreground inter-regular">Completed manga session</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm text-muted-foreground inter-regular">Voice chat with therapist</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm text-muted-foreground inter-regular">Updated mood tracking</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Preferences */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-white/95 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300 rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 poppins-semibold">
                    <Settings className="h-5 w-5 text-primary" />
                    <span>Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-xl inter-regular">
                    <Bell className="h-4 w-4 mr-2" />
                    Notification Settings
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-xl inter-regular">
                    <Heart className="h-4 w-4 mr-2" />
                    Wellness Goals
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-xl inter-regular">
                    <User className="h-4 w-4 mr-2" />
                    Account Settings
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Coming Soon */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-primary/10 to-primary-medium/10 border border-primary/20 hover:shadow-lg transition-all duration-300 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-primary poppins-semibold">Coming Soon</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground inter-regular">
                    More profile features are being developed:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 inter-regular">
                    <li>• Detailed mood analytics</li>
                    <li>• Progress tracking charts</li>
                    <li>• Personalized recommendations</li>
                    <li>• Social sharing features</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;