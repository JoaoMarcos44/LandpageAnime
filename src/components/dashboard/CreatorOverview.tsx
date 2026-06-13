"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  RadialBarChart, 
  RadialBar, 
  AreaChart, 
  Area, 
  ResponsiveContainer 
} from "recharts";
import { Activity, FileText, CheckCircle, Zap } from "lucide-react";

// Mock data for the velocity sparkline (gráfico simplificado)
const sparklineData = [
  { name: "Seg", lines: 120 },
  { name: "Ter", lines: 180 },
  { name: "Qua", lines: 140 },
  { name: "Qui", esboços: 250 },
  { name: "Sex", lines: 190 },
  { name: "Sáb", lines: 310 },
  { name: "Dom", lines: 340 },
];

const progressData = [
  {
    name: "Progresso",
    value: 72,
    fill: "#06B6D4", // Neon Cyan
  },
];

export default function CreatorOverview() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (custom: number) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: custom * 0.1, ease: "easeOut" as const }
    })
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        
        {/* Bento Card 1: Total Progress (circular ring) */}
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="rounded-2xl glass-card bg-white/[0.03] border-white/10 p-5 flex flex-col justify-between items-center relative overflow-hidden h-[190px]"
        >
          <div className="w-full flex justify-between items-center z-10">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              Conclusão Capítulo
            </span>
            <CheckCircle className="w-4 h-4 text-brand-cyan" />
          </div>

          <div className="relative w-full h-[100px] flex items-center justify-center">
            {mounted ? (
              <>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white text-neon-glow-cyan">72%</span>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="70%"
                    outerRadius="95%"
                    barSize={6}
                    data={progressData}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <RadialBar
                      background={{ fill: "rgba(255, 255, 255, 0.03)" }}
                      dataKey="value"
                      cornerRadius={10}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </>
            ) : (
              <div className="w-16 h-16 rounded-full border-2 border-white/5 animate-pulse" />
            )}
          </div>

          <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-wider z-10">
            Fase de Retículas (Toning)
          </span>
        </motion.div>

        {/* Bento Card 2: Active Chapters list */}
        <motion.div
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="rounded-2xl glass-card bg-white/[0.03] border-white/10 p-5 flex flex-col justify-between h-[190px]"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              Capítulos Ativos
            </span>
            <FileText className="w-4 h-4 text-brand-pink" />
          </div>

          <div className="space-y-2 flex-grow overflow-y-auto pr-1">
            <div className="flex items-center justify-between text-xs border-b border-white/5 pb-1.5">
              <span className="text-slate-300 font-medium">Cap 04 - Destino</span>
              <span className="px-2 py-0.5 rounded text-[9px] bg-brand-purple/20 border border-brand-purple/30 text-brand-purple font-semibold">
                Esboço
              </span>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-white/5 pb-1.5">
              <span className="text-slate-300 font-medium">Cap 03 - O Encontro</span>
              <span className="px-2 py-0.5 rounded text-[9px] bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan font-semibold">
                Arte-Final
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Cap 02 - O Despertar</span>
              <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-semibold">
                Publicado
              </span>
            </div>
          </div>
        </motion.div>

        {/* Bento Card 3: Creative Velocity sparkline */}
        <motion.div
          custom={2}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="rounded-2xl glass-card bg-white/[0.03] border-white/10 p-5 flex flex-col justify-between h-[190px]"
        >
          <div className="flex justify-between items-center z-10">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              Velocidade Criativa
            </span>
            <Activity className="w-4 h-4 text-brand-purple" />
          </div>

          {/* Sparkline container */}
          <div className="w-full h-[70px] mt-2 mb-2">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="glowPurple" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="lines"
                    stroke="#A855F7"
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#glowPurple)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-white/5 rounded animate-pulse" />
            )}
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 z-10">
            <span>Prod. Média</span>
            <span className="text-brand-purple font-semibold">+24% vs ontem</span>
          </div>
        </motion.div>

        {/* Bento Card 4: System/Engine Status */}
        <motion.div
          custom={3}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="rounded-2xl glass-card bg-white/[0.03] border-white/10 p-5 flex flex-col justify-between h-[190px]"
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              Status do Motor
            </span>
            <Zap className="w-4 h-4 text-yellow-400" />
          </div>

          {/* Pulsating system indicator */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative flex items-center justify-center w-10 h-10 mb-2">
              <span className="absolute w-6 h-6 rounded-full bg-brand-cyan/20 animate-ping" />
              <span className="absolute w-4 h-4 rounded-full bg-brand-cyan/40 animate-pulse" />
              <div className="w-2.5 h-2.5 rounded-full bg-brand-cyan shadow-glow-cyan" />
            </div>
            <span className="text-sm font-bold text-white tracking-wide">
              Forge AI Online
            </span>
          </div>

          <div className="text-center">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">
              Latência: 124ms
            </span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
