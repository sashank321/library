"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Ghost, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="glass p-12 rounded-3xl flex flex-col items-center text-center max-w-md relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-primary/5 blur-[50px] rounded-full" />
        
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <Ghost className="h-24 w-24 text-primary mb-6" />
        </motion.div>
        
        <h1 className="text-4xl font-bold text-white mb-2">404</h1>
        <h2 className="text-xl font-semibold text-white mb-4">Page Not Found</h2>
        
        <p className="text-muted-foreground mb-8">
          The resource or page you are looking for has drifted into the digital void.
        </p>

        <Link href="/" className="inline-flex items-center justify-center w-full h-11 px-8 bg-primary hover:bg-primary/90 text-white font-medium rounded-full transition-colors mt-8">
          <ArrowLeft className="h-4 w-4 mr-2" /> Return Home
        </Link>
      </motion.div>
    </div>
  );
}
