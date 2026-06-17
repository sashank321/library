"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart, Share2, Download, BookOpen, Star, Clock, Globe, Building, X, User } from "lucide-react";
import { resources } from "@/data/resources";
import { useLibraryStore } from "@/store/useLibraryStore";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourceCard } from "@/components/resource/ResourceCard";

interface Review {
  authorName: string;
  rating: number;
  comment: string;
  date: string;
}

// Initial mock reviews data
const INITIAL_REVIEWS: Record<string, Review[]> = {
  "1": [
    { authorName: "Dr. Alice Vance", rating: 5, comment: "An incredible synthesis of current AI trends. Kurzweil's vision is as compelling and frightening as ever.", date: "2026-05-14" },
    { authorName: "Mark S.", rating: 4, comment: "Thought-provoking ideas, though the timeline feels a bit optimistic.", date: "2026-06-01" }
  ],
  "2": [
    { authorName: "Devin K.", rating: 5, comment: "This book completely transformed how I design software systems. Essential reading for all developers.", date: "2026-04-12" }
  ],
  "4": [
    { authorName: "Sanjay Mehta", rating: 5, comment: "The bible of modern backend systems design. Invaluable details on storage engines and distributed systems.", date: "2026-05-20" }
  ]
};

export default function ResourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const resourceId = params.id as string;
  const resource = resources.find((r) => r.id === resourceId);

  const isFavorite = useLibraryStore((state) => state.isFavorite(resourceId));
  const toggleFavorite = useLibraryStore((state) => state.toggleFavorite);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newAuthor, setNewAuthor] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (resourceId) {
      setReviews(INITIAL_REVIEWS[resourceId] || [
        { authorName: "Jane Smith", rating: 5, comment: "Absolutely loved this resource! Highly educational and very well written.", date: "2026-05-10" },
        { authorName: "Prof. Arthur", rating: 4, comment: "A solid compilation of references and logical frameworks. Recommended for reference.", date: "2026-06-02" }
      ]);
      setShowForm(false);
    }
  }, [resourceId]);

  if (!resource) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h1 className="text-3xl font-bold mb-4">Resource Not Found</h1>
        <Button onClick={() => router.push("/resources")}>Back to Resources</Button>
      </div>
    );
  }

  // Related Books Engine
  const relatedBooks = resources
    .filter((r) => r.category === resource.category && r.id !== resource.id)
    .slice(0, 3);
  
  const finalRelated = relatedBooks.length >= 3 
    ? relatedBooks 
    : [...relatedBooks, ...resources.filter(r => r.id !== resource.id && !relatedBooks.some(x => x.id === r.id))].slice(0, 3);

  const handleDownload = () => {
    if (resource.pdfUrl) {
      window.open(resource.pdfUrl, "_blank");
    } else {
      window.open(`https://archive.org/search.php?query=${encodeURIComponent(resource.title)}`, "_blank");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const newReview: Review = {
      authorName: newAuthor,
      rating: newRating,
      comment: newComment,
      date: new Date().toISOString().split("T")[0]
    };

    setReviews((prev) => [newReview, ...prev]);
    setNewAuthor("");
    setNewComment("");
    setNewRating(5);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner Area */}
      <div className="relative h-[40vh] md:h-[50vh] w-full">
        {/* Blurred Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${resource.coverImage})` }}
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

        <div className="container mx-auto px-4 h-full flex flex-col justify-end relative z-10 pb-8">
          <Button 
            variant="ghost" 
            className="w-fit mb-8 -ml-4 text-muted-foreground hover:text-white"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>

          <div className="flex flex-col md:flex-row gap-8 items-end">
            {/* Cover Image */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-48 h-72 md:w-64 md:h-96 shrink-0 rounded-xl overflow-hidden shadow-2xl border border-white/10 hidden md:block translate-y-16"
            >
              <img src={resource.coverImage} alt={resource.title} className="w-full h-full object-cover" />
            </motion.div>

            {/* Header Info */}
            <div className="flex-1 pb-4">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 mb-4"
              >
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                  {resource.category}
                </span>
                <span className="flex items-center gap-1 text-yellow-500 font-medium">
                  <Star className="h-4 w-4 fill-current" /> {resource.rating}
                </span>
              </motion.div>
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold text-white mb-2"
              >
                {resource.title}
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-muted-foreground"
              >
                By {resource.author}
              </motion.p>
            </div>

            {/* Actions */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex gap-3 pb-4 w-full md:w-auto z-10"
            >
              <Button 
                size="lg" 
                className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                onClick={() => router.push(`/resources/${resourceId}/read`)}
              >
                <BookOpen className="h-4 w-4 mr-2" /> Read Online
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/5 border-white/10"
                onClick={() => toggleFavorite(resourceId)}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/5 border-white/10"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 mt-8 md:mt-32 pb-20 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left Column (Metadata) */}
          <div className="w-full md:w-64 shrink-0 space-y-6">
            <div className="glass p-6 rounded-2xl space-y-4">
              <h3 className="font-semibold text-white border-b border-white/10 pb-2">Information</h3>
              
              <div className="flex items-start gap-3 text-sm">
                <Building className="h-4 w-4 text-zinc-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-zinc-500 text-xs">Publisher</p>
                  <p className="font-medium text-zinc-200">{resource.publisher}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-sm">
                <Clock className="h-4 w-4 text-zinc-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-zinc-500 text-xs">Published Year</p>
                  <p className="font-medium text-zinc-200">{resource.year}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <BookOpen className="h-4 w-4 text-zinc-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-zinc-500 text-xs">Pages</p>
                  <p className="font-medium text-zinc-200">{resource.pages}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <Globe className="h-4 w-4 text-zinc-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-zinc-500 text-xs">Language</p>
                  <p className="font-medium text-zinc-200">{resource.language}</p>
                </div>
              </div>
            </div>

            <Button 
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200" 
              size="lg"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" /> Download PDF
            </Button>
          </div>

          {/* Right Column (Tabs) */}
          <div className="flex-1">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-white/5 border border-white/10 p-1 w-full justify-start h-12 rounded-xl mb-8">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-lg px-6 text-zinc-400">Overview</TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-lg px-6 text-zinc-400">Reviews ({reviews.length})</TabsTrigger>
                <TabsTrigger value="related" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-lg px-6 text-zinc-400">Related Resources</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-zinc-300">
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-2xl font-bold mb-4 text-white">About this resource</h2>
                  <p className="text-zinc-400 text-lg leading-relaxed">
                    {resource.description}
                  </p>
                  <p className="text-zinc-400 text-lg leading-relaxed mt-4">
                    This comprehensively detailed publication offers readers a deep dive into the foundational concepts, modern strategies, and real-world implications of its core subject matter. Drawing on extensive research and case studies, the author presents a compelling narrative that demystifies complex topics, making them accessible to both novices and seasoned professionals alike.
                  </p>
                  <p className="text-zinc-400 text-lg leading-relaxed mt-4">
                    Whether you are looking to grasp the basics or looking to stay ahead of cutting-edge developments, this resource serves as an invaluable reference. It systematically breaks down theoretical frameworks and pairs them with practical applications, empowering you to apply new insights immediately.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">User Reviews</h3>
                  <Button 
                    variant="outline"
                    className="border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/10"
                    onClick={() => setShowForm(!showForm)}
                  >
                    {showForm ? "Cancel" : "Write a Review"}
                  </Button>
                </div>

                {/* Review Form */}
                <AnimatePresence>
                  {showForm && (
                    <motion.form 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleAddReview}
                      className="glass p-6 rounded-2xl border border-white/10 space-y-4 overflow-hidden"
                    >
                      <h4 className="font-semibold text-zinc-100">Submit Your Review</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-zinc-400 font-medium">Your Name</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. John Doe"
                            value={newAuthor}
                            onChange={(e) => setNewAuthor(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-zinc-400 font-medium font-sans">Rating (1-5 Stars)</label>
                          <select 
                            value={newRating} 
                            onChange={(e) => setNewRating(parseInt(e.target.value))}
                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
                          >
                            <option value={5}>5 Stars - Outstanding</option>
                            <option value={4}>4 Stars - Very Good</option>
                            <option value={3}>3 Stars - Good</option>
                            <option value={2}>2 Stars - Fair</option>
                            <option value={1}>1 Star - Poor</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-zinc-400 font-medium">Comment</label>
                        <textarea 
                          required
                          rows={4}
                          placeholder="Write your thoughts about this resource..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 resize-none"
                        />
                      </div>
                      <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white">
                        Submit Review
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="glass p-8 rounded-2xl text-center">
                      <Star className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                      <p className="text-zinc-400 mb-2">No Reviews Yet</p>
                      <p className="text-xs text-zinc-500">Be the first to share your thoughts on this resource.</p>
                    </div>
                  ) : (
                    reviews.map((review, idx) => (
                      <div key={idx} className="glass p-5 rounded-2xl border border-white/5 space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-zinc-200 text-sm">{review.authorName}</p>
                            <p className="text-[10px] text-zinc-500">{review.date}</p>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3.5 w-3.5 ${i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-zinc-700"}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed pt-1">{review.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="related" className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">More Like This</h3>
                  <p className="text-zinc-500 text-sm">Discover other resources in the "{resource.category}" category.</p>
                </div>
                
                {/* Related grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                  {finalRelated.map((book) => (
                    <ResourceCard key={book.id} resource={book} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
