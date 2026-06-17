import React from "react";
import { BookOpen, TrendingUp, Users, Library as LibraryIcon, Search } from "lucide-react";
import { resources } from "@/data/resources";

export function DashboardMock() {
  return (
    <div className="w-full h-full bg-[#050505] p-6 flex flex-col text-zinc-100 overflow-hidden font-sans rounded-2xl border border-white/5">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium tracking-tight">Overview</h3>
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-9 pr-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs focus:outline-none w-48 text-zinc-300 placeholder:text-zinc-600 transition-colors"
            readOnly
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col gap-2">
          <div className="flex items-center gap-2 text-zinc-400">
            <BookOpen className="h-4 w-4" />
            <span className="text-xs font-medium">Resources</span>
          </div>
          <p className="text-2xl font-semibold">24,592</p>
        </div>
        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col gap-2">
          <div className="flex items-center gap-2 text-zinc-400">
            <Users className="h-4 w-4" />
            <span className="text-xs font-medium">Active</span>
          </div>
          <p className="text-2xl font-semibold">8,304</p>
        </div>
      </div>

      <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden flex flex-col min-h-0">
        <div className="p-3 border-b border-white/5">
          <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Recent Activity</h4>
        </div>
        <div className="divide-y divide-white/5 overflow-y-auto">
          {resources.slice(0, 3).map((resource) => (
            <div key={resource.id} className="p-3 flex items-center justify-between hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded bg-zinc-800 shrink-0 border border-white/10 flex items-center justify-center overflow-hidden">
                  <img src={resource.coverImage} alt="" className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm text-zinc-200 truncate">{resource.title}</p>
                  <p className="text-[10px] text-zinc-500 truncate">{resource.author}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
