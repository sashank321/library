"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, BookOpen, Clock, Award, Star, Settings, LogOut, Flame, Target, Zap, X } from "lucide-react";
import { resources } from "@/data/resources";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const router = useRouter();
  const [profileName, setProfileName] = useState("John Doe");
  const [profileRole, setProfileRole] = useState("Senior Researcher");
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(profileName);
  const [tempRole, setTempRole] = useState(profileRole);
  const [progressValues, setProgressValues] = useState<number[]>([]);

  useEffect(() => {
    setProgressValues(resources.slice(2, 6).map(() => Math.floor(Math.random() * 100)));
  }, []);

  const handleOpenSettings = () => {
    setTempName(profileName);
    setTempRole(profileRole);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileName(tempName);
    setProfileRole(tempRole);
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      alert("Successfully logged out.");
      router.push("/");
    }
  };

  return (
    <div className="container mx-auto px-4 pt-28 pb-12 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card & Actions */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-3xl flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/40 to-purple-500/20" />
            
            <Avatar className="h-32 w-32 border-4 border-background shadow-2xl mb-4 relative z-10">
              <AvatarImage src="https://github.com/shadcn.png" alt="@johndoe" />
              <AvatarFallback className="text-4xl">JD</AvatarFallback>
            </Avatar>
            
            <h2 className="text-2xl font-bold text-white relative z-10">{profileName}</h2>
            <p className="text-muted-foreground relative z-10 mb-6">{profileRole}</p>
            
            <div className="flex gap-4 w-full relative z-10">
              <Button 
                onClick={handleOpenSettings}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white" 
                variant="outline"
              >
                <Settings className="h-4 w-4 mr-2" /> Settings
              </Button>
              <Button 
                onClick={handleLogout}
                className="flex-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20" 
                variant="outline"
              >
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-white">
              <Target className="h-5 w-5 text-primary" /> Monthly Goal
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Books Read</span>
                <span className="font-medium text-white">8 / 10</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[80%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stats & Activity */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass p-4 rounded-2xl flex flex-col items-center justify-center text-center">
              <BookOpen className="h-8 w-8 text-blue-500 mb-2" />
              <h4 className="text-2xl font-bold text-white">124</h4>
              <p className="text-xs text-muted-foreground">Resources Read</p>
            </div>
            <div className="glass p-4 rounded-2xl flex flex-col items-center justify-center text-center">
              <Clock className="h-8 w-8 text-purple-500 mb-2" />
              <h4 className="text-2xl font-bold text-white">340h</h4>
              <p className="text-xs text-muted-foreground">Total Read Time</p>
            </div>
            <div className="glass p-4 rounded-2xl flex flex-col items-center justify-center text-center">
              <Flame className="h-8 w-8 text-orange-500 mb-2" />
              <h4 className="text-2xl font-bold text-white">14</h4>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div className="glass p-4 rounded-2xl flex flex-col items-center justify-center text-center">
              <Star className="h-8 w-8 text-yellow-500 mb-2" />
              <h4 className="text-2xl font-bold text-white">42</h4>
              <p className="text-xs text-muted-foreground">Reviews Written</p>
            </div>
          </div>

          {/* Achievements & Badges */}
          <div className="glass p-6 rounded-3xl">
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2 text-white">
              <Award className="h-5 w-5 text-yellow-500" /> Badges & Achievements
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {[
                { name: "Speed Reader", icon: Zap, color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
                { name: "Scholar", icon: BookOpen, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
                { name: "Consistent", icon: Flame, color: "text-orange-500 bg-orange-500/10 border-orange-500/20" },
                { name: "Top Critic", icon: Star, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
              ].map((badge) => (
                <div key={badge.name} className={`flex flex-col items-center justify-center min-w-[100px] p-4 rounded-2xl border ${badge.color}`}>
                   <badge.icon className="h-8 w-8 mb-2" />
                  <span className="text-xs font-medium text-center">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Viewed */}
          <div className="glass p-6 rounded-3xl">
            <h3 className="font-semibold text-lg mb-6 text-white">Recently Viewed</h3>
            <div className="space-y-4">
              {resources.slice(2, 6).map((resource, idx) => (
                <div key={resource.id} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/10">
                  <div className="w-16 h-20 rounded shadow overflow-hidden shrink-0">
                    <img src={resource.coverImage} alt={resource.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col justify-center flex-1">
                    <h4 className="font-semibold text-white group-hover:text-primary transition-colors line-clamp-1">{resource.title}</h4>
                    <p className="text-sm text-muted-foreground">{resource.author}</p>
                    <div className="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full" 
                        style={{ width: `${progressValues[idx] || 0}%` }} 
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-end shrink-0">
                    <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded">Continue</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Settings Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-zinc-950 border border-white/10 p-6 rounded-2xl shadow-2xl z-10 glass mx-4"
            >
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
                <h3 className="font-semibold text-white text-lg">Edit Profile</h3>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-medium">Display Name</label>
                  <input 
                    type="text" 
                    required
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-medium">Role / Title</label>
                  <input 
                    type="text" 
                    required
                    value={tempRole}
                    onChange={(e) => setTempRole(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    className="border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white">
                    Save Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
