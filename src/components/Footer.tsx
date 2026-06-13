"use client";

import { Sparkles, Twitter, Github, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-brand-cyan hover:shadow-glow-cyan" },
    { name: "Instagram", icon: Instagram, href: "#", color: "hover:text-brand-pink hover:shadow-glow-pink" },
    { name: "GitHub", icon: Github, href: "#", color: "hover:text-white hover:shadow-glow-purple" },
    { name: "YouTube", icon: Youtube, href: "#", color: "hover:text-red-500 hover:shadow-glow-pink" },
  ];

  return (
    <footer className="bg-[#08060F] border-t border-white/5 py-12 relative overflow-hidden">
      {/* Background soft gradients */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-purple/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-cyan/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-white/5">
          
          {/* Brand Info Column */}
          <div className="md:col-span-2">
            <a href="#" className="flex items-center space-x-2 group mb-4">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-purple via-brand-pink to-brand-cyan p-[1px]">
                <div className="w-full h-full bg-brand-bg rounded-[7px] flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5 text-brand-cyan" />
                </div>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-brand-cyan bg-clip-text text-transparent tracking-wider">
                Manga<span className="text-brand-purple">Forge</span>
              </span>
            </a>
            <p className="text-xs text-slate-400 font-light leading-relaxed max-w-sm mb-4">
              Moldando o futuro da narrativa visual. Unindo o melhor da tecnologia inteligente com o traço clássico para desenhistas de todo o mundo.
            </p>
          </div>

          {/* Nav Links Column */}
          <div>
            <h4 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider mb-4">
              Plataforma
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-light">
              <li>
                <a href="/#gallery" className="hover:text-brand-cyan transition-colors">Galeria</a>
              </li>
              <li>
                <a href="/#testimonials" className="hover:text-brand-cyan transition-colors">Depoimentos</a>
              </li>
              <li>
                <a href="/pricing" className="hover:text-brand-cyan transition-colors">Planos</a>
              </li>
              <li>
                <a href="/#cta" className="hover:text-brand-cyan transition-colors">Acesso Beta</a>
              </li>
            </ul>
          </div>

          {/* Legal Links Column */}
          <div>
            <h4 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-light">
              <li>
                <a href="#" className="hover:text-brand-cyan transition-colors">Termos de Serviço</a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-cyan transition-colors">Política de Privacidade</a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-cyan transition-colors">Termos do Beta</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-mono text-slate-500">
            &copy; {currentYear} MangaForge. Todos os direitos reservados.
          </p>

          {/* Social icons */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className={`w-8 h-8 rounded-lg bg-white/5 border border-white/5 hover:bg-brand-bg hover:border-white/10 flex items-center justify-center text-slate-400 transition-all duration-300 ${social.color}`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>

      </div>
    </footer>
  );
}
