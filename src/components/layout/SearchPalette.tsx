"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, User, X, CornerDownLeft, Sparkles, Command } from "lucide-react";
import { useRouter } from "next/navigation";
import { resources } from "@/data/resources";
import { Resource } from "@/types/resource";

interface SearchPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchPalette({ isOpen, onClose }: SearchPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Predefined autocomplete/recommendation tags
  const suggestions = ["Data Science", "Python", "Self-Help", "Algorithms", "AI", "Mathematics"];

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Keyboard navigation for global Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // Handled by Navbar if toggled, but let's make sure it handles close/open state
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filtered resources
  const filtered = query.trim() === "" 
    ? [] 
    : resources.filter(
        (book) =>
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase()) ||
          book.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6);

  // Key navigation inside list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % Math.max(filtered.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) {
        handleSelectBook(filtered[activeIndex].id);
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const handleSelectBook = (id: string) => {
    onClose();
    router.push(`/resources/${id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-2xl bg-zinc-950/90 border border-white/10 rounded-2xl overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.8)] z-10 glass mx-4"
          >
            {/* Input Header */}
            <div className="relative flex items-center border-b border-white/10 px-4 py-4">
              <Search className="h-5 w-5 text-zinc-400 mr-3 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKeyDown}
                type="text"
                placeholder="Search resources by title, author, or category..."
                className="w-full bg-transparent text-zinc-100 placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-0"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Suggestions & Results Panel */}
            <div ref={listRef} className="max-h-[380px] overflow-y-auto p-4 space-y-4">
              {query.trim() === "" ? (
                <div>
                  <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-3 px-2">
                    <Sparkles className="h-3 w-3 text-indigo-400" />
                    <span>Suggestions</span>
                  </div>
                  <div className="flex flex-wrap gap-2 px-2">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setQuery(suggestion);
                          inputRef.current?.focus();
                        }}
                        className="px-3 py-1.5 rounded-full text-xs font-medium text-zinc-300 bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <BookOpen className="h-10 w-10 text-zinc-600 mb-2 animate-pulse" />
                  <p className="text-sm font-medium text-zinc-400">No matching books found</p>
                  <p className="text-xs text-zinc-600 mt-1">Try typing another keyword (e.g., Python, Gatsby, AI)</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2 px-2">
                    Books Found ({filtered.length})
                  </div>
                  {filtered.map((book, idx) => (
                    <div
                      key={book.id}
                      onClick={() => handleSelectBook(book.id)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                        activeIndex === idx
                          ? "bg-white/10 text-white shadow-inner"
                          : "text-zinc-300 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Thumbnail */}
                        <div className="w-10 h-14 bg-zinc-800 rounded overflow-hidden shrink-0 border border-white/10">
                          <img src={book.coverImage} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{book.title}</p>
                          <p className="text-xs text-zinc-400 font-light truncate mt-0.5">{book.author}</p>
                          <span className="inline-block px-1.5 py-0.5 mt-1 bg-white/10 text-[9px] uppercase tracking-wider rounded text-zinc-400">
                            {book.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {activeIndex === idx && (
                          <span className="text-[10px] text-zinc-500 flex items-center gap-1 bg-white/5 px-2 py-1 rounded">
                            <span>Open</span>
                            <CornerDownLeft className="h-2.5 w-2.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Command Palette Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-[#050505] text-[10px] text-zinc-500 font-medium">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded">↑↓ Navigate</span>
                <span className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded">Enter Select</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Command className="h-3 w-3" />
                <span>ESC to Close</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
