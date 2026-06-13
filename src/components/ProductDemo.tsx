"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, LayoutGrid, Paintbrush, FileCode, CheckCircle, LucideIcon } from "lucide-react";
import Image from "next/image";

interface DemoFeature {
  id: number;
  title: string;
  desc: string;
  icon: LucideIcon;
  x: string; // Percentage position from left
  y: string; // Percentage position from top
  color: string;
}

const demoFeatures: DemoFeature[] = [
  {
    id: 1,
    title: "Assistente de Traço IA",
    desc: "Nossa IA detecta poses e anatomia de mangá automaticamente, transformando esboços rápidos em linhas limpas de alta qualidade.",
    icon: Sparkles,
    x: "55%",
    y: "40%",
    color: "bg-brand-purple border-brand-purple/40 shadow-glow-purple",
  },
  {
    id: 2,
    title: "Grades de Painéis Dinâmicos",
    desc: "Crie quadros arrastando e soltando guias inteligentes. Divida painéis livremente para criar layouts de páginas dinâmicos.",
    icon: LayoutGrid,
    x: "28%",
    y: "35%",
    color: "bg-brand-pink border-brand-pink/40 shadow-glow-pink",
  },
  {
    id: 3,
    title: "Estúdio de Retículas",
    desc: "Pinte texturas clássicas de retícula tradicional de forma dinâmica e procedural diretamente no canvas.",
    icon: Paintbrush,
    x: "72%",
    y: "65%",
    color: "bg-brand-cyan border-brand-cyan/40 shadow-glow-cyan",
  },
  {
    id: 4,
    title: "Camadas Vetoriais PSD",
    desc: "Exportação direta com camadas organizadas em canais separados de esboço, arte-final, retículas e balões de texto.",
    icon: FileCode,
    x: "15%",
    y: "75%",
    color: "bg-brand-cyan border-brand-cyan/40 shadow-glow-cyan",
  },
];

export default function ProductDemo() {
  const [activeFeature, setActiveFeature] = useState<DemoFeature | null>(demoFeatures[0]);

  return (
    <section id="demo" className="py-24 relative overflow-hidden bg-brand-bg bg-manga-draft-grid bg-manga-screentone">
      {/* Background ambient glowing spheres */}
      <div className="absolute top-[30%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-brand-purple/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[5%] w-[30vw] h-[30vw] rounded-full bg-brand-cyan/5 blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold tracking-widest text-brand-cyan uppercase mb-3 font-mono">
            O Produto em Movimento
          </h2>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Veja a Ferramenta{" "}
            <span className="bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-pink bg-clip-text text-transparent">
              em Ação
            </span>
          </h3>
          <p className="text-sm sm:text-base text-slate-400 font-light mt-4 max-w-2xl mx-auto leading-relaxed">
            Esqueça as explicações teóricas. Conheça a interface do editor e clique nos pontos de destaque para descobrir como a IA otimiza o seu fluxo de criação.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Interactive Workspace Mockup */}
          <div className="lg:col-span-8 relative">
            
            {/* Monitor container wrapper with cyber design */}
            <div className="relative p-2 sm:p-3 manga-card-panel manga-crop-marks overflow-hidden group select-none">
              
              {/* Top application window bar */}
              <div className="flex items-center gap-1.5 px-3 pb-3 pt-1 border-b border-white/5 mb-2 sm:mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] font-mono text-slate-500 ml-3 uppercase tracking-wider">MangaForge Editor — Canvas View v1.0.4</span>
              </div>
              
              {/* Product screenshot image */}
              <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-slate-900">
                <Image
                  src="/manga_editor_demo.png"
                  alt="Interface do Editor MangaForge"
                  fill
                  className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.01]"
                  priority
                />
                
                {/* Holographic grid overlay */}
                <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

                {/* Hotspot Pulse Pins */}
                {demoFeatures.map((f) => {
                  const Icon = f.icon;
                  const isActive = activeFeature?.id === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setActiveFeature(f)}
                      style={{ left: f.x, top: f.y }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none z-20 group/pin"
                    >
                      {/* Pulse rings */}
                      <span className="absolute inline-flex h-8 w-8 rounded-full bg-white/20 animate-ping opacity-60 pointer-events-none" />
                      <span className={`absolute inline-flex h-6 w-6 rounded-full opacity-70 animate-pulse pointer-events-none ${f.color}`} />
                      
                      {/* Central button icon */}
                      <div className={`relative flex items-center justify-center w-6.5 h-6.5 rounded-full border border-white/20 transition-all duration-300 text-white ${
                        isActive ? "scale-125 bg-white text-slate-950 shadow-lg" : "bg-slate-950/90 group-hover/pin:scale-110"
                      }`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Micro instruction tag */}
            <div className="text-center mt-4 text-[11px] font-mono text-slate-500 uppercase tracking-widest">
              💡 Clique nos marcadores brilhantes no canvas para explorar a interface
            </div>
          </div>

          {/* Right Column: Dynamic Feature detail display */}
          <div className="lg:col-span-4 flex flex-col justify-center min-h-[320px]">
            <AnimatePresence mode="wait">
              {activeFeature ? (
                <motion.div
                  key={activeFeature.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="manga-card-panel manga-crop-marks p-8 relative overflow-hidden bg-[#0C0914]/40"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/5 rounded-full blur-xl pointer-events-none" />
                  
                  {/* Icon header */}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 text-brand-cyan mb-5 border border-white/5">
                    {(() => {
                      const Icon = activeFeature.icon;
                      return <Icon className="w-6 h-6 text-brand-cyan" />;
                    })()}
                  </div>

                  <h4 className="text-xl font-bold text-white mb-3 tracking-tight">
                    {activeFeature.title}
                  </h4>
                  
                  <p className="text-slate-300 text-sm font-light leading-relaxed mb-6">
                    {activeFeature.desc}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-mono text-brand-pink uppercase tracking-widest font-semibold">
                    <CheckCircle className="w-4 h-4 text-brand-pink flex-shrink-0" />
                    <span>Recurso liberado no Beta</span>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center p-8 border border-dashed border-white/5 rounded-2xl bg-white/[0.02]">
                  <p className="text-slate-400 text-sm font-light">Selecione um recurso no editor para ver os detalhes.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
