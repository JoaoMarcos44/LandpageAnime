"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

export default function StickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after user scrolls past ~70vh
      setVisible(window.scrollY > window.innerHeight * 0.7);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-lg"
        >
          <div className="relative rounded-2xl bg-[#0E0B1C]/90 backdrop-blur-xl border border-brand-purple/30 shadow-glow-purple-lg overflow-hidden flex items-center justify-between gap-4 px-5 py-3.5">
            {/* Ambient top border glow */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-purple/60 to-transparent" />

            <div className="flex items-center gap-2 min-w-0">
              <span className="flex-shrink-0 w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
              <p className="text-xs sm:text-sm font-medium text-slate-200 truncate">
                <span className="text-brand-cyan font-semibold">Vagas limitadas</span> · Beta fechado aberto agora
              </p>
            </div>

            <motion.a
              href="/#cta"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-xs font-bold text-white uppercase tracking-wider shadow-glow-pink hover:opacity-90 transition-opacity duration-200"
            >
              <Zap className="w-3.5 h-3.5" />
              Entrar no Beta
            </motion.a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
