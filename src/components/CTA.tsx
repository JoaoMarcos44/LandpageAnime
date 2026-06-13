"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, Sparkles, Mail } from "lucide-react";
import confetti from "canvas-confetti";

export default function CTA() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Por favor, digite seu e-mail.");
      return;
    }
    // Simple email validation regex
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Por favor, digite um e-mail válido.");
      return;
    }

    setError("");
    setIsLoading(true);

    // Simulate server request
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      
      // Explosion confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.8 },
        colors: ["#A855F7", "#EC4899", "#06B6D4"],
      });
    }, 1200);
  };

  return (
    <section id="cta" className="py-24 relative overflow-hidden bg-brand-bg bg-manga-draft-grid bg-manga-screentone">
      {/* Background ambient neon glows */}
      <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[50vw] h-[50vw] rounded-full bg-brand-purple/10 blur-[150px] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/20 to-transparent" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Glow Panel Card */}
        <div className="relative p-8 md:p-12 lg:p-16 manga-card-panel manga-crop-marks overflow-hidden text-center md:text-left">
          
          {/* Cyber ambient grid lines inside card */}
          <div className="absolute inset-0 grid-bg opacity-[0.03] pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="max-w-none grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                {/* Left Column: Title, Description & Benefits List */}
                <div className="md:col-span-7 space-y-5">
                  {/* Icon tag */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-semibold uppercase tracking-wider self-start">
                    <Sparkles className="w-3.5 h-3.5" />
                    Garantir Acesso Antecipado
                  </div>

                  {/* Header */}
                  <h3 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                    Pronto Para Moldar Sua Próxima{" "}
                    <span className="bg-gradient-to-r from-brand-purple to-brand-pink bg-clip-text text-transparent">
                      Grande História?
                    </span>
                  </h3>
                  
                  <p className="text-slate-300 font-light text-sm sm:text-base leading-relaxed">
                    Inscreva-se na nossa lista Beta fechada hoje e garanta suas vantagens exclusivas de pioneiro antes do lançamento global. Vagas limitadas.
                  </p>

                  {/* Benefits Checklist */}
                  <ul className="space-y-2.5 pt-2 text-left">
                    <li className="flex items-start gap-2 text-xs sm:text-sm text-slate-300 font-light">
                      <CheckCircle className="w-4.5 h-4.5 text-brand-cyan flex-shrink-0 mt-0.5 animate-pulse" />
                      <span><strong>Acesso 100% Gratuito</strong>: Sem custos ou cartões de crédito durante o beta.</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs sm:text-sm text-slate-300 font-light">
                      <CheckCircle className="w-4.5 h-4.5 text-brand-cyan flex-shrink-0 mt-0.5 animate-pulse" />
                      <span><strong>40% de Desconto Vitalício</strong>: Economia garantida pós-beta no Plano Criador.</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs sm:text-sm text-slate-300 font-light">
                      <CheckCircle className="w-4.5 h-4.5 text-brand-cyan flex-shrink-0 mt-0.5 animate-pulse" />
                      <span><strong>Discord VIP de Criadores</strong>: Mentorias semanais e suporte direto de outros mangakás.</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs sm:text-sm text-slate-300 font-light">
                      <CheckCircle className="w-4.5 h-4.5 text-brand-cyan flex-shrink-0 mt-0.5 animate-pulse" />
                      <span><strong>Participe do Roadmap</strong>: Solicite e vote em novos recursos da ferramenta.</span>
                    </li>
                  </ul>
                </div>

                {/* Right Column: Capture Form Card */}
                <div className="md:col-span-5 bg-[#08050D]/90 p-6 sm:p-8 rounded-2xl border border-white/5 shadow-2xl space-y-4 text-center">
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                    Junte-se à lista de espera
                  </h4>
                  
                  {/* Email Form */}
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3 items-stretch w-full mx-auto">
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError("");
                        }}
                        placeholder="seu-email@exemplo.com"
                        className="w-full pl-10 pr-4 py-3.5 bg-[#08050D] border border-white/10 rounded-xl text-sm font-light text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all duration-300"
                        disabled={isLoading}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="relative group overflow-hidden w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-xs font-bold uppercase tracking-wider text-white hover:shadow-glow-pink hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          Experimentar Beta Grátis
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Validation Error Message */}
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-xs font-semibold"
                    >
                      {error}
                    </motion.p>
                  )}

                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                    Vagas limitadas. Cadastro gratuito e seguro.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", damping: 20 }}
                className="max-w-md mx-auto"
              >
                <div className="mx-auto w-14 h-14 rounded-full bg-brand-cyan/15 flex items-center justify-center mb-6 text-brand-cyan shadow-glow-cyan border border-brand-cyan/20">
                  <CheckCircle className="w-8 h-8 text-brand-cyan" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">
                  Você Está na Lista!
                </h3>
                
                <p className="text-slate-300 text-sm font-light leading-relaxed mb-6">
                  Parabéns! Seu e-mail <strong className="text-brand-pink font-semibold">{email}</strong> foi cadastrado com sucesso. Enviamos um e-mail de confirmação com os próximos passos.
                </p>

                <div className="p-4 rounded-xl bg-[#08050D] border border-white/5 text-left mb-6 font-mono text-[11px] text-slate-400">
                  <span className="text-brand-cyan font-bold block mb-1">PROXIMA ETAPA:</span>
                  Verifique sua caixa de entrada para confirmar seu cadastro e receber seu convite para o Discord privado de criadores.
                </div>

                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail("");
                  }}
                  className="px-6 py-2.5 rounded-lg border border-white/10 hover:border-brand-purple/40 text-xs font-semibold text-slate-400 hover:text-white transition-all duration-300"
                >
                  Voltar
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}
