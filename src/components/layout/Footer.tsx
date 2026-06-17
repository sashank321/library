"use client";

import Link from "next/link";
import { Globe, MessageCircle, Briefcase, Mail, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#000000] pt-24 pb-12 overflow-hidden">
      {/* Background Grid & Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4 tracking-tight">
              Nexus
            </h2>
            <p className="text-zinc-400 mb-6 text-sm leading-relaxed max-w-xs">
              The intelligent digital library for modern research and discovery. Premium resources, immersive experience.
            </p>
            <div className="flex gap-4">
              {[
                { icon: MessageCircle, href: "#" },
                { icon: Globe, href: "#" },
                { icon: Briefcase, href: "#" },
              ].map((Social, i) => (
                <Link
                  key={i}
                  href={Social.href}
                  className="text-zinc-500 hover:text-zinc-200 transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full border border-white/5"
                >
                  <Social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-zinc-200 mb-4 text-sm tracking-wide uppercase">Resources</h3>
            <ul className="space-y-3">
              {["Collections", "Trending", "Recent Publications", "Academic Papers"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors inline-block hover:translate-x-1 transform duration-200">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-zinc-200 mb-4 text-sm tracking-wide uppercase">Company</h3>
            <ul className="space-y-3">
              {["About", "Careers", "Blog", "Contact"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors inline-block hover:translate-x-1 transform duration-200">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-zinc-200 mb-4 text-sm tracking-wide uppercase">Stay Updated</h3>
            <p className="text-zinc-400 text-sm mb-4">
              Subscribe to our newsletter for the latest research and platform updates.
            </p>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-12 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              />
              <button className="absolute right-1 top-1 bottom-1 bg-white/10 hover:bg-white/20 text-zinc-300 rounded-lg px-2 flex items-center justify-center transition-colors">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 gap-4">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Nexus Digital Library. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-zinc-500">
            <span>Built by: Mounika, Ridhi, Sejal, Bhavya</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
