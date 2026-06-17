"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { BookOpen, Users, DownloadCloud, Activity, ArrowUpRight } from "lucide-react";
import { resources } from "@/data/resources";

const growthData = [
  { name: "Jan", total: 4000, new: 2400 },
  { name: "Feb", total: 5500, new: 1398 },
  { name: "Mar", total: 8000, new: 9800 },
  { name: "Apr", total: 12000, new: 3908 },
  { name: "May", total: 18000, new: 4800 },
  { name: "Jun", total: 24592, new: 3800 },
];

const categoryData = [
  { name: "Tech", value: 400 },
  { name: "Science", value: 300 },
  { name: "Business", value: 300 },
  { name: "AI", value: 200 },
];
// Updated Premium Apple Palette
const COLORS = ["#D4D4D8", "#6366F1", "#A1A1AA", "#71717A"];

const usageData = [
  { name: "Mon", reads: 4000 },
  { name: "Tue", reads: 3000 },
  { name: "Wed", reads: 2000 },
  { name: "Thu", reads: 2780 },
  { name: "Fri", reads: 1890 },
  { name: "Sat", reads: 2390 },
  { name: "Sun", reads: 3490 },
];

const StatCard = ({ title, value, icon: Icon, trend }: any) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass rounded-2xl p-6 border border-white/5 bg-white/[0.02]"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 rounded-lg bg-zinc-800 text-zinc-300">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex items-center gap-1 text-zinc-300 text-xs font-medium bg-white/10 px-2 py-1 rounded-full">
          <ArrowUpRight className="h-3 w-3" /> {trend}
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-medium text-zinc-100 mb-1 tracking-tight">{value}</h3>
        <p className="text-zinc-500 text-sm">{title}</p>
      </div>
    </motion.div>
  );
};

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl pt-28">
      <div className="mb-10 flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-medium text-zinc-100 tracking-tight">Overview</h1>
        <p className="text-zinc-400 font-light">Monitor library usage, growth, and user engagement.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Resources" value="24,592" icon={BookOpen} trend="+12.5%" />
        <StatCard title="Active Readers" value="8,304" icon={Users} trend="+5.2%" />
        <StatCard title="Monthly Downloads" value="142.3k" icon={DownloadCloud} trend="+18.1%" />
        <StatCard title="Avg. Read Time" value="45m" icon={Activity} trend="+2.4%" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Area Chart */}
        <div className="lg:col-span-2 glass border border-white/5 p-6 rounded-2xl">
          <h3 className="text-sm font-medium mb-6 text-zinc-400">Resource Growth</h3>
          <div className="h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={growthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050505', borderColor: '#27272A', color: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="total" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="glass border border-white/5 p-6 rounded-2xl flex flex-col">
          <h3 className="text-sm font-medium mb-2 text-zinc-400">Category Distribution</h3>
          <div className="flex-1 min-h-[300px] min-w-0 relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050505', borderColor: '#27272A', color: '#D4D4D8', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-2xl font-medium text-zinc-100">12</p>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Categories</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="lg:col-span-2 glass border border-white/5 p-6 rounded-2xl">
          <h3 className="text-sm font-medium mb-6 text-zinc-400">Weekly Reading Activity</h3>
          <div className="h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={usageData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050505', borderColor: '#27272A', color: '#D4D4D8', borderRadius: '8px' }}
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                />
                <Bar dataKey="reads" fill="#D4D4D8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="glass border border-white/5 p-6 rounded-2xl">
          <h3 className="text-sm font-medium mb-6 text-zinc-400">Recent Additions</h3>
          <div className="space-y-4">
            {resources.slice(0, 5).map((resource, i) => (
              <div key={resource.id} className="flex items-center gap-4 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                <div className="w-10 h-14 rounded overflow-hidden shrink-0 border border-white/10">
                  <img src={resource.coverImage} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">{resource.title}</p>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">{resource.author}</p>
                </div>
                <div className="text-xs text-indigo-400 font-medium shrink-0">
                  {i === 0 ? "Just now" : `${i * 2}h`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
