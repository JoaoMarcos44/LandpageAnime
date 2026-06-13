"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, ShieldAlert } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  badge?: string;
}

const faqData: FAQItem[] = [
  {
    question: "Meus desenhos ou roteiros são usados para treinar a IA?",
    answer: "Não. No MangaForge, a privacidade e a autoria do seu trabalho são prioridades máximas. Seus esboços, desenhos e ideias são 100% de sua propriedade intelectual. Nós nunca usamos, compartilhamos ou armazenamos suas criações para treinar nossos modelos de IA.",
    badge: "Segurança & Privacidade",
  },
  {
    question: "O acesso ao Beta Fechado é realmente gratuito?",
    answer: "Sim, totalmente gratuito. Durante toda a fase de testes do Beta Fechado, você terá acesso irrestrito a todas as ferramentas premium de diagramação, arte-final e assistente de esboço IA. Não é necessário cadastrar cartão de crédito.",
  },
  {
    question: "Como funciona o desconto vitalício de R$ 29/mês?",
    answer: "Ao se cadastrar na lista do beta hoje, seu e-mail fica registrado na nossa base com um desconto vitalício e intransferível de 40%. Quando a ferramenta for lançada oficialmente, você pagará apenas R$ 29/mês no Plano Criador (em vez de R$ 49/mês) enquanto mantiver sua assinatura ativa.",
  },
  {
    question: "Posso exportar meus projetos para o Photoshop ou Clip Studio?",
    answer: "Sim! O MangaForge gera exportações de arquivos PSD profissionais com camadas totalmente organizadas. Seus esboços, arte-final vetorial, retículas tradicionais e textos de balão são exportados em canais separados para facilitar a edição em outros softwares.",
  },
  {
    question: "Preciso de uma mesa digitalizadora para usar o MangaForge?",
    answer: "Não obrigatoriamente. Embora uma mesa digitalizadora proporcione a melhor precisão ao utilizar nossos pincéis de pressão, nosso assistente de IA é otimizado para refinar e suavizar rascunhos feitos a partir de mouse, trackpad ou até digitalizações de desenhos em papel.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 relative overflow-hidden bg-[#0C0914] bg-manga-draft-grid bg-manga-screentone">
      {/* Background ambient glows */}
      <div className="absolute top-[20%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-brand-cyan/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-brand-purple/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-pink/20 to-transparent" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold tracking-widest text-brand-pink uppercase mb-3 font-mono">
            Dúvidas Frequentes
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            Perguntas{" "}
            <span className="bg-gradient-to-r from-brand-pink via-brand-purple to-brand-cyan bg-clip-text text-transparent">
              Respondidas
            </span>
          </h3>
          <p className="text-slate-400 font-light text-sm sm:text-base leading-relaxed">
            Resolvemos suas principais dúvidas sobre privacidade, IA, exportação e preços antes de você começar.
          </p>
        </div>

        {/* FAQ List Accordion */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`transition-all duration-300 overflow-hidden manga-card-panel manga-crop-marks ${
                  isOpen
                    ? "border-brand-purple/40 shadow-glow-purple-sm"
                    : "border-white/5 hover:border-white/10"
                }`}
              >
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left transition-colors duration-200 focus:outline-none"
                >
                  <div className="flex items-center gap-3.5 pr-4">
                    {item.badge ? (
                      <ShieldAlert className="w-5 h-5 text-brand-pink flex-shrink-0" />
                    ) : (
                      <HelpCircle className="w-5 h-5 text-brand-cyan flex-shrink-0" />
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="text-sm sm:text-base font-semibold text-white leading-snug">
                        {item.question}
                      </span>
                      {item.badge && (
                        <span className="inline-flex max-w-max items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-brand-pink/15 text-brand-pink border border-brand-pink/20">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-brand-cyan" : ""
                    }`}
                  />
                </button>

                {/* Accordion Content Wrapper */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-1 border-t border-white/5">
                        <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
