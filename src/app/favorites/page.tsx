"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeartOff, Search, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLibraryStore } from "@/store/useLibraryStore";
import { resources } from "@/data/resources";
import { ResourceCard } from "@/components/resource/ResourceCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FavoritesPage() {
  const { favorites } = useLibraryStore();
  const [searchQuery, setSearchQuery] = useState("");

  const favoriteResources = resources.filter((resource) => favorites.includes(resource.id));
  
  const filteredFavorites = favoriteResources.filter((resource) =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 pt-28 pb-16 max-w-7xl min-h-[80vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Heart className="h-10 w-10 text-red-500 fill-red-500/20" /> Your Favorites
          </h1>
          <p className="text-muted-foreground">Manage and revisit your saved resources.</p>
        </div>
        
        {favorites.length > 0 && (
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your favorites..."
              className="pl-10 bg-white/5 border-white/10 focus:border-primary"
            />
          </div>
        )}
      </div>

      {favorites.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-32 text-center glass rounded-3xl"
        >
          <div className="p-6 bg-red-500/10 rounded-full mb-6">
            <HeartOff className="h-16 w-16 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">No favorites yet</h3>
          <p className="text-muted-foreground text-lg max-w-md mb-8">
            You haven't saved any resources to your favorites. Start exploring and save the ones you love!
          </p>
          <Link href="/resources" className="inline-flex items-center justify-center h-11 bg-primary hover:bg-primary/90 text-white font-medium rounded-full px-8 transition-colors mb-8">
            Explore Resources <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      ) : filteredFavorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center glass rounded-3xl">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No matching favorites</h3>
          <p className="text-muted-foreground">Try adjusting your search query.</p>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredFavorites.map((resource) => (
              <motion.div
                key={resource.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                transition={{ duration: 0.3 }}
              >
                <ResourceCard resource={resource} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
