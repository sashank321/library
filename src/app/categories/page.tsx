"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, FlaskConical, Briefcase, Calculator, Landmark, BrainCircuit, Code2, Palette, Database, BookOpen, Sparkles, Terminal } from "lucide-react";
import Link from "next/link";
import { useLibraryStore } from "@/store/useLibraryStore";

const categories = [
  { name: "Technology", icon: Cpu, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { name: "Science", icon: FlaskConical, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
  { name: "Business", icon: Briefcase, color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  { name: "Mathematics", icon: Calculator, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
  { name: "History", icon: Landmark, color: "text-amber-700", bg: "bg-amber-700/10", border: "border-amber-700/20" },
  { name: "Artificial Intelligence", icon: BrainCircuit, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { name: "Programming", icon: Code2, color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  { name: "Design", icon: Palette, color: "text-pink-500", bg: "bg-pink-500/10", border: "border-pink-500/20" },
  { name: "Data Science", icon: Database, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  { name: "Literature", icon: BookOpen, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { name: "Self-Help", icon: Sparkles, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { name: "Computer Science", icon: Terminal, color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20" },
];

export default function CategoriesPage() {
  const setActiveCategory = useLibraryStore((state) => state.setActiveCategory);

  return (
    <div className="container mx-auto px-4 pt-28 pb-16 max-w-7xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">Browse by Category</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explore our vast collection organized by domain. Discover the knowledge you need in beautifully curated collections.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Link 
              href="/resources"
              onClick={() => setActiveCategory(cat.name)}
              className="block group h-full"
            >
              <motion.div
                whileHover={{ y: -10, rotateX: 10, rotateY: 5 }}
                style={{ perspective: 1000 }}
                className={`h-full p-8 rounded-3xl border ${cat.border} bg-white/5 backdrop-blur-xl transition-all duration-300 group-hover:bg-white/10 relative overflow-hidden`}
              >
                {/* Glow Effect */}
                <div className={`absolute -inset-10 opacity-0 group-hover:opacity-20 transition-opacity blur-2xl rounded-full ${cat.bg}`} />
                
                <div className="relative z-10 flex flex-col items-center text-center h-full justify-center">
                  <div className={`p-4 rounded-2xl ${cat.bg} ${cat.color} mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12`}>
                    <cat.icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground group-hover:text-white/80 transition-colors">
                    Explore collection &rarr;
                  </p>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
