"use client";

import { motion } from "framer-motion";
import { Brain, LayoutGrid, Paintbrush, Download, ArrowRight } from "lucide-react";

const featuresData = [
  {
    title: "Assistente de Esboço IA",
    description: "Transforme rabiscos rápidos em line-arts limpas e detalhadas instantaneamente. Nossa IA proprietária reconhece poses e proporções de mangá.",
    icon: Brain,
    color: "from-brand-purple to-indigo-500",
    shadow: "shadow-purple-500/10 hover:shadow-purple-500/20",
    glow: "border-brand-purple/20 hover:border-brand-purple/40",
    textColor: "text-brand-purple",
  },
  {
    title: "Diagramação de Mangá",
    description: "Crie painéis de quadrinhos dinâmicos com grades magnéticas de arrastar e soltar. Adicione linhas de velocidade, balões de diálogo e onomatopeias.",
    icon: LayoutGrid,
    color: "from-brand-pink to-rose-500",
    shadow: "shadow-pink-500/10 hover:shadow-pink-500/20",
    glow: "border-brand-pink/20 hover:border-brand-pink/40",
    textColor: "text-brand-pink",
  },
  {
    title: "Estúdio de Arte-Final",
    description: "Pincéis vetoriais sensíveis à pressão que simulam penas profissionais G-pen, Maru-pen e pincéis de nanquim com estabilização inteligente.",
    icon: Paintbrush,
    color: "from-brand-cyan to-blue-500",
    shadow: "shadow-cyan-500/10 hover:shadow-cyan-500/20",
    glow: "border-brand-cyan/20 hover:border-brand-cyan/40",
    textColor: "text-brand-cyan",
  },
  {
    title: "Exportação em Um Clique",
    description: "Exporte páginas individuais ou capítulos inteiros em alta resolução, otimizados para plataformas webtoon, e-pub ou impressão física (CMYK).",
    icon: Download,
    color: "from-brand-cyan to-brand-purple",
    shadow: "shadow-cyan-500/10 hover:shadow-cyan-500/20",
    glow: "border-brand-cyan/20 hover:border-brand-cyan/40",
    textColor: "text-brand-cyan",
  },
];

export default function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section id="features" className="py-24 relative overflow-hidden bg-brand-bg">
      {/* Background decoration elements */}
      <div className="absolute top-[20%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-brand-pink/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-brand-purple/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            className="text-xs font-bold tracking-widest text-brand-cyan uppercase mb-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Poder de Criação Sem Limites
          </motion.h2>
          
          <motion.h3 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Ferramentas Profissionais,{" "}
            <span className="bg-gradient-to-r from-brand-purple via-brand-pink to-brand-cyan bg-clip-text text-transparent">
              Fluxo Otimizado
            </span>
          </motion.h3>
          
          <motion.p 
            className="text-slate-400 text-base sm:text-lg font-light leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            MangaForge revoluciona o processo criativo fornecendo tudo que você precisa para desenhar mangás do rascunho inicial à publicação final em um só lugar.
          </motion.p>
        </div>

        {/* Features Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {featuresData.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.01 }}
                className={`group relative p-8 rounded-2xl glass-card ${feature.glow} ${feature.shadow} transition-all duration-300 flex flex-col justify-between overflow-hidden`}
              >
                {/* Hover Glow Effect */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-[0.02] group-hover:opacity-10 blur-2xl transition-opacity duration-500 pointer-events-none`} />

                <div>
                  {/* Icon Box */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feature.color} p-[1px] mb-6 flex items-center justify-center`}>
                    <div className="w-full h-full bg-[#0E0B1A]/90 rounded-[11px] flex items-center justify-center">
                      <Icon className={`w-6 h-6 ${feature.textColor}`} />
                    </div>
                  </div>

                  {/* Feature Title */}
                  <h4 className="text-xl font-bold text-white mb-3 tracking-wide">
                    {feature.title}
                  </h4>

                  {/* Feature Description */}
                  <p className="text-slate-400 text-sm font-light leading-relaxed mb-8">
                    {feature.description}
                  </p>
                </div>

                {/* Animated Learn More Button */}
                <a 
                  href="/#cta" 
                  className={`inline-flex items-center text-xs font-semibold uppercase tracking-wider ${feature.textColor} group-hover:translate-x-1.5 transition-transform duration-300`}
                >
                  Experimentar
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </a>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
