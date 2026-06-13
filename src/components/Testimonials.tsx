"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Twitter } from "lucide-react";

interface TweetProps {
  name: string;
  handle: string;
  avatar: string;
  verified?: boolean;
  content: string;
  time: string;
  date: string;
  retweets: number;
  likes: number;
}

const tweets: TweetProps[] = [
  {
    name: "Raphael Salimena",
    handle: "@salimena",
    avatar: "/avatar_raphael.png",
    verified: true,
    content: "Finalmente pude testar o MangaForge no fluxo de produção da nova HQ e pqp... O snap automático de sarjeta e as retículas digitais são a coisa mais próxima do papel físico que já vi. Vale a pena de verdade testar o beta.",
    time: "11:42 AM",
    date: "6 de jun de 2026",
    retweets: 12,
    likes: 184,
  },
  {
    name: "Daniela \"Dany\" Marino",
    handle: "@danymarino",
    avatar: "/avatar_daniela.png",
    verified: true,
    content: "Participei do painel de feedback da comunidade ontem com os devs da MangaForge. É muito bom ver que estão ouvindo os artistas independentes pra ajustar os algoritmos de IA. Esse respeito à autoria é o que faltava no mercado.",
    time: "09:15 PM",
    date: "5 de jun de 2026",
    retweets: 8,
    likes: 96,
  },
  {
    name: "Thiago \"Kuro\" Santos",
    handle: "@kuro_art",
    avatar: "/avatar_thiago.png",
    verified: false,
    content: "Mano, de verdade? Tava com o pé atrás com essa parada de IA, mas o assistente de esboço adianta um lado bizarro. Não desenha por mim, mas pra limpar o traço e achar as poses mais difíceis economiza horas.",
    time: "02:30 PM",
    date: "4 de jun de 2026",
    retweets: 24,
    likes: 312,
  },
  {
    name: "Felipe \"Yoshi\" Nakata",
    handle: "@yoshi_nakata",
    avatar: "/avatar_felipe.png",
    verified: false,
    content: "O Studio de Nanquim simula muito bem a textura real da pena G e do pincel recarregável. A sensibilidade à pressão do tablet é excelente e as retículas dão aquela sensação clássica de mangá impresso.",
    time: "05:10 PM",
    date: "3 de jun de 2026",
    retweets: 15,
    likes: 245,
  },
  {
    name: "Mari Souza",
    handle: "@mari_quadrinhos",
    avatar: "/avatar_mariana.png",
    verified: false,
    content: "Amei a ferramenta de diagramação de páginas. Arrastar os painéis e ver as sarjetas se ajustarem sozinhas facilitou muito. É ótimo pra quem quer produzir rápido pra internet.",
    time: "10:20 AM",
    date: "2 de jun de 2026",
    retweets: 30,
    likes: 420,
  },
  {
    name: "Vitor Cafaggi",
    handle: "@vitorcafaggi",
    avatar: "/avatar_raphael.png", // Usando avatar existente como substituto visual
    verified: true,
    content: "Rapaz, o sistema de perspectiva guiada por inteligência artificial me salvou ontem pra desenhar os cenários do novo capítulo. Quem trabalha com prazo apertado sabe o quanto isso é ouro.",
    time: "04:30 PM",
    date: "1 de jun de 2026",
    retweets: 15,
    likes: 212,
  }
];

export default function Testimonials() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const tweetVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-[#0C0914] bg-manga-speedlines bg-manga-screentone">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/20 to-transparent" />
      <div className="absolute top-[20%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-brand-cyan/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[25vw] h-[25vw] rounded-full bg-brand-purple/5 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold tracking-widest text-brand-cyan uppercase mb-3 font-mono">
            MangaForge no X (ex-Twitter)
          </h2>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Quem usa na vida real,{" "}
            <span className="bg-gradient-to-r from-brand-purple via-brand-pink to-brand-cyan bg-clip-text text-transparent">
              compartilha
            </span>
          </h3>
          <p className="text-slate-400 font-light text-sm sm:text-base max-w-xl mx-auto">
            Veja o que os profissionais da cena nacional de quadrinhos estão comentando sobre nós nas redes.
          </p>
        </div>

        {/* Tweets Masonry / Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {tweets.map((tweet, i) => (
            <motion.div
              key={i}
              variants={tweetVariants}
              whileHover={{ y: -4 }}
              className="p-6 manga-card-panel manga-crop-marks relative flex flex-col justify-between"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10">
                    <Image
                      src={tweet.avatar}
                      alt={tweet.name}
                      fill
                      loading="lazy"
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-white">{tweet.name}</span>
                      {tweet.verified && <span className="text-brand-cyan text-[10px]">✓</span>}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{tweet.handle}</span>
                  </div>
                </div>
                <Twitter className="w-4 h-4 text-brand-cyan opacity-80" />
              </div>
              
              <p className="text-[13px] text-slate-300 leading-relaxed font-light mb-6 flex-grow">
                {tweet.content}
              </p>
              
              <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-white/5 pt-3">
                <span className="font-mono">{tweet.time} · {tweet.date}</span>
                <div className="flex gap-3 font-mono">
                  <span className="flex items-center gap-1 hover:text-brand-cyan cursor-pointer transition-colors">🔁 {tweet.retweets}</span>
                  <span className="flex items-center gap-1 hover:text-brand-pink cursor-pointer transition-colors">❤️ {tweet.likes}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
