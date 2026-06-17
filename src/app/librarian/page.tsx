"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, User, Send, Sparkles, BookOpen, Star, RefreshCw, Trash2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { resources } from "@/data/resources";
import { Resource } from "@/types/resource";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  recommendedBooks?: Resource[];
  timestamp: Date;
}

const PREDEFINED_PROMPTS = [
  { label: "Recommend Data Science books", text: "Can you recommend some good Data Science books?" },
  { label: "Recommend Python books", text: "What are the best books for learning Python?" },
  { label: "Recommend Self-Help books", text: "Suggest some inspiring Self-Help books." },
  { label: "Best books for beginners", text: "What are the best books in the library for beginners?" },
];

export default function AILibrarianPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text: "Hello! I am your AI Librarian. Ask me to find books on a specific topic, author, or category. You can also click one of the quick prompts below to get started!",
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Local Rule-Based Engine
  const generateLocalResponse = (query: string): { text: string; books: Resource[] } => {
    const cleanQuery = query.toLowerCase();
    let recommended: Resource[] = [];
    let replyText = "";

    if (cleanQuery.includes("data science")) {
      recommended = resources.filter((b) => b.category === "Data Science" || b.title.toLowerCase().includes("data science"));
      replyText = "Here are the top Data Science resources from our collection. They cover data processing, statistics, and visualization using R and Python.";
    } else if (cleanQuery.includes("python")) {
      recommended = resources.filter((b) => b.title.toLowerCase().includes("python") || b.description.toLowerCase().includes("python"));
      replyText = "Here are the books that focus on Python. Especially recommended is the Python Data Science Handbook for practical applications.";
    } else if (cleanQuery.includes("self-help") || cleanQuery.includes("inspirational") || cleanQuery.includes("success")) {
      recommended = resources.filter((b) => b.category === "Self-Help");
      replyText = "Here are our Self-Help and personal development books. These classics focus on success mindset, thought control, and personal growth.";
    } else if (cleanQuery.includes("beginner") || cleanQuery.includes("starting") || cleanQuery.includes("introduction")) {
      // Find highly rated and introductory books
      recommended = resources.filter(
        (b) => 
          b.rating >= 4.7 && 
          (b.category === "Programming" || b.category === "Self-Help" || b.category === "Design" || b.title.toLowerCase().includes("introduction"))
      ).slice(0, 4);
      replyText = "For beginners, I highly recommend starting with these clear, highly-rated introductory resources on programming, design, math, and self-help.";
    } else if (cleanQuery.includes("artificial intelligence") || cleanQuery.includes("ai") || cleanQuery.includes("learning")) {
      recommended = resources.filter((b) => b.category === "Artificial Intelligence");
      replyText = "Here are the cutting-edge Artificial Intelligence resources in our catalog, spanning deep learning, singularity, and intelligence systems.";
    } else if (cleanQuery.includes("mathematics") || cleanQuery.includes("math") || cleanQuery.includes("calculus") || cleanQuery.includes("algebra")) {
      recommended = resources.filter((b) => b.category === "Mathematics");
      replyText = "These are our curated Mathematics books, ideal for machine learning prerequisites, complexity theory, and core mathematical foundation.";
    } else if (cleanQuery.includes("literature") || cleanQuery.includes("novel") || cleanQuery.includes("gatsby") || cleanQuery.includes("shelley")) {
      recommended = resources.filter((b) => b.category === "Literature");
      replyText = "Here is our collection of classic public domain Literature novels. Perfect for diving into timeless narrative art.";
    } else if (cleanQuery.includes("programming") || cleanQuery.includes("code") || cleanQuery.includes("developer")) {
      recommended = resources.filter((b) => b.category === "Programming" || b.category === "Technology").slice(0, 4);
      replyText = "Here is a selection of outstanding Programming and Technology resources that detail architecture, refactoring, and general engineering wisdom.";
    } else {
      // General keyword search
      recommended = resources.filter(
        (b) => 
          b.title.toLowerCase().includes(cleanQuery) || 
          b.author.toLowerCase().includes(cleanQuery) ||
          b.category.toLowerCase().includes(cleanQuery) ||
          b.description.toLowerCase().includes(cleanQuery)
      ).slice(0, 4);

      if (recommended.length > 0) {
        replyText = `Based on your request, I found these matching resources in our digital library. Let me know if you would like more detail on any of them!`;
      } else {
        replyText = "I couldn't find any resources matching that specific query. Please try searching for categories like 'AI', 'Mathematics', 'Literature', 'Data Science', 'Self-Help', or asking for 'beginners' books!";
      }
    }

    return { text: replyText, books: recommended };
  };

  // Run Gemini API Call if Key is Present
  const callGeminiAPI = async (query: string, apiKey: string): Promise<{ text: string; books: Resource[] }> => {
    try {
      // Ground the catalog by sending it as context
      const simplifiedCatalog = resources.map(b => ({
        id: b.id,
        title: b.title,
        author: b.author,
        category: b.category,
        description: b.description
      }));

      const systemInstruction = `You are a helpful AI Librarian for "Nexus Digital Library". 
Your task is to answer user queries and recommend books *exclusively* from this JSON catalog of available books in our library:
${JSON.stringify(simplifiedCatalog, null, 2)}

Requirements:
1. Always be conversational, polite, and helpful.
2. Recommend relevant books matching the user's intent.
3. At the very end of your response, write a list of recommended book IDs in this exact format: [IDS: 1, 2, 3] so we can render cards for them. Only include IDs that exist in the catalog. If you don't recommend any, write [IDS: none].`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${systemInstruction}\n\nUser Question: ${query}` }]
              }
            ],
            generationConfig: {
              temperature: 0.3,
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error("API call failed");
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Parse the ID tags, e.g. [IDS: 1, 2, 3]
      const idsMatch = rawText.match(/\[IDS:\s*([^\]]+)\]/);
      let recommendedBooks: Resource[] = [];
      let cleanText = rawText.replace(/\[IDS:\s*[^\]]+\]/, "").trim();

      if (idsMatch && idsMatch[1]) {
        const idString = idsMatch[1];
        if (idString.toLowerCase() !== "none") {
          const ids = idString.split(",").map((id: string) => id.trim());
          recommendedBooks = resources.filter(b => ids.includes(b.id));
        }
      }

      return { text: cleanText, books: recommendedBooks };
    } catch (error) {
      console.error("Gemini API Error, falling back to local engine:", error);
      return generateLocalResponse(query);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      sender: "user",
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate networking delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Check if key is available in environment
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    let botResponse;

    if (apiKey) {
      botResponse = await callGeminiAPI(text, apiKey);
    } else {
      botResponse = generateLocalResponse(text);
    }

    const botMessage: Message = {
      id: Math.random().toString(),
      sender: "bot",
      text: botResponse.text,
      recommendedBooks: botResponse.books,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsLoading(false);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text: "Chat cleared! Ask me for any recommendations or topics you are interested in exploring.",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="container mx-auto px-4 pt-28 pb-8 max-w-5xl flex flex-col h-[calc(100vh-20px)] min-h-[500px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-2">
            <Bot className="h-7 w-7 text-indigo-400" />
            AI Librarian
          </h1>
          <p className="text-zinc-500 text-sm font-light mt-1">
            Personalized research assistant & book recommendations.
          </p>
        </div>
        <Button
          onClick={clearChat}
          variant="outline"
          size="sm"
          className="border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Chat
        </Button>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 glass border border-white/10 rounded-2xl overflow-hidden flex flex-col min-h-0 bg-black/40">
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-4 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Avatar */}
                {message.sender === "bot" && (
                  <div className="h-9 w-9 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    <Bot className="h-5 w-5 text-indigo-400" />
                  </div>
                )}

                {/* Message bubble */}
                <div className="flex flex-col max-w-[85%] sm:max-w-[70%] gap-3">
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      message.sender === "user"
                        ? "bg-zinc-100 text-zinc-900 rounded-tr-none self-end"
                        : "bg-white/5 text-zinc-200 border border-white/5 rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                  </div>

                  {/* Recommended book cards inside chat */}
                  {message.recommendedBooks && message.recommendedBooks.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1"
                    >
                      {message.recommendedBooks.map((book) => (
                        <div
                          key={book.id}
                          className="glass border border-white/5 bg-zinc-950/60 p-3 rounded-xl flex gap-3 hover:border-white/10 transition-colors"
                        >
                          <div className="w-12 h-16 rounded bg-zinc-800 overflow-hidden shrink-0 border border-white/10">
                            <img src={book.coverImage} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1 flex flex-col justify-between">
                            <div>
                              <p className="font-semibold text-xs text-zinc-200 truncate">{book.title}</p>
                              <p className="text-[10px] text-zinc-500 truncate mt-0.5">{book.author}</p>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-[9px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded font-medium">
                                {book.category}
                              </span>
                              <Link 
                                href={`/resources/${book.id}`}
                                className="text-[10px] text-zinc-300 hover:text-white flex items-center gap-0.5"
                              >
                                View <ArrowRight className="h-2.5 w-2.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>

                {message.sender === "user" && (
                  <div className="h-9 w-9 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-zinc-300" />
                  </div>
                )}
              </motion.div>
            ))}

            {/* Loading/Typing animation */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4 justify-start"
              >
                <div className="h-9 w-9 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <Bot className="h-5 w-5 text-indigo-400 animate-bounce" />
                </div>
                <div className="p-4 rounded-2xl bg-white/5 text-zinc-400 border border-white/5 rounded-tl-none flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Predefined Quick Prompts container */}
        {messages.length === 1 && !isLoading && (
          <div className="px-6 pb-2 pt-2 border-t border-white/5">
            <p className="text-zinc-500 text-[11px] font-semibold tracking-wider uppercase mb-2">Predefined prompts</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PREDEFINED_PROMPTS.map((prompt) => (
                <button
                  key={prompt.label}
                  onClick={() => handleSendMessage(prompt.text)}
                  className="flex items-center justify-between text-left text-xs text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/5 hover:border-white/10 transition-all font-medium"
                >
                  <span>{prompt.label}</span>
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="p-4 border-t border-white/10 bg-[#050505]/60 flex items-center gap-3 shrink-0">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage(inputValue);
            }}
            placeholder="Type a message (e.g. Recommend data science books)..."
            className="flex-1 bg-white/5 border border-white/10 focus:border-indigo-500/50 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-0 text-zinc-100 placeholder:text-zinc-500 transition-colors"
          />
          <Button
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || isLoading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 w-11 p-0 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
