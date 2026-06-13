"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Sparkles, LayoutDashboard } from "lucide-react";
import CreatorOverview from "@/components/dashboard/CreatorOverview";
import AIEditorChat from "@/components/dashboard/AIEditorChat";

export default function MentorDashboardPage() {
  return (
    <div className="min-h-screen bg-brand-bg text-slate-100 flex flex-col justify-start relative grid-bg pb-12">
      
      {/* Background ambient glowing spheres */}
      <div className="absolute top-[10%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-brand-purple/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[25vw] h-[25vw] rounded-full bg-brand-cyan/10 blur-[120px] pointer-events-none" />

      {/* Mini top bar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 flex justify-between items-center z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Home
        </Link>
        
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-purple via-brand-pink to-brand-cyan p-[1px]">
            <div className="w-full h-full bg-brand-bg rounded-[6px] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
            </div>
          </div>
          <span className="text-sm font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent tracking-wide">
            Manga<span className="text-brand-purple">Forge</span>
          </span>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 z-10 flex-grow">
        
        {/* Dashboard Title & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-left border-b border-white/5 pb-6"
        >
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-brand-pink text-xs font-semibold tracking-wider uppercase mb-3.5">
            <LayoutDashboard className="w-3.5 h-3.5" />
            Workspace
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2 leading-none">
            Painel do{" "}
            <span className="bg-gradient-to-r from-brand-purple to-brand-pink bg-clip-text text-transparent text-neon-glow-purple">
              Criador
            </span>
          </h1>
          <p className="text-sm text-slate-400 font-light">
            Acompanhe seu progresso artístico e consulte o AI Sensei.
          </p>
        </motion.div>

        {/* Bento Overview Section (Cards row) */}
        <div className="mb-8">
          <CreatorOverview />
        </div>

        {/* Double Columns: Chat & Guidelines */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Column 1: AI Chat co-pilot (8 columns) */}
          <div className="lg:col-span-8">
            <AIEditorChat />
          </div>

          {/* Column 2: Editor guidelines & tips (4 columns) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4 rounded-2xl glass-card border-white/5 bg-[#0E0C17]/65 p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-brand-pink" />
                <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
                  Guia do Sensei
                </h3>
              </div>
              
              <div className="space-y-4 text-xs font-light text-slate-400 leading-relaxed">
                <p>
                  Envie esboços para análise e faça perguntas como:
                </p>
                <ul className="space-y-2 list-disc list-inside text-slate-300">
                  <li><strong className="text-brand-cyan">“Como melhorar a perspectiva de profundidade desse quadro?”</strong></li>
                  <li><strong className="text-brand-purple">“A pose do meu guerreiro samurai está com anatomia correta?”</strong></li>
                  <li><strong className="text-brand-pink">“Essa espessura de nanquim encaixa no gênero Shōnen?”</strong></li>
                </ul>

                <div className="h-px bg-white/5 my-4" />

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest mb-1.5 font-bold">
                    Regra Geral do Editor
                  </p>
                  <p className="text-[11px]">
                    Esboços limpos e line-arts pretas sobre fundo branco garantem a maior precisão na detecção anatômica da inteligência artificial.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 mt-6 flex justify-between items-center text-[10px] font-mono text-slate-500">
              <span>MANGAFORGE SECURE LINK</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
            </div>
          </motion.div>

        </div>

      </main>
    </div>
  );
}
