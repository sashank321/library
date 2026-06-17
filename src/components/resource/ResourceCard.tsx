"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { Heart, Star, BookOpen, Clock, ArrowRight } from "lucide-react";
import { Resource } from "@/types/resource";
import { useLibraryStore } from "@/store/useLibraryStore";

const ROTATION_RANGE = 32.5;
const HALF_ROTATION_RANGE = 32.5 / 2;

export function ResourceCard({ resource }: { resource: Resource }) {
  const isFavorite = useLibraryStore((state) => state.isFavorite(resource.id));
  const toggleFavorite = useLibraryStore((state) => state.toggleFavorite);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 40 });
  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;
    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / width - HALF_ROTATION_RANGE;
    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform,
      }}
      className="relative group h-[460px] rounded-2xl cursor-pointer"
    >
      <div
        style={{ transform: "translateZ(30px)" }}
        className="absolute inset-0 rounded-2xl overflow-hidden glass border border-white/5 bg-black transition-all duration-300 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:border-white/10"
      >
        {/* Cover Image */}
        <div className="relative h-[220px] w-full overflow-hidden">
          <img
            src={resource.coverImage}
            alt={resource.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />
          
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-2 py-1 bg-white/10 backdrop-blur-md text-[10px] uppercase tracking-widest font-medium rounded text-zinc-300 border border-white/10">
              {resource.category}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(resource.id);
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 backdrop-blur border border-white/10 hover:bg-black/60 transition-colors z-20"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                mounted && isFavorite ? "fill-white text-white" : "text-zinc-400"
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col h-[calc(100%-220px)] relative">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-medium text-zinc-100 line-clamp-1">
              {resource.title}
            </h3>
            <div className="flex items-center gap-1 text-zinc-300 bg-white/5 px-1.5 py-0.5 rounded text-xs">
              <Star className="h-3 w-3 fill-zinc-300" />
              {resource.rating}
            </div>
          </div>
          
          <p className="text-sm text-zinc-500 mb-3 font-light">{resource.author}</p>
          
          <p className="text-sm text-zinc-400 line-clamp-2 mb-4 font-light flex-1 leading-relaxed">
            {resource.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4 font-light">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" /> {resource.pages} pages
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {resource.year}
            </div>
          </div>

          <Link href={`/resources/${resource.id}`} className="absolute inset-0 z-10" />

          {/* CTA reveal */}
          <div className="absolute bottom-5 left-5 right-5 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 flex justify-end">
            <div className="bg-white text-black px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2">
              Explore <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
