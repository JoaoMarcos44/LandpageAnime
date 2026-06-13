"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Sparkles, ChevronRight, Zap } from "lucide-react";

// Explicit list of frame numbers that actually exist in /public/frames
const FRAME_NUMBERS: number[] = [
  ...Array.from({ length: 6 }, (_, i) => i + 1),    // img001–img006
  ...Array.from({ length: 46 }, (_, i) => i + 88),  // img088–img133
];

// Module-level global image cache to survive React StrictMode double-mounting in development.
const globalPreloadedImages: (HTMLImageElement | null)[] = [];
let globalLoadedPercent = 0;
let globalIsPreloadingStarted = false;
let globalLoadCallbacks: Array<(percent: number) => void> = [];

function startGlobalPreload() {
  const total = FRAME_NUMBERS.length;
  if (globalIsPreloadingStarted && globalPreloadedImages.length === total) return;

  if (globalPreloadedImages.length !== total) {
    globalPreloadedImages.length = 0;
    globalLoadedPercent = 0;
    globalIsPreloadingStarted = false;
  }

  globalIsPreloadingStarted = true;

  for (let i = 0; i < total; i++) globalPreloadedImages.push(null);

  let loadedCount = 0;
  const onImageLoad = () => {
    loadedCount++;
    globalLoadedPercent = Math.round((loadedCount / total) * 100);
    globalLoadCallbacks.forEach((cb) => cb(globalLoadedPercent));
  };

  FRAME_NUMBERS.forEach((num, i) => {
    const img = new window.Image();
    const numStr = String(num).padStart(3, "0");
    img.onload = onImageLoad;
    img.onerror = onImageLoad;
    img.src = `/frames/img${numStr}.jpg`;
    globalPreloadedImages[i] = img;
  });
}

// Custom Frame Animator for preloading and playing the 120 animation frames
function FrameAnimator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loadedPercent, setLoadedPercent] = useState(globalLoadedPercent);
  const totalFrames = FRAME_NUMBERS.length;
  const requestRef = useRef<number | null>(null);
  
  // Interactive / Physics state variables
  const currentFrameRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1);

  const isHoveredRef = useRef<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const startFrameRef = useRef<number>(1);

  // Sync with global preloading state
  useEffect(() => {
    const handleProgress = (percent: number) => {
      setLoadedPercent(percent);
      
      // Draw first frame if loaded
      if (canvasRef.current && globalPreloadedImages[0]?.complete) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.drawImage(globalPreloadedImages[0], 0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
    };

    globalLoadCallbacks.push(handleProgress);
    startGlobalPreload();

    // Initial draw if already preloaded
    if (globalLoadedPercent === 100 && canvasRef.current && globalPreloadedImages[0]) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.drawImage(globalPreloadedImages[0], 0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }

    return () => {
      globalLoadCallbacks = globalLoadCallbacks.filter((cb) => cb !== handleProgress);
    };
  }, []);

  // Sync canvas dimensions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // High resolution canvas matching aspect ratio
    canvas.width = 360 * 2;
    canvas.height = 640 * 2;
  }, []);

  // Animation render loop (Lerp interpolation)
  useEffect(() => {
    const render = () => {
      const canvas = canvasRef.current;
      const images = globalPreloadedImages;

      // Only animate if loaded
      if (canvas && images.length === totalFrames && loadedPercent === 100) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // 1. If not interacting, drive frames with slow breathing sine wave
          if (!isHoveredRef.current && !isDraggingRef.current && isPlaying) {
            const t = Date.now() / 1000;
            const breathingPeriod = 16; // seconds per full inhale+exhale cycle
            const normalizedBreath = (Math.sin((t / breathingPeriod) * Math.PI * 2) + 1) / 2;
            targetFrameRef.current = 1 + normalizedBreath * (totalFrames - 1);
          }

          // 2. Clamp target to valid frame range (no looping wrap for breathing)
          const target = Math.max(1, Math.min(totalFrames, targetFrameRef.current));

          // 3. Lerp current frame toward target
          currentFrameRef.current += (target - currentFrameRef.current) * 0.08;
          currentFrameRef.current = Math.max(1, Math.min(totalFrames, currentFrameRef.current));

          // 4. Draw the closest frame
          const frameIndex = Math.min(
            totalFrames,
            Math.max(1, Math.round(currentFrameRef.current))
          );
          
          const img = images[frameIndex - 1];
          if (img && img.complete && img.naturalWidth !== 0) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            setCurrentFrame(frameIndex);
          }
        }
      }
      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, loadedPercent]);

  // Mouse event handlers for desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || loadedPercent < 100) return;
    isHoveredRef.current = true;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.min(1, Math.max(0, x / rect.width));
    
    // Set target frame based on mouse horizontal position
    targetFrameRef.current = percentage * (totalFrames - 1) + 1;
  };

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    // Breathing resumes automatically from current position via sine wave
  };

  // Touch event handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (loadedPercent < 100) return;
    isDraggingRef.current = true;
    startXRef.current = e.touches[0].clientX;
    startFrameRef.current = currentFrameRef.current;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !containerRef.current || loadedPercent < 100) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = e.touches[0].clientX - startXRef.current;
    
    // One full width swipe = 1 full rotation (totalFrames)
    const frameDelta = (deltaX / rect.width) * totalFrames;
    
    let target = startFrameRef.current - frameDelta;
    
    // Keep target wrapped
    while (target > totalFrames) target -= totalFrames;
    while (target < 1) target += totalFrames;
    
    targetFrameRef.current = target;
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    // Breathing resumes automatically from current position via sine wave
  };

  const currentFrameStr = String(FRAME_NUMBERS[currentFrame - 1] ?? currentFrame).padStart(3, "0");

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
      {/* Anime animation frame */}
      <div className="relative w-full aspect-[9/16] max-h-[420px] flex items-center justify-center overflow-hidden pointer-events-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover opacity-90 transition-opacity duration-300"
        />
        
        {/* Holographic grid overlay */}
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        
        {/* Futuristic HUD overlay */}
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
            <span>FRAME: {currentFrameStr}/{String(FRAME_NUMBERS[totalFrames - 1]).padStart(3, "0")}</span>
          </div>
        </div>

        {/* Lower HUD bar */}
        <div className="absolute inset-x-4 bottom-4 flex justify-between items-center text-[10px] font-mono text-slate-300 pointer-events-none select-none">
          <div className="bg-brand-bg/75 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-ping" />
            <span className="text-brand-cyan">AI SKETCH: ACTIVE</span>
          </div>
          <div className="bg-brand-bg/75 backdrop-blur-md px-2.5 py-1 rounded border border-white/10">
            STRETCH: 100%
          </div>
        </div>

        {/* Loading status (if not fully preloaded) */}
        {loadedPercent < 100 && (
          <div className="absolute top-2 right-2 text-[8px] font-mono text-brand-pink/50">
            Buffering: {loadedPercent}%
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="w-full bg-[#0C0914] border-t border-white/5 px-4 py-2.5 flex items-center justify-between z-10 pointer-events-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsPlaying(!isPlaying);
          }}
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

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[85vh] pt-24 pb-8 flex items-center justify-center overflow-hidden bg-manga-radial-speedlines bg-manga-draft-grid"
    >
      {/* Background ambient glowing spheres & Manga Sketches */}
      <motion.div
        style={{ y: yBg }}
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      >
        <div className="absolute top-[10%] left-[5%] w-[35vw] h-[35vw] rounded-full bg-brand-purple/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[40%] right-[5%] w-[30vw] h-[30vw] rounded-full bg-brand-cyan/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[25%] w-[40vw] h-[40vw] rounded-full bg-brand-pink/8 blur-[150px] animate-pulse-slow" />

        {/* Floating Manga Speech Bubble SVG */}
        <svg viewBox="0 0 100 100" className="absolute top-[12%] right-[12%] w-24 h-24 text-brand-purple/25 stroke-current stroke-[1.5] fill-none opacity-50 animate-float-medium hidden md:block">
          <path d="M50 10 L58 25 L75 18 L68 35 L88 38 L72 52 L85 70 L65 68 L70 88 L52 75 L45 90 L38 72 L20 82 L28 65 L10 60 L28 48 L15 30 L35 38 L32 15 L48 28 Z" />
          <text x="50" y="54" fontSize="12" fontWeight="900" fontStyle="italic" textAnchor="middle" fill="currentColor">POW!</text>
        </svg>

        {/* Floating Manga Pen Nib SVG */}
        <svg viewBox="0 0 100 100" className="absolute bottom-[25%] left-[6%] w-20 h-20 text-brand-cyan/25 stroke-current stroke-[1.2] fill-none opacity-50 animate-float-slow hidden md:block">
          <path d="M50 15 L68 45 L62 85 L38 85 L32 45 Z" />
          <path d="M50 15 L50 58" />
          <circle cx="50" cy="58" r="4.5" />
          <text x="50" y="96" fontSize="10" fontWeight="bold" textAnchor="middle" fill="currentColor" opacity="0.6">G-PEN</text>
        </svg>

        {/* Floating Shoujo Star sparkles */}
        <svg viewBox="0 0 100 100" className="absolute top-[32%] left-[10%] w-16 h-16 text-brand-pink/35 stroke-current stroke-[1.5] fill-none opacity-60 animate-spin-slow">
          <path d="M50 15 L54 41 L80 45 L54 49 L50 75 L46 49 L20 45 L46 41 Z" />
        </svg>

        <svg viewBox="0 0 100 100" className="absolute bottom-[30%] right-[15%] w-12 h-12 text-brand-cyan/35 stroke-current stroke-[1.2] fill-none opacity-50 animate-pulse-slow">
          <path d="M50 25 L53 43 L71 46 L53 49 L50 67 L47 49 L29 46 L47 43 Z" />
        </svg>

        {/* Floating Manga Panel Layout Frames */}
        <svg viewBox="0 0 100 100" className="absolute top-[55%] left-[20%] w-28 h-28 text-white/10 stroke-current stroke-1 fill-none opacity-30 -rotate-12 hidden lg:block">
          <rect x="5" y="5" width="90" height="90" rx="6" />
          <line x1="50" y1="5" x2="50" y2="95" strokeDasharray="3,3" />
          <line x1="5" y1="45" x2="95" y2="45" />
        </svg>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <motion.div
            style={{ opacity: opacityText }}
            className="lg:col-span-7 flex flex-col justify-center text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border-brand-purple/20 text-brand-cyan text-xs font-semibold tracking-wider uppercase mb-6 self-start">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-brand-pink" />
              Desenhe o Futuro com IA
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-none select-none">
              Dê Vida ao Seu Universo de{" "}
              <span className="relative inline-block mt-1 sm:mt-0">
                <span className="absolute inset-0 bg-gradient-to-r from-brand-purple via-brand-pink to-brand-cyan blur-md opacity-50" />
                <span className="relative bg-gradient-to-r from-brand-purple via-brand-pink to-brand-cyan bg-clip-text text-transparent text-neon-glow-purple">
                  Mangás & Desenhos
                </span>
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mb-6 leading-relaxed font-light">
              MangaForge une a precisão de um estúdio de ilustração profissional com a inovação da IA. Crie layouts de página dinâmicos, aperfeiçoe traços com IA e exporte em altíssima resolução com apenas um clique.
            </p>

            {/* Micro details statistics (Moved above fold) */}
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

            {/* CTA Action Buttons (Converged to #cta) */}
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
                <ChevronRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </div>

            <p className="text-[8px] sm:text-[9px] text-slate-600 font-mono mt-4 leading-normal">
              * Dados baseados em relatórios de uso do servidor oficial no Discord (Abril/Junho 2026).
            </p>
          </motion.div>

          {/* Right Column: Dynamic Graphic Tablet Mockup & Frames Animator */}
          <motion.div
            className="lg:col-span-5 relative flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            {/* Ambient background glow for tablet */}
            <div className="absolute w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-brand-purple/20 via-brand-pink/15 to-brand-cyan/20 blur-[60px] animate-pulse-slow pointer-events-none" />

            {/* Tablet frame */}
            <div className="relative w-full max-w-[360px] sm:max-w-[380px] p-3 rounded-2xl bg-slate-950/70 border border-white/10 backdrop-blur-lg shadow-2xl shadow-brand-purple/10 flex flex-col justify-center animate-float-slow">
              
              {/* Tablet camera dot */}
              <div className="absolute top-[6px] left-[50%] -translate-x-[50%] w-1.5 h-1.5 rounded-full bg-slate-800" />
              
              {/* Screen Content */}
              <FrameAnimator />
              
              {/* Stylus Pen Mockup overlay */}
              <motion.div 
                className="absolute right-[-40px] top-[40%] w-[12px] h-[150px] pointer-events-none hidden md:block"
                animate={{ 
                  y: [0, -20, 15, 0],
                  x: [0, 5, -5, 0],
                  rotate: [15, 20, 10, 15] 
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 6,
                  ease: "easeInOut"
                }}
              >
                {/* Stylus body */}
                <div className="w-full h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 rounded-full border border-white/10 shadow-lg relative">
                  {/* Cyber glow indicator on stylus */}
                  <div className="absolute bottom-6 left-[50%] -translate-x-[50%] w-1.5 h-6 rounded-full bg-brand-cyan animate-pulse shadow-glow-cyan" />
                  {/* Stylus tip */}
                  <div className="absolute bottom-0 left-[50%] -translate-x-[50%] w-0 h-0 border-l-[6px] border-r-[6px] border-t-[12px] border-l-transparent border-r-transparent border-t-slate-950" />
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
      
      {/* Wave bottom decoration */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-brand-bg to-transparent pointer-events-none" />
    </section>
  );
}
