"use client";

import { useState, useEffect } from "react";
import { Sparkles, Zap, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Recursos", href: "/#features" },
  { name: "Galeria", href: "/#gallery" },
  { name: "Preços", href: "/#pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-brand-bg/90 backdrop-blur-md border-b border-white/10 py-3 shadow-lg shadow-purple-950/10"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">

          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center space-x-2 group flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-purple via-brand-pink to-brand-cyan p-[1.5px] shadow-glow-purple group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-brand-bg rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand-cyan group-hover:text-brand-pink transition-colors duration-300" />
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-brand-cyan bg-clip-text text-transparent tracking-wider">
              Manga<span className="text-brand-purple">Forge</span>
            </span>
          </motion.a>

          {/* Desktop links + CTA */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link, idx) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-400 hover:text-brand-cyan transition-colors duration-200 relative group"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
              >
                {link.name}
                <span className="absolute left-0 bottom-[-3px] w-0 h-[1.5px] bg-gradient-to-r from-brand-purple to-brand-cyan transition-all duration-300 group-hover:w-full rounded-full" />
              </motion.a>
            ))}

            <motion.a
              href="/#cta"
              className="relative group overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-brand-purple ml-1"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-brand-purple via-brand-pink to-brand-cyan animate-pulse-slow" />
              <div className="relative px-5 py-2 bg-brand-bg rounded-full text-xs font-semibold text-white tracking-widest uppercase transition-colors duration-300 group-hover:bg-brand-bg/85 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-brand-cyan" />
                Participar do Beta
              </div>
            </motion.a>
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile drawer menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-brand-bg/95 backdrop-blur-lg border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-5 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-2 px-3">
                <a
                  href="/#cta"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-sm font-semibold text-white shadow-glow-purple"
                >
                  <Zap className="w-4 h-4" />
                  Participar do Beta
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

