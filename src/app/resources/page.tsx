"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { useLibraryStore } from "@/store/useLibraryStore";
import { resources } from "@/data/resources";
import { ResourceCard } from "@/components/resource/ResourceCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const categories = ["All", "Technology", "Science", "Business", "Mathematics", "History", "Artificial Intelligence", "Programming", "Design", "Data Science", "Literature", "Self-Help", "Computer Science"];

export default function ResourcesPage() {
  const { searchQuery, setSearchQuery, activeCategory, setActiveCategory } = useLibraryStore();
  const [showFilters, setShowFilters] = useState(false);

  // Filter resources based on query and category
  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            resource.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || resource.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="container mx-auto px-4 pt-28 pb-12 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-gradient">Resource Explorer</h1>
          <p className="text-muted-foreground">Discover and search through our extensive collection.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or author..."
              className="pl-10 bg-white/5 border-white/10 focus:border-primary"
            />
          </div>
          <Button 
            variant="outline" 
            className="bg-white/5 border-white/10"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <motion.aside 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`lg:w-64 shrink-0 space-y-8 ${showFilters ? 'block' : 'hidden lg:block'}`}
        >
          <div className="glass p-6 rounded-2xl">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" /> Categories
            </h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeCategory === category 
                      ? "bg-primary/20 text-primary font-medium" 
                      : "hover:bg-white/5 text-muted-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.aside>

        {/* Resource Grid */}
        <div className="flex-1 min-w-0">
          {filteredResources.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center glass rounded-3xl">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No resources found</h3>
              <p className="text-muted-foreground">Try adjusting your search query or filters.</p>
              <Button 
                className="mt-6 bg-primary/20 text-primary hover:bg-primary/30"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : searchQuery === "" && activeCategory === "All" ? (
            <div className="space-y-12">
              {/* Featured Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-zinc-200 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> Featured Resources
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {resources.filter(r => r.rating >= 4.8).slice(0, 3).map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </div>

              {/* Popular Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-zinc-200 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> Popular Books
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {resources.filter(r => r.rating >= 4.7 && r.rating < 4.8).slice(0, 3).map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </div>

              {/* Recently Added Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-zinc-200 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> Recently Added
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {resources.filter(r => r.isNew || r.year >= 2020).slice(0, 3).map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </div>

              {/* All Books Section */}
              <div className="space-y-4 border-t border-white/5 pt-8">
                <h2 className="text-lg font-bold text-zinc-200 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> All Resources
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredResources.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-bold text-zinc-200 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> 
                  {activeCategory === "All" ? "Search Results" : activeCategory} ({filteredResources.length})
                </h2>
              </div>
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
              >
                {filteredResources.map((resource) => (
                  <motion.div
                    key={resource.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                  >
                    <ResourceCard resource={resource} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
