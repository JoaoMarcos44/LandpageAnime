"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Users, Zap, Brain, LayoutGrid, Paintbrush, Download, Check } from "lucide-react";

const benefits = [
  {
    icon: Brain,
    color: "text-brand-cyan",
    bg: "from-brand-purple/20 to-[#0C0914]",
    border: "border-brand-purple/30",
    title: "Assistente de Esboço IA",
    points: [
      "Suavização inteligente de traço",
      "Reconhecimento de poses em 3D",
      "Proporções anatômicas de mangá",
    ],
  },
  {
    icon: LayoutGrid,
    color: "text-brand-cyan",
    bg: "from-brand-purple/20 to-[#0C0914]",
    border: "border-brand-purple/30",
    title: "Diagramação Dinâmica",
    points: [
      "Grades magnéticas inteligentes",
      "Linhas de velocidade e balões",
      "Corte e divisão de painéis livre",
    ],
  },
  {
    icon: Paintbrush,
    color: "text-brand-cyan",
    bg: "from-brand-purple/20 to-[#0C0914]",
    border: "border-brand-purple/30",
    title: "Estúdio de Arte-Final",
    points: [
      "Penas virtuais (G-Pen e Maru)",
      "Sensibilidade a pressão real",
      "Retículas clássicas de impressão",
    ],
  },
  {
    icon: Download,
    color: "text-brand-cyan",
    bg: "from-brand-purple/20 to-[#0C0914]",
    border: "border-brand-purple/30",
    title: "Exportação Profissional",
    points: [
      "Camadas organizadas em PSD",
      "Perfis de cor RGB e CMYK físico",
      "Formatos prontos para Webtoon",
    ],
  },
];

const avatars = [
  "/avatar_thiago.png",
  "/avatar_mariana.png",
  "/avatar_felipe.png",
  "/avatar_raphael.png"
];

export default function HeroCTA() {
  return (
    <section id="features" className="relative bg-brand-bg bg-manga-draft-grid bg-manga-screentone overflow-hidden py-20">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-purple/20 to-transparent" />
      <div className="absolute top-[30%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-brand-pink/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[25vw] h-[25vw] rounded-full bg-brand-purple/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Social proof bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {avatars.map((src, i) => (
                <div
                  key={i}
                  className="relative w-8 h-8 rounded-full border-2 border-brand-bg overflow-hidden shadow-glow-purple"
                >
                  <Image
                    src={src}
                    alt={`Avatar ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-400 font-light">
              <Users className="w-4 h-4 text-brand-cyan flex-shrink-0" />
              <span>
                <strong className="text-brand-cyan font-semibold">12.5k+</strong> artistas já na fila de espera
              </span>
            </div>
          </div>

          <span className="hidden sm:block text-slate-700">·</span>

          <motion.a
            href="/#cta"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-gradient-to-r from-brand-purple to-brand-pink text-xs font-bold text-white uppercase tracking-wider shadow-glow-purple hover:shadow-glow-pink transition-shadow duration-200"
          >
            <Zap className="w-3.5 h-3.5" />
            Garantir Minha Vaga
          </motion.a>
        </motion.div>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-xs sm:text-sm font-bold tracking-widest text-brand-cyan uppercase mb-3 font-mono">
            Por que o MangaForge?
          </h2>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Tudo que você precisa para{" "}
            <span className="bg-gradient-to-r from-brand-purple via-brand-pink to-brand-cyan bg-clip-text text-transparent">
              publicar seu mangá
            </span>
          </h3>
          <p className="text-sm sm:text-base text-slate-400 font-light mt-4 max-w-2xl mx-auto leading-relaxed">
            Unimos inteligência de ponta a uma interface intuitiva, otimizando o fluxo de produção do rascunho até a exportação profissional.
          </p>
        </motion.div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`group relative p-7 sm:p-8 manga-card-panel manga-crop-marks flex flex-col justify-between`}
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 ${b.color} border border-white/5 group-hover:border-brand-cyan/30 transition-colors duration-300`}>
                    <Icon className="w-6.5 h-6.5" />
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white mb-4 leading-snug">{b.title}</h4>
                  <ul className="space-y-2.5">
                    {b.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 font-light leading-normal">
                        <Check className="w-3.5 h-3.5 text-brand-cyan flex-shrink-0 mt-0.5 opacity-80" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
