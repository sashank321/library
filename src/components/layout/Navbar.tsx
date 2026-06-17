"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Library, Search, User, Heart, LayoutDashboard, LayoutGrid, Command, Moon, Sun, Bot, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { SearchPalette } from "@/components/layout/SearchPalette";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const navLinks = [
  { name: "Explore", href: "/resources", icon: Search },
  { name: "Categories", href: "/categories", icon: LayoutGrid },
  { name: "Favorites", href: "/favorites", icon: Heart },
  { name: "AI Librarian", href: "/librarian", icon: Bot },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [theme, setTheme] = useState("dark"); // simple toggle for UI purposes
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: "-100%", opacity: 0 },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-4 left-0 right-0 z-50 w-full flex justify-center px-4"
      >
        <div className="w-full max-w-5xl rounded-full glass border border-white/10 px-4 py-2 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-zinc-800/50 p-1.5 rounded-full group-hover:bg-zinc-800 transition-colors">
                <Library className="h-5 w-5 text-zinc-200" />
              </div>
              <span className="font-medium text-sm hidden sm:inline-block text-zinc-200">
                Nexus
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-3 py-1.5 rounded-full text-xs transition-colors",
                      isActive ? "text-zinc-100" : "text-zinc-400 hover:text-zinc-200"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-0 bg-white/10 rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative flex items-center gap-2 z-10">
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search Input Trigger */}
            <button 
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/50 hover:bg-zinc-800/80 transition-colors border border-white/5 rounded-full px-3 py-1.5 cursor-text"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Search...</span>
              <div className="hidden sm:flex items-center gap-0.5 ml-2">
                <Command className="h-3 w-3" />
                <span>K</span>
              </div>
            </button>
            
            <button 
              onClick={toggleTheme}
              className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors"
            >
              {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            
            <Link href="/profile" className="hidden sm:block">
              <Avatar className="h-8 w-8 border border-white/10 hover:border-white/30 transition-colors cursor-pointer">
                <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
                <AvatarFallback className="bg-zinc-800 text-xs"><User className="h-3.5 w-3.5" /></AvatarFallback>
              </Avatar>
            </Link>

            {/* Mobile Hamburger menu */}
            <div className="flex md:hidden items-center">
              <Sheet>
                <SheetTrigger render={
                  <button className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors">
                    <Menu className="h-5 w-5" />
                  </button>
                } />
                <SheetContent side="left" className="bg-zinc-950/95 border-r border-white/10 p-6 w-[280px] text-zinc-100">
                  <SheetHeader className="mb-8 mt-4">
                    <SheetTitle className="text-zinc-100 flex items-center gap-2">
                      <Library className="h-5 w-5 text-indigo-400" />
                      <span className="text-sm font-semibold tracking-wide uppercase">Nexus</span>
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-2">
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors",
                            isActive 
                              ? "bg-white/10 text-white font-medium" 
                              : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0 text-zinc-400" />
                          <span>{link.name}</span>
                        </Link>
                      );
                    })}
                    <Link
                      href="/profile"
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors",
                        pathname.startsWith("/profile") 
                          ? "bg-white/10 text-white font-medium" 
                          : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                      )}
                    >
                      <User className="h-4 w-4 shrink-0 text-zinc-400" />
                      <span>Profile</span>
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Global Command Palette */}
      <SearchPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
