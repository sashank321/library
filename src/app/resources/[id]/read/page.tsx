"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ZoomIn, ZoomOut, Maximize, Settings, ChevronLeft, ChevronRight, Bookmark } from "lucide-react";
import { resources } from "@/data/resources";
import { Button } from "@/components/ui/button";

export default function ReadResourcePage() {
  const params = useParams();
  const router = useRouter();
  const resourceId = params.id as string;
  const resource = resources.find((r) => r.id === resourceId);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1.0);
  const [pageInput, setPageInput] = useState("1");
  const [isFullScreen, setIsFullScreen] = useState(false);

  const totalPages = resource?.pages ? parseInt(resource.pages.toString().replace(/\D/g,'')) || 100 : 100;

  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Keyboard navigation for arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't turn pages if user is typing in an input
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }
      if (e.key === "ArrowRight") {
        nextPage();
      } else if (e.key === "ArrowLeft") {
        prevPage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalPages]);

  if (!resource) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h1 className="text-3xl font-bold mb-4">Resource Not Found</h1>
        <Button onClick={() => router.push("/resources")}>Back to Resources</Button>
      </div>
    );
  }

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const parsed = parseInt(pageInput);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
      setCurrentPage(parsed);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  // Generate realistic, book-specific text dynamically for each page
  const getBookPageContent = (page: number) => {
    const title = resource.title.toLowerCase();
    
    // Case 1: Frankenstein
    if (title.includes("frankenstein")) {
      if (page === 1) return { chapter: "Title Page", text: `FRANKENSTEIN;\nOR,\nTHE MODERN PROMETHEUS\n\nBy Mary Wollstonecraft Shelley\n\nPublished 1818` };
      if (page === 2) return {
        chapter: "Letter I",
        text: `To Mrs. Saville, England.\nSt. Petersburgh, Dec. 11th, 17—.\n\nYou will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.\n\nI am already far north of London, and as I walk in the streets of Petersburgh, I feel a cold northern breeze play upon my cheeks, which braces my nerves and fills me with delight. Do you understand this feeling? This breeze, which has travelled from the regions towards which I am advancing, gives me a foretaste of those icy climes.`
      };
      if (page === 3) return {
        chapter: "Letter II",
        text: `To Mrs. Saville, England.\nArchangel, 28th March, 17—.\n\nHow slowly the time passes here, encompassed as I am by frost and snow! Yet a second step is taken towards my enterprise. I have hired a vessel, and am occupied in collecting my sailors; those whom I have already engaged appear to be men on whom I can depend and are certainly possessed of dauntless courage.\n\nBut I have one want which I have never yet been able to satisfy, and the absence of the object of which I now feel as a most severe evil. I have no friend, Margaret: when I am glowing with the enthusiasm of success, there will be none to participate my joy.`
      };
      if (page === 4) return {
        chapter: "Chapter I",
        text: `I am by birth a Genevese, and my family is one of the most distinguished of that republic. My ancestors had been for many years counsellors and syndics, and my father had filled several public situations with honour and reputation. He was respected by all who knew him for his integrity and indefatigable attention to public business.\n\nHe passed his younger days perpetually occupied by the affairs of his country; a variety of circumstances had prevented his marrying early, nor was it until the decline of life that he became a husband and the father of a family.`
      };
      return {
        chapter: `Chapter ${Math.ceil(page / 8)}`,
        text: `Victor Frankenstein's scientific pursuit reaches a fever pitch as he continues his studies at Ingolstadt. In this section, he details the collection of materials and the psychological toll of his ambition.\n\n"No one can conceive the variety of feelings which bore me onwards, like a whirlwind, in the first enthusiasm of success. Life and death appeared to me ideal bounds, which I should first break through, and pour a torrent of light into our dark world. A new species would bless me as its creator and source; many happy and excellent natures would owe their being to me."`
      };
    }

    // Case 2: Clean Architecture
    if (title.includes("clean architecture")) {
      if (page === 1) return { chapter: "Title Page", text: `CLEAN ARCHITECTURE\n\nA Craftsman's Guide to Software Structure and Design\n\nRobert C. Martin ("Uncle Bob")\n\nForeword by Simon Brown` };
      if (page === 2) return {
        chapter: "Chapter 1: What is Design and Architecture?",
        text: `There has been a lot of confusion about design and architecture. What is the difference? There is none. They are the same. In software development, the architecture of a system refers to the high-level shape and structural decisions, while design refers to the lower-level implementation details. But when you look at them closely, they form a continuous fabric.\n\nThe goal of software architecture is to minimize the human effort required to build and maintain the system. If the effort increases with every release, the design is bad.`
      };
      if (page === 3) return {
        chapter: "Chapter 2: A Tale of Two Values",
        text: `Every software system provides two different values to the stakeholders: behavior and structure. Software developers are often hired to make the system behave in a way that helps stakeholders make or save money. This is the first value.\n\nThe second value, which is often neglected, is the structure of the software. Software must be soft—meaning easy to change. If stakeholders want to change the behavior, but the architecture makes it extremely expensive to do so, then the software's structure is flawed.`
      };
      if (page === 4) return {
        chapter: "Chapter 3: SOLID Principles",
        text: `The SOLID principles tell us how to arrange our functions and data structures into classes, and how those classes should be interconnected. The five principles are:\n\n1. Single Responsibility Principle (SRP): A module should have one, and only one, reason to change.\n2. Open-Closed Principle (OCP): A software artifact should be open for extension but closed for modification.\n3. Liskov Substitution Principle (LSP): Subtypes must be substitutable for their base types.\n4. Interface Segregation Principle (ISP): Avoid depending on things you don't use.\n5. Dependency Inversion Principle (DIP): Depend on abstractions, not concretions.`
      };
      return {
        chapter: `Chapter ${Math.ceil(page / 10)}: Architectural Boundaries`,
        text: `Software architecture is the art of drawing lines, which we call boundaries. These boundaries separate software elements from one another, and restrict elements on one side from knowing about elements on the other.\n\nBoundaries are drawn to defer decisions. In a clean architecture, the business rules do not know about the database, the web UI, the frameworks, or the communication protocols. The database is a detail, the web is a detail, and they should be kept separated from the core business logic.`
      };
    }

    // Case 3: Designing Data-Intensive Applications
    if (title.includes("designing data-intensive")) {
      if (page === 1) return { chapter: "Title Page", text: `DESIGNING DATA-INTENSIVE APPLICATIONS\n\nThe Big Ideas Behind Reliable, Scalable, and Maintainable Systems\n\nMartin Kleppmann\n\nO'Reilly Media` };
      if (page === 2) return {
        chapter: "Chapter 1: Reliable, Scalable, and Maintainable Systems",
        text: `Many applications today are data-intensive, as opposed to compute-intensive. Raw CPU power is rarely the bottleneck; the main problems are the quantity of data, the complexity of data, and the speed at which it is changing.\n\nWe focus on three main concerns in software systems:\n1. Reliability: The system should continue to work correctly, even when things go wrong (hardware/software faults).\n2. Scalability: Having strategies for coping with growth (load, data volume, traffic).\n3. Maintainability: Making it easy for new engineering teams to work on the system.`
      };
      if (page === 3) return {
        chapter: "Chapter 2: Data Models and Query Languages",
        text: `Data models are perhaps the most important part of developing software. They have such a profound effect on how we think about the problem and how we write our code.\n\nMost applications are built by layering data models. For example, as an application developer, you model real-world concepts in terms of objects or relations. To store those, you write them as JSON or relational tables, which the database engine represents as bytes on disk. We compare the relational model, document model, and graph-based models.`
      };
      return {
        chapter: `Chapter ${Math.ceil(page / 12)}: Storage and Retrieval`,
        text: `At the most basic level, a database needs to do two things: when you give it some data, it should store it, and when you ask it for the data, it should give it back to you.\n\nWe examine the two storage engines that power modern databases: Log-Structured Merge-trees (LSM-trees), which append new records to log files and merge them later, and B-trees, which divide the database into fixed-size pages and write updates in place. LSM-trees are typically faster for writes, while B-trees are faster for reads.`
      };
    }

    // Case 4: As a Man Thinketh
    if (title.includes("as a man thinketh")) {
      if (page === 1) return { chapter: "Title Page", text: `AS A MAN THINKETH\n\nBy James Allen\n\n"Mind is the Master power that moulds and makes,\nAnd Man is Mind, and evermore he takes\nGod's tools of thought, and, shaping what he wills,\nBrings forth a thousand joys, a thousand ills:—\nHe thinks in secret, and it comes to pass:\nEnvironment is but his looking-glass."` };
      if (page === 2) return {
        chapter: "Chapter 1: Thought and Character",
        text: `The aphorism, "As a man thinketh in his heart so is he," not only embraces the whole of a man's being, but is so comprehensive as to reach out to every condition and circumstance of his life. A man is literally what he thinks, his character being the complete sum of all his thoughts.\n\nAs the plant springs from, and could not be without, the seed, so every act of a man springs from the hidden seeds of thought, and could not have appeared without them. Act is the blossom of thought, and joy and suffering are its fruits.`
      };
      if (page === 3) return {
        chapter: "Chapter 2: Effect of Thought on Circumstances",
        text: `A man's mind may be likened to a garden, which may be intelligently cultivated or allowed to run wild; but whether cultivated or neglected, it must, and will, bring forth. If no useful seeds are put into it, then an abundance of useless weed-seeds will fall therein, and will continue to produce their kind.\n\nJust as a gardener cultivates his plot, keeping it free from weeds, and growing the flowers and fruits which he requires, so may a man tend the garden of his mind.`
      };
      return {
        chapter: `Chapter ${Math.ceil(page / 3)}: Thought and Circumstance`,
        text: `Man is buffeted by circumstances so long as he believes himself to be the creature of outside conditions. But when he realizes that he is a creative power, and that he may command the hidden soil and seeds of his being out of which circumstances grow, he then becomes the rightful master of himself.\n\nLet a man radically alter his thoughts, and he will be astonished at the rapid transformation it will effect in the material conditions of his life. Men do not attract that which they want, but that which they are.`
      };
    }

    // Default Fallback Generator for other books
    if (page === 1) {
      return {
        chapter: "Title Page",
        text: `${resource.title.toUpperCase()}\n\nBy ${resource.author}\n\nCategory: ${resource.category}\n\nPublished by ${resource.publisher || "Nexus Publishing"} &bull; ${resource.year}\n\nNexus Digital Library Premium Edition`
      };
    }
    
    return {
      chapter: `Chapter ${Math.ceil(page / 12)}: Overview of ${resource.category}`,
      text: `In this section of "${resource.title}", the author ${resource.author} elaborates on the core principles of ${resource.category}.\n\n"${resource.description}"\n\nAs the reader advances to page ${page}, the thesis explores how these elements integrate into modern research and academic studies. The material provides a detailed look at the frameworks, experimental setups, and conclusions gathered by the publisher, ${resource.publisher || "Nexus Press"}, in ${resource.year}.\n\nThis copy is authorized for academic use within the Nexus Digital Library ecosystem.`
    };
  };

  const { chapter, text } = getBookPageContent(currentPage);

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      {/* Top Toolbar */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 bg-zinc-900/50 backdrop-blur-md shrink-0 z-10 pt-4 md:pt-0">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-zinc-400 hover:text-white"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="hidden sm:block max-w-[200px] md:max-w-[400px]">
            <h1 className="text-xs font-semibold truncate text-zinc-200">{resource.title}</h1>
            <p className="text-[10px] text-zinc-500 truncate mt-0.5">{resource.author}</p>
          </div>
        </div>

        {/* Page navigation controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-zinc-800/50 rounded-lg p-1 mr-2 md:mr-4 border border-white/5">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-zinc-400 hover:text-white" 
              onClick={prevPage} 
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {/* Interactive Page Input */}
            <form onSubmit={handlePageSubmit} className="flex items-center">
              <input
                type="text"
                value={pageInput}
                onChange={handlePageInputChange}
                onBlur={() => handlePageSubmit()}
                className="w-10 bg-zinc-900 border border-white/10 text-center text-xs py-1 rounded text-zinc-200 focus:outline-none focus:border-indigo-500"
              />
            </form>
            
            <span className="text-xs font-medium px-2 text-zinc-500">
              / {totalPages}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-zinc-400 hover:text-white" 
              onClick={nextPage} 
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center bg-zinc-800/50 rounded-lg p-1 border border-white/5 mr-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-zinc-400 hover:text-white" 
              onClick={() => setZoom(z => Math.max(z - 0.1, 0.75))}
              disabled={zoom <= 0.75}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-[10px] font-medium px-1.5 min-w-[40px] text-center text-zinc-400">
              {Math.round(zoom * 100)}%
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-zinc-400 hover:text-white" 
              onClick={() => setZoom(z => Math.min(z + 0.1, 1.5))}
              disabled={zoom >= 1.5}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 text-zinc-400 hover:text-white hidden sm:flex ${isFullScreen ? "text-indigo-400" : ""}`}
            onClick={toggleFullScreen}
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Reader Content Area */}
      <main className="flex-1 overflow-auto bg-zinc-950 p-4 md:p-8 flex justify-center items-start">
        {/* Mock PDF Page */}
        <div 
          style={{ 
            transform: `scale(${zoom})`, 
            transformOrigin: "top center",
            transition: "transform 0.1s ease-out"
          }}
          className="w-full max-w-3xl bg-zinc-50 text-zinc-900 shadow-2xl rounded-lg min-h-[850px] p-8 md:p-16 relative flex flex-col mb-12"
        >
          {/* Header metadata inside book */}
          <div className="flex justify-between items-center text-[10px] text-zinc-400 uppercase tracking-widest border-b border-zinc-200 pb-3 mb-8">
            <span>{resource.category}</span>
            <span>Page {currentPage} of {totalPages}</span>
          </div>

          {/* Book Content */}
          <div className="flex-1 flex flex-col">
            <h2 className="text-xl md:text-2xl font-bold text-zinc-800 mb-8 border-b border-zinc-100 pb-2">
              {chapter}
            </h2>
            <div className="whitespace-pre-wrap text-zinc-700 leading-relaxed text-sm md:text-base text-justify space-y-4">
              {text.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Footer inside book */}
          <div className="text-[10px] text-zinc-400 text-center border-t border-zinc-200 pt-4 mt-8">
            {resource.title} &bull; {resource.author}
          </div>
        </div>
      </main>
    </div>
  );
}
