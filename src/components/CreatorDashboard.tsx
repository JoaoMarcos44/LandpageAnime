"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  RadialBarChart,
  RadialBar
} from "recharts";
import { Sparkles, Calendar, TrendingUp, Users, Box, Zap } from "lucide-react";

// Mock data for the AreaChart (Velocidade de Criação)
const speedData = [
  { name: "Seg", esboços: 4, páginas: 1 },
  { name: "Ter", esboços: 6, páginas: 2 },
  { name: "Qua", esboços: 3, páginas: 1 },
  { name: "Qui", esboços: 8, páginas: 3 },
  { name: "Sex", esboços: 5, páginas: 2 },
  { name: "Sáb", esboços: 9, páginas: 4 },
  { name: "Dom", esboços: 11, páginas: 5 },
];

// Mock data for the RadialBarChart (Progresso do Mangá)
const progressData = [
  {
    name: "Progresso",
    value: 72,
    fill: "#EC4899", // Neon pink
  },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  label?: string;
}

// Custom Tooltip for AreaChart
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0E0C17]/90 backdrop-blur-md border border-white/10 p-3.5 rounded-xl shadow-glow-purple text-xs font-mono">
        <p className="text-slate-300 font-bold mb-2 border-b border-white/5 pb-1">{label}</p>
        {payload.map((p) => (
          <div key={p.name} className="flex justify-between gap-6 py-0.5">
            <span className="capitalize" style={{ color: p.color }}>
              {p.name}:
            </span>
            <span className="font-bold text-white">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function CreatorDashboard() {
  const [mounted, setMounted] = useState(false);

  // Prevent SSR Hydration Mismatch for SVG Recharts
  useEffect(() => {
    setMounted(true);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: custom * 0.15,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <section id="dashboard" className="py-24 relative overflow-hidden bg-brand-bg bg-manga-draft-grid bg-manga-screentone">
      <div className="absolute top-[10%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-brand-purple/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-brand-cyan/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-purple/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-semibold uppercase tracking-wider mb-4">
            <TrendingUp className="w-3.5 h-3.5 text-brand-purple" />
            Estatísticas de Criação
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Painel do{" "}
            <span className="bg-gradient-to-r from-brand-purple to-brand-pink bg-clip-text text-transparent text-neon-glow-purple">
              Criador
            </span>
          </h2>
          
          <p className="text-slate-400 font-light max-w-xl mx-auto text-sm sm:text-base">
            Acompanhe seu progresso artístico, ritmo de desenho e dados de engajamento da comunidade em tempo real.
          </p>
        </div>

        {/* Dashboard grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          
          {/* Card 1: AreaChart (Occupies 2 columns on desktop) */}
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-2 p-6 manga-card-panel manga-crop-marks flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-wide">
                    Velocidade de Criação
                  </h3>
                  <p className="text-xs text-slate-400 font-light mt-0.5">
                    Produção artística nos últimos 7 dias
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 px-2.5 py-1 rounded-full font-mono">
                  <Calendar className="w-3 h-3" />
                  Semanal
                </div>
              </div>

              {/* Chart container */}
              <div className="w-full h-[240px]">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={speedData}
                      margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="gradientEsboços" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#A855F7" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="gradientPáginas" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      
                      <XAxis 
                        dataKey="name" 
                        stroke="#475569" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      
                      <YAxis 
                        stroke="#475569" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      
                      <Tooltip content={<CustomTooltip />} />
                      
                      <Area
                        type="monotone"
                        dataKey="esboços"
                        stroke="#A855F7"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#gradientEsboços)"
                        name="esboços"
                      />
                      
                      <Area
                        type="monotone"
                        dataKey="páginas"
                        stroke="#06B6D4"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#gradientPáginas)"
                        name="páginas"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full bg-white/5 rounded-xl animate-pulse" />
                )}
              </div>
            </div>

            {/* Quick Chart Legend */}
            <div className="flex gap-4 border-t border-white/5 pt-4 mt-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-purple shadow-glow-purple" />
                <span className="text-slate-300">Esboços Diários</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-cyan shadow-glow-cyan" />
                <span className="text-slate-300">Páginas Concluídas</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: RadialBarChart (Circular Progress Ring) */}
          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="p-6 manga-card-panel manga-crop-marks flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">
                Progresso do Mangá
              </h3>
              <p className="text-xs text-slate-400 font-light mt-0.5 mb-6">
                Progresso atual do Projeto Alpha
              </p>

              {/* Radial Chart Container */}
              <div className="relative w-full h-[180px] flex items-center justify-center">
                {mounted ? (
                  <>
                    {/* Centered statistics label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-white text-neon-glow-cyan tracking-tight">72%</span>
                      <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mt-1">Concluído</span>
                    </div>
                    
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="75%"
                        outerRadius="105%"
                        barSize={8}
                        data={progressData}
                        startAngle={90}
                        endAngle={-270}
                      >
                        <RadialBar
                          background={{ fill: "rgba(255, 255, 255, 0.04)" }}
                          dataKey="value"
                          cornerRadius={10}
                          fill="#EC4899" // Neon Pink
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </>
                ) : (
                  <div className="w-36 h-36 rounded-full border-4 border-white/5 border-t-brand-purple animate-pulse" />
                )}
              </div>
            </div>

            {/* Legend detail bottom */}
            <div className="border-t border-white/5 pt-4 text-xs text-slate-300 flex justify-between items-center mt-6">
              <span>Capítulo 4 (Lineart)</span>
              <span className="text-brand-pink font-semibold">18 / 25 págs.</span>
            </div>
          </motion.div>

          {/* Card 3: Quick Stats (Creator Info statistics) */}
          <motion.div
            custom={2}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="p-6 manga-card-panel manga-crop-marks flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">
                Métricas Rápidas
              </h3>
              <p className="text-xs text-slate-400 font-light mt-0.5 mb-6">
                Estatísticas globais da comunidade
              </p>

              {/* Stat elements list */}
              <div className="space-y-4">
                
                {/* Stat 1 */}
                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="w-9 h-9 rounded-lg bg-brand-purple/10 flex items-center justify-center text-brand-purple flex-shrink-0">
                    <Zap className="w-5 h-5 text-brand-purple" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Estilo Mais Usado</span>
                    <span className="text-sm font-bold text-white">Shōnen</span>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="w-9 h-9 rounded-lg bg-brand-pink/10 flex items-center justify-center text-brand-pink flex-shrink-0">
                    <Users className="w-5 h-5 text-brand-pink" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Criadores Ativos</span>
                    <span className="text-sm font-bold text-white">12,480</span>
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="w-9 h-9 rounded-lg bg-brand-cyan/10 flex items-center justify-center text-brand-cyan flex-shrink-0">
                    <Box className="w-5 h-5 text-brand-cyan" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Novos Assets</span>
                    <span className="text-sm font-bold text-white">+1,450 esta semana</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Action pill details */}
            <div className="border-t border-white/5 pt-4 text-xs text-brand-cyan font-semibold flex items-center gap-1.5 mt-6 cursor-pointer hover:underline">
              <Sparkles className="w-3.5 h-3.5" />
              Explorar Comunidade
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
