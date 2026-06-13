"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, Heart } from "lucide-react";

interface GalleryItem {
  id: number;
  title: string;
  artist: string;
  category: string;
  src: string;
  tags: string[];
  likes: string;
  tools: string[];
}

const galleryData: GalleryItem[] = [
  {
    id: 1,
    title: "Cyberpunk Kunoichi",
    artist: "Kaelen V.",
    category: "Sci-Fi Manga",
    src: "/gallery_cyberpunk.png",
    tags: ["Cyberpunk", "Kunoichi", "Neon"],
    likes: "2.4k",
    tools: ["Assistente de Esboço IA", "Estúdio de Arte-Final"],
  },
  {
    id: 2,
    title: "Silent Breath",
    artist: "Hina Satou",
    category: "Anime Portrait",
    src: "/frames/img002.jpg",
    tags: ["Slice of Life", "Anime", "Portrait"],
    likes: "1.8k",
    tools: ["Estúdio de Arte-Final", "Retículas"],
  },
  {
    id: 3,
    title: "Arcane Sorceress",
    artist: "Marcus A.",
    category: "Fantasy Ink",
    src: "/gallery_wizard.png",
    tags: ["Fantasy", "Sorceress", "Mystic"],
    likes: "3.1k",
    tools: ["Assistente de Esboço IA", "Diagramação de Mangá"],
  },
  {
    id: 4,
    title: "Awakened Power",
    artist: "Hina Satou",
    category: "Anime Portrait",
    src: "/frames/img100.jpg",
    tags: ["Action", "Shonen", "Power"],
    likes: "2.2k",
    tools: ["Estúdio de Arte-Final", "Lavagem de Cor"],
  },
  {
    id: 5,
    title: "Custom Manga Art",
    artist: "Você (Upload)",
    category: "Action Shonen",
    src: "/gallery_action.png",
    tags: ["Manga", "Action", "Custom"],
    likes: "4.5k",
    tools: ["Diagramação de Mangá", "Estúdio de Arte-Final"],
  },
  {
    id: 6,
    title: "Calm Horizon",
    artist: "Hina Satou",
    category: "Anime Portrait",
    src: "/frames/img120.jpg",
    tags: ["Drama", "Seinen", "Portrait"],
    likes: "1.5k",
    tools: ["Estúdio de Arte-Final", "Predefinições de Pincel"],
  },
  {
    id: 7,
    title: "Celestial Sakura",
    artist: "Você (Upload)",
    category: "Fantasy Ink",
    src: "/3 (2)_telea.png",
    tags: ["Manga", "Cherry Blossom", "Fantasy"],
    likes: "5.2k",
    tools: ["Assistente de Esboço IA", "Estúdio de Arte-Final"],
  },
  {
    id: 8,
    title: "Summer Walk",
    artist: "Você (Upload)",
    category: "Anime Portrait",
    src: "/gallery_43.png",
    tags: ["Slice of Life", "Anime", "Couple"],
    likes: "6.7k",
    tools: ["Assistente de Esboço IA", "Estúdio de Arte-Final"],
  },
];

export default function Gallery() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <section id="gallery" className="py-24 relative overflow-hidden bg-brand-bg bg-manga-draft-grid bg-manga-screentone">
      <div className="absolute top-[30%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-brand-cyan/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-brand-purple/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold tracking-widest text-brand-pink uppercase mb-3">
            Vitrine do Criador
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Forjado por{" "}
            <span className="bg-gradient-to-r from-brand-pink via-brand-purple to-brand-cyan bg-clip-text text-transparent">
              Nossa Comunidade
            </span>
          </h3>
          <p className="text-slate-400 font-light max-w-xl mx-auto text-sm sm:text-base">
            Inspire-se com trabalhos incríveis desenvolvidos por artistas beta. De artes conceituais a páginas completas prontas para impressão.
          </p>
        </div>

        {/* Gallery Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 min-h-[400px]"
        >
          <AnimatePresence mode="popLayout">
            {galleryData.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group relative overflow-hidden manga-card-panel manga-crop-marks cursor-pointer flex flex-col"
                whileHover={{ y: -6 }}
              >
                {/* Aspect Ratio Box */}
                <div className="relative w-full aspect-[4/5] bg-slate-950 overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-500 scale-100 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  
                  {/* Zoom overlay on hover */}
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-white bg-brand-purple/80 backdrop-blur-md px-4 py-2 rounded-full border border-brand-purple/30 shadow-glow-purple">
                      <Maximize2 className="w-3.5 h-3.5" />
                      Visualizar
                    </span>
                  </div>
                </div>
                
                {/* Static Caption - Always visible */}
                <div className="p-4.5 bg-[#0C0915] border-t border-white/5 flex flex-col justify-between flex-grow">
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-brand-pink transition-colors truncate max-w-[70%]">
                      {item.title}
                    </h4>
                    <span className="text-[8px] sm:text-[9px] font-mono text-brand-cyan uppercase tracking-wider bg-brand-cyan/5 border border-brand-cyan/20 px-2 py-0.5 rounded flex-shrink-0 self-center">
                      {item.category}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-slate-400 font-light pt-2.5 border-t border-white/5">
                    <span>
                      por <strong className="font-semibold text-slate-300">{item.artist}</strong>
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-300">
                      <Heart className="w-3.5 h-3.5 text-brand-pink fill-brand-pink" />
                      <span>{item.likes}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>


      {/* Lightbox / Details Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full max-w-4xl manga-card-panel manga-crop-marks overflow-hidden flex flex-col md:grid md:grid-cols-12 max-h-[85vh] md:max-h-[600px] z-10"
            >
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-brand-bg/85 border border-white/10 hover:border-brand-pink/50 text-slate-300 hover:text-white transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Left Column: Image (Grid 7) */}
              <div className="relative md:col-span-7 aspect-[4/5] md:aspect-auto md:h-full bg-slate-950 flex items-center justify-center overflow-hidden">
                <Image
                  src={selectedItem.src}
                  alt={selectedItem.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>

              {/* Right Column: Metadata (Grid 5) */}
              <div className="p-6 md:p-8 md:col-span-5 flex flex-col justify-between overflow-y-auto max-h-[40vh] md:max-h-full">
                <div>
                  
                  {/* Category / Artist */}
                  <span className="text-[10px] font-bold text-brand-cyan tracking-widest uppercase mb-1.5 block">
                    {selectedItem.category}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                    {selectedItem.title}
                  </h3>
                  <p className="text-sm font-light text-slate-400 mb-6">
                    Desenho por <span className="font-semibold text-slate-200">{selectedItem.artist}</span>
                  </p>

                  <div className="h-px bg-white/5 my-4" />

                  {/* Tools list */}
                  <div className="mb-6">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2.5">
                      Recursos Utilizados
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedItem.tools.map((tool) => (
                        <span
                          key={tool}
                          className="px-2.5 py-1 rounded bg-brand-purple/10 border border-brand-purple/20 text-[10px] text-brand-purple font-semibold uppercase tracking-wider"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tag list */}
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2.5">
                      Tags
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedItem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] text-slate-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Simulated Like Actions / Download */}
                <div className="pt-6 border-t border-white/5 mt-8 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-slate-300">
                    <Heart className="w-4 h-4 text-brand-pink fill-brand-pink" />
                    <span className="font-semibold">{selectedItem.likes} Curtidas</span>
                  </div>
                  <button 
                    onClick={() => {
                      alert("Download indisponível na versão de demonstração.");
                    }}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all duration-200"
                  >
                    Baixar Recurso
                  </button>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
