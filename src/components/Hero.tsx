"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Sparkles, ChevronRight, Zap } from "lucide-react";

// ---------- frame list ----------
// Only frames that physically exist in /public/frames
const FRAME_NUMBERS: readonly number[] = [
  ...Array.from({ length: 6 },  (_, i) => i + 1),   // img001–img006
  ...Array.from({ length: 46 }, (_, i) => i + 88),  // img088–img133
];
const TOTAL_FRAMES = FRAME_NUMBERS.length; // 52

// ---------- animation constants ----------
const BREATHING_PERIOD = 16; // seconds per full inhale+exhale cycle
const LERP_FACTOR      = 0.06;

// ---------- module-level image cache ----------
// Survives React StrictMode double-mount in dev without refetching
const cache: (HTMLImageElement | null)[] = [];
let cachePercent   = 0;
let cacheStarted   = false;
let cacheCallbacks: Array<(pct: number) => void> = [];

function startPreload() {
  if (cacheStarted && cache.length === TOTAL_FRAMES) return;

  if (cache.length !== TOTAL_FRAMES) {
    cache.length    = 0;
    cachePercent    = 0;
    cacheStarted    = false;
  }

  cacheStarted = true;
  for (let i = 0; i < TOTAL_FRAMES; i++) cache.push(null);

  let loaded = 0;
  const onLoad = () => {
    loaded++;
    cachePercent = Math.round((loaded / TOTAL_FRAMES) * 100);
    cacheCallbacks.forEach((cb) => cb(cachePercent));
  };

  FRAME_NUMBERS.forEach((num, i) => {
    const img = new window.Image();
    img.onload  = onLoad;
    img.onerror = onLoad;
    img.src = `/frames/img${String(num).padStart(3, "0")}.jpg`;
    cache[i] = img;
  });
}

// ---------- FrameAnimator ----------
function FrameAnimator() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number | null>(null);

  // animation state kept in refs to avoid triggering re-renders mid-loop
  const currentRef    = useRef(1);
  const targetRef     = useRef(1);
  const lastIndexRef  = useRef(-1);  // skip draw when frame hasn't changed
  const isHovered     = useRef(false);
  const isDragging    = useRef(false);
  const dragStartX    = useRef(0);
  const dragStartFrame= useRef(1);

  const [displayFrame, setDisplayFrame] = useState(1);
  const [isPlaying,    setIsPlaying]    = useState(true);
  const [loadPct,      setLoadPct]      = useState(cachePercent);

  // ---------- preload ----------
  useEffect(() => {
    const onProgress = (pct: number) => {
      setLoadPct(pct);
      if (pct > 0 && canvasRef.current && cache[0]?.complete) {
        const ctx = canvasRef.current.getContext("2d");
        ctx?.drawImage(cache[0]!, 0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    };

    cacheCallbacks.push(onProgress);
    startPreload();

    if (cachePercent === 100 && canvasRef.current && cache[0]) {
      const ctx = canvasRef.current.getContext("2d");
      ctx?.drawImage(cache[0]!, 0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    return () => { cacheCallbacks = cacheCallbacks.filter((cb) => cb !== onProgress); };
  }, []);

  // ---------- canvas resolution ----------
  useEffect(() => {
    if (!canvasRef.current) return;
    canvasRef.current.width  = 720;  // 360 × 2
    canvasRef.current.height = 1280; // 640 × 2
  }, []);

  // ---------- render loop ----------
  useEffect(() => {
    const tick = () => {
      const canvas = canvasRef.current;
      if (canvas && cache.length === TOTAL_FRAMES && loadPct === 100) {
        // drive target with sine wave when idle
        if (!isHovered.current && !isDragging.current && isPlaying) {
          const t = Date.now() / 1000;
          const norm = (Math.sin((t / BREATHING_PERIOD) * Math.PI * 2) + 1) / 2;
          targetRef.current = 1 + norm * (TOTAL_FRAMES - 1);
        }

        const clamped = Math.max(1, Math.min(TOTAL_FRAMES, targetRef.current));
        currentRef.current += (clamped - currentRef.current) * LERP_FACTOR;
        currentRef.current  = Math.max(1, Math.min(TOTAL_FRAMES, currentRef.current));

        const idx = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(currentRef.current)));

        // only redraw + setState when the visible frame index changes
        if (idx !== lastIndexRef.current) {
          const img = cache[idx - 1];
          if (img?.complete && img.naturalWidth !== 0) {
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
            lastIndexRef.current = idx;
            setDisplayFrame(idx);
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isPlaying, loadPct]);

  // ---------- mouse ----------
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || loadPct < 100) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - left) / width));
    targetRef.current = pct * (TOTAL_FRAMES - 1) + 1;
  };
  const handleMouseEnter = () => { isHovered.current = true; };
  const handleMouseLeave = () => { isHovered.current = false; };

  // ---------- touch ----------
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (loadPct < 100) return;
    isDragging.current   = true;
    dragStartX.current   = e.touches[0].clientX;
    dragStartFrame.current = currentRef.current;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging.current || !containerRef.current || loadPct < 100) return;
    const { width } = containerRef.current.getBoundingClientRect();
    const delta = ((e.touches[0].clientX - dragStartX.current) / width) * TOTAL_FRAMES;
    const raw   = dragStartFrame.current - delta;
    // wrap with modulo instead of while-loop
    targetRef.current = ((raw - 1) % TOTAL_FRAMES + TOTAL_FRAMES) % TOTAL_FRAMES + 1;
  };

  const handleTouchEnd = () => { isDragging.current = false; };

  // ---------- derived display values ----------
  const frameLabel = String(FRAME_NUMBERS[displayFrame - 1] ?? displayFrame).padStart(3, "0");
  const lastLabel  = String(FRAME_NUMBERS[TOTAL_FRAMES - 1]).padStart(3, "0");

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-full flex flex-col items-center justify-center bg-[#07050A] rounded-xl overflow-hidden select-none border border-white/5 cursor-grab active:cursor-grabbing"
    >
      {/* canvas */}
      <div className="relative w-full aspect-[9/16] max-h-[420px] flex items-center justify-center overflow-hidden pointer-events-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover opacity-90 transition-opacity duration-300"
        />

        {/* holographic grid */}
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

        {/* top HUD */}
        <div className="absolute inset-x-4 top-4 flex justify-between items-start text-[10px] font-mono text-brand-cyan/80 pointer-events-none select-none">
          <div className="bg-brand-bg/65 backdrop-blur-md px-2 py-1 rounded border border-brand-cyan/20 flex flex-col gap-0.5">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              LIVE PREVIEW
            </span>
            <span>FPS: 60.0</span>
          </div>
          <div className="bg-brand-bg/65 backdrop-blur-md px-2 py-1 rounded border border-brand-purple/20 flex flex-col items-end gap-0.5">
            <span className="text-brand-purple">RESOLUÇÃO: 1080x1920</span>
            <span>FRAME: {frameLabel}/{lastLabel}</span>
          </div>
        </div>

        {/* bottom HUD */}
        <div className="absolute inset-x-4 bottom-4 flex justify-between items-center text-[10px] font-mono text-slate-300 pointer-events-none select-none">
          <div className="bg-brand-bg/75 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-ping" />
            <span className="text-brand-cyan">AI SKETCH: ACTIVE</span>
          </div>
          <div className="bg-brand-bg/75 backdrop-blur-md px-2.5 py-1 rounded border border-white/10">
            STRETCH: 100%
          </div>
        </div>

        {loadPct < 100 && (
          <div className="absolute top-2 right-2 text-[8px] font-mono text-brand-pink/50">
            Buffering: {loadPct}%
          </div>
        )}
      </div>

      {/* control bar */}
      <div className="w-full bg-[#0C0914] border-t border-white/5 px-4 py-2.5 flex items-center justify-between z-10 pointer-events-auto">
        <button
          onClick={(e) => { e.stopPropagation(); setIsPlaying((p) => !p); }}
          className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all duration-200"
        >
          <Play className={`w-3.5 h-3.5 ${isPlaying ? "text-brand-pink fill-brand-pink" : "text-brand-cyan"}`} />
          {isPlaying ? "Pausar" : "Reproduzir"}
        </button>
        <span className="text-[10px] font-mono text-slate-500">
          MangaForge Render Engine v1.0
        </span>
      </div>
    </div>
  );
}

// ---------- Hero ----------
export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yBg        = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityText= useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[85vh] pt-24 pb-8 flex items-center justify-center overflow-hidden grid-bg"
    >
      {/* ambient glows */}
      <motion.div
        style={{ y: yBg }}
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      >
        <div className="absolute top-[10%] left-[5%]   w-[35vw] h-[35vw] rounded-full bg-brand-purple/15 blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[40%] right-[5%]  w-[30vw] h-[30vw] rounded-full bg-brand-cyan/15   blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[25%] w-[40vw] h-[40vw] rounded-full bg-brand-pink/10  blur-[150px] animate-pulse-slow" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* left: text */}
          <motion.div
            style={{ opacity: opacityText }}
            className="lg:col-span-7 flex flex-col justify-center text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border-brand-purple/20 text-brand-cyan text-xs font-semibold tracking-wider uppercase mb-6 self-start">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-brand-pink" />
              Desenhe o Futuro com IA
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-none select-none">
              Dê Vida ao Seu Universo de{" "}
              <span className="relative inline-block mt-1 sm:mt-0">
                <span className="absolute inset-0 bg-gradient-to-r from-brand-purple via-brand-pink to-brand-cyan blur-md opacity-50" />
                <span className="relative bg-gradient-to-r from-brand-purple via-brand-pink to-brand-cyan bg-clip-text text-transparent text-neon-glow-purple">
                  Mangás & Desenhos
                </span>
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mb-6 leading-relaxed font-light">
              MangaForge une a precisão de um estúdio de ilustração profissional com a inovação da IA. Crie layouts de página dinâmicos, aperfeiçoe traços com IA e exporte em altíssima resolução com apenas um clique.
            </p>

            {/* stats */}
            <div className="border-t border-b border-white/5 py-4 mb-6 max-w-lg">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-pink bg-clip-text text-transparent">12.5k+</p>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-widest mt-1">Fila de Espera</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-brand-pink to-brand-cyan bg-clip-text text-transparent">85k+</p>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-widest mt-1">Arte-Finais</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-brand-cyan to-brand-purple bg-clip-text text-transparent">94.8%</p>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-widest mt-1">Aprovação</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <motion.a
                href="#cta"
                className="relative group inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-purple via-brand-pink to-brand-cyan shadow-glow-purple-lg hover:shadow-glow-pink-lg transition-all duration-300 overflow-hidden"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <Zap className="w-4 h-4 mr-2 text-brand-cyan fill-brand-cyan" />
                Experimentar Beta Grátis
              </motion.a>

              <motion.a
                href="#gallery"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white glass-card glass-card-hover border-white/10 hover:border-brand-cyan/40 transition-all duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Ver Galeria
                <ChevronRight className="w-4 h-4 ml-1.5" />
              </motion.a>
            </div>

            <p className="text-[8px] sm:text-[9px] text-slate-600 font-mono mt-4 leading-normal">
              * Dados baseados em relatórios de uso do servidor oficial no Discord (Abril/Junho 2026).
            </p>
          </motion.div>

          {/* right: tablet mockup */}
          <motion.div
            className="lg:col-span-5 relative flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            <div className="absolute w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-brand-purple/20 via-brand-pink/15 to-brand-cyan/20 blur-[60px] animate-pulse-slow pointer-events-none" />

            <div className="relative w-full max-w-[360px] sm:max-w-[380px] p-3 rounded-2xl bg-slate-950/70 border border-white/10 backdrop-blur-lg shadow-2xl shadow-brand-purple/10 flex flex-col justify-center animate-float-slow">
              <div className="absolute top-[6px] left-[50%] -translate-x-[50%] w-1.5 h-1.5 rounded-full bg-slate-800" />

              <FrameAnimator />

              {/* stylus */}
              <motion.div
                className="absolute right-[-40px] top-[40%] w-[12px] h-[150px] pointer-events-none hidden md:block"
                animate={{ y: [0, -20, 15, 0], x: [0, 5, -5, 0], rotate: [15, 20, 10, 15] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              >
                <div className="w-full h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 rounded-full border border-white/10 shadow-lg relative">
                  <div className="absolute bottom-6 left-[50%] -translate-x-[50%] w-1.5 h-6 rounded-full bg-brand-cyan animate-pulse shadow-glow-cyan" />
                  <div className="absolute bottom-0 left-[50%] -translate-x-[50%] w-0 h-0 border-l-[6px] border-r-[6px] border-t-[12px] border-l-transparent border-r-transparent border-t-slate-950" />
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-brand-bg to-transparent pointer-events-none" />
    </section>
  );
}
