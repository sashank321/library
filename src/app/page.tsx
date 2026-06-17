"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Spline from "@splinetool/react-spline";
import { ArrowRight, BookOpen, Users, FileText, Database, Bot, Search, PlayCircle, User } from "lucide-react";
import Link from "next/link";
import { DashboardMock } from "@/components/dashboard/DashboardMock";
import { HeroBackground } from "@/components/home/HeroBackground";
import { MagneticButton } from "@/components/home/MagneticButton";

const words = ["Knowledge", "Research", "Innovation", "Learning", "Discovery"];

const FloatingCard = ({ delay, icon: Icon, value, label, className }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`absolute glass p-5 rounded-2xl hidden md:flex flex-col items-start gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.3)] ${className}`}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-zinc-400" />
        <span className="text-2xl font-semibold tracking-tight text-zinc-100">{value}</span>
      </div>
      <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</span>
    </motion.div>
  );
};

export default function Home() {
  const [index, setIndex] = useState(0);
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 300]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center w-full bg-[#000000]">
      
      {/* SECTION 1: Cinematic Hero */}
      <section className="w-full h-screen relative flex flex-col items-center justify-center overflow-hidden">
        <HeroBackground />
        
        <div className="z-10 text-center max-w-5xl mx-auto flex flex-col items-center px-4">

          <h1 className="text-5xl md:text-8xl font-medium tracking-tighter mb-6 text-zinc-100 leading-tight">
            Explore the World's Most <br className="hidden md:block" />
            Intelligent Digital{" "}
            <div className="block w-full align-bottom relative h-[1.3em] overflow-hidden mt-2 md:mt-4">
              <AnimatePresence mode="wait">
                <motion.span
                  key={index}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -60, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-0 right-0 text-center text-gradient-gold pb-2"
                >
                  {words[index]}
                </motion.span>
              </AnimatePresence>
            </div>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl font-light">
            A premium sanctuary for modern learners. Seamlessly discover, organize, and immerse yourself in thousands of curated resources.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link href="/resources">
              <MagneticButton className="bg-zinc-100 text-zinc-900 hover:bg-white border-transparent">
                Browse Resources <ArrowRight className="h-4 w-4" />
              </MagneticButton>
            </Link>
            <Link href="/dashboard">
              <MagneticButton>
                View Dashboard
              </MagneticButton>
            </Link>
          </div>
        </div>

        {/* Floating Metrics */}
        <FloatingCard delay={0.2} icon={BookOpen} value="50,000+" label="Curated Books" className="top-1/4 left-[10%]" />
        <FloatingCard delay={0.4} icon={Users} value="120,000" label="Active Readers" className="bottom-1/4 left-[15%]" />
        <FloatingCard delay={0.3} icon={FileText} value="25,000" label="Research Papers" className="top-1/3 right-[10%]" />
        <FloatingCard delay={0.5} icon={Database} value="500+" label="Collections" className="bottom-[20%] right-[15%]" />
      </section>

      {/* TRUST SECTION */}
      <section className="w-full py-16 border-y border-white/5 bg-[#050505] overflow-hidden">
        <div className="container mx-auto px-4 mb-8 text-center">
          <p className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Trusted by innovative teams worldwide</p>
        </div>
        <div className="flex space-x-12 animate-[marquee_30s_linear_infinite] whitespace-nowrap opacity-50">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex space-x-16 items-center">
              <span className="text-2xl font-bold text-zinc-600">Stanford</span>
              <span className="text-2xl font-bold text-zinc-600">MIT</span>
              <span className="text-2xl font-bold text-zinc-600">Harvard</span>
              <span className="text-2xl font-bold text-zinc-600">Oxford</span>
              <span className="text-2xl font-bold text-zinc-600">Cambridge</span>
              <span className="text-2xl font-bold text-zinc-600">Berkeley</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: 3D Spline Upgrade */}
      <section className="w-full py-32 px-4 md:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative">
        <div className="w-full lg:w-[40%] z-10">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 text-zinc-100">
            Immersive Digital Knowledge
          </h2>
          <p className="text-lg text-zinc-400 mb-8 font-light leading-relaxed">
            Experience literature and research in three dimensions. Our platform turns flat PDFs into interactive knowledge graphs and spatial study environments.
          </p>
          <ul className="space-y-4">
            {['Spatial reading modes', 'Interactive knowledge graphs', 'AI-assisted synthesis'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-zinc-300">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="w-full lg:w-[60%] h-[500px] md:h-[650px] relative rounded-3xl overflow-hidden glass-card shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border-white/10">
          <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
        </div>
      </section>

      {/* NEW SECTION: FEATURE SHOWCASE */}
      <section className="w-full py-32 bg-[#050505] relative border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 flex flex-col gap-32">
          {/* Feature 1 */}
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <div className="h-[400px] w-full rounded-2xl glass border border-white/5 bg-gradient-to-br from-zinc-900/50 to-black p-8 relative overflow-hidden flex items-center justify-center">
                <DashboardMock />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="text-3xl font-medium text-zinc-100 mb-4">Command your workflow</h3>
              <p className="text-zinc-400 text-lg font-light leading-relaxed mb-6">
                A unified dashboard that feels like magic. Track reading progress, organize citations, and manage collections with keyboard-first shortcuts and a fluid interface.
              </p>
              <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 text-sm font-medium transition-colors">
                Explore Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          
          {/* Feature 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-16">
            <div className="w-full md:w-1/2">
              <div className="h-[400px] w-full rounded-2xl glass border border-white/5 bg-gradient-to-bl from-zinc-900/50 to-black p-8 relative overflow-hidden flex flex-col items-center justify-center">
                <Bot className="h-16 w-16 text-indigo-400 mb-6 opacity-80" />
                <div className="w-full max-w-sm glass rounded-xl p-4 border border-white/10">
                  <div className="flex gap-3 mb-4">
                    <User className="h-6 w-6 text-zinc-500" />
                    <div className="bg-white/5 rounded-lg p-3 text-sm text-zinc-300">Summarize the key findings of attention mechanism papers.</div>
                  </div>
                  <div className="flex gap-3">
                    <Bot className="h-6 w-6 text-indigo-400" />
                    <div className="bg-indigo-500/10 rounded-lg p-3 text-sm text-zinc-300 border border-indigo-500/20">The key findings highlight that self-attention allows models to weigh the importance of different words...</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="text-3xl font-medium text-zinc-100 mb-4">AI Librarian</h3>
              <p className="text-zinc-400 text-lg font-light leading-relaxed mb-6">
                Your personal research assistant. Ask complex questions, generate summaries, and find connections between papers instantly.
              </p>
              <Link href="/librarian">
                <button className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 text-sm font-medium transition-colors">
                  Try AI Search <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
