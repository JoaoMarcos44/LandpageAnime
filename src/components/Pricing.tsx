"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Zap } from "lucide-react";

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-[#0C0914] bg-manga-draft-grid bg-manga-screentone">
      {/* Background ambient neon glows */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-pink/20 to-transparent" />
      <div className="absolute top-[20%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-brand-purple/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-brand-cyan/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-xs font-bold tracking-widest text-brand-pink uppercase mb-3 font-mono">
            Planos & Preços
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            Acesso Simples.{" "}
            <span className="bg-gradient-to-r from-brand-pink via-brand-purple to-brand-cyan bg-clip-text text-transparent">
              Transparente.
            </span>
          </h3>
          <p className="text-slate-400 font-light text-sm sm:text-base leading-relaxed">
            Nada de grades de planos complexas na fase inicial. Queremos você criando hoje mesmo.
          </p>
        </motion.div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          
          {/* Card 1: Beta Grátis (Current State) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative p-8 sm:p-10 manga-card-panel manga-crop-marks flex flex-col justify-between"
          >
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/40 to-transparent rounded-t-3xl" />
            
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/20 text-[10px] font-bold uppercase tracking-wider mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                Fase Atual (Beta Fechado)
              </div>
              
              <h4 className="text-xl font-bold text-white mb-2">Beta Grátis</h4>
              <div className="mb-4">
                <span className="text-4xl font-extrabold text-white">R$ 0</span>
                <span className="text-xs text-slate-500 font-mono ml-2">/ durante o beta</span>
              </div>
              
              <p className="text-slate-300 text-sm font-light leading-relaxed mb-6">
                Teste e ajude a moldar a ferramenta. Acesso completo a todos os recursos de ilustração e inteligência artificial enquanto o beta estiver aberto.
              </p>

              <div className="h-px bg-white/5 my-5" />

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 font-light">
                  <Check className="w-4.5 h-4.5 text-brand-cyan flex-shrink-0 mt-0.5" />
                  <span>Assistente de esboço com IA</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 font-light">
                  <Check className="w-4.5 h-4.5 text-brand-cyan flex-shrink-0 mt-0.5" />
                  <span>Diagramação dinâmica de painéis</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 font-light">
                  <Check className="w-4.5 h-4.5 text-brand-cyan flex-shrink-0 mt-0.5" />
                  <span>Pincéis com sensação de pressão real</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 font-light">
                  <Check className="w-4.5 h-4.5 text-brand-cyan flex-shrink-0 mt-0.5" />
                  <span>Acesso ao Discord VIP de Criadores</span>
                </li>
              </ul>
            </div>

            <motion.a
              href="#cta"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-center py-3.5 rounded-xl border border-brand-cyan/40 text-brand-cyan font-bold text-xs uppercase tracking-widest hover:bg-brand-cyan/10 transition-all duration-200"
            >
              Começar Agora (Grátis)
            </motion.a>
          </motion.div>

          {/* Card 2: Plano Criador (Future State) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative p-8 sm:p-10 manga-card-panel manga-crop-marks flex flex-col justify-between"
          >
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-purple/60 to-transparent rounded-t-3xl" />
            
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-purple/15 text-brand-purple border border-brand-purple/30 text-[10px] font-bold uppercase tracking-wider mb-5">
                <Zap className="w-3.5 h-3.5" />
                Pós-Lançamento (Com Desconto)
              </div>
              
              <h4 className="text-xl font-bold text-white mb-2">Plano Criador</h4>
              <div className="mb-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">R$ 29</span>
                <span className="text-xs text-slate-500 font-mono ml-2">/ mês (pós-beta)</span>
                <span className="text-xs text-brand-pink line-through font-mono ml-3">R$ 49/mês</span>
              </div>
              
              <p className="text-slate-300 text-sm font-light leading-relaxed mb-6">
                Para artistas independentes. Inscrevendo-se na lista beta hoje, você garante um <strong className="font-semibold text-white">desconto vitalício de 40%</strong> após o lançamento oficial.
              </p>

              <div className="h-px bg-white/5 my-5" />

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 font-light">
                  <Check className="w-4.5 h-4.5 text-brand-cyan flex-shrink-0 mt-0.5" />
                  <span><strong>Páginas ilimitadas</strong> por projeto</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 font-light">
                  <Check className="w-4.5 h-4.5 text-brand-cyan flex-shrink-0 mt-0.5" />
                  <span>Exportação em PSD (camadas separadas)</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 font-light">
                  <Check className="w-4.5 h-4.5 text-brand-cyan flex-shrink-0 mt-0.5" />
                  <span>Hachuras e retículas clássicas ilimitadas</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 font-light">
                  <Check className="w-4.5 h-4.5 text-brand-cyan flex-shrink-0 mt-0.5" />
                  <span>Suporte prioritário do Sensei IA</span>
                </li>
              </ul>
            </div>

            <motion.a
              href="#cta"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-center py-3.5 rounded-xl bg-gradient-to-r from-brand-purple via-brand-pink to-brand-cyan text-white font-bold text-xs uppercase tracking-widest shadow-glow-purple hover:shadow-glow-pink hover:scale-[1.01] transition-all duration-200"
            >
              Garantir 40% de Desconto
            </motion.a>
          </motion.div>

        </div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-[10px] text-slate-600 font-mono mt-8"
        >
          * O desconto de 40% para beta testers é vitalício e ficará vinculado ao e-mail cadastrado na lista.
        </motion.p>

      </div>
    </section>
  );
}

