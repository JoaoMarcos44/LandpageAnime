"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, X, RefreshCcw, AlertTriangle } from "lucide-react";
import { useMangaMentor } from "@/hooks/useMangaMentor";
import Image from "next/image";

export default function AIEditorChat() {
  const { messages, isLoading, error, sendMessage, clearChat } = useMangaMentor();
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom on new messages or loading
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecione apenas arquivos de imagem (PNG, JPG).");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedFile) return;

    sendMessage(inputText, selectedFile);
    setInputText("");
    handleRemoveFile();
  };

  return (
    <div className="flex flex-col h-[520px] rounded-2xl glass-card bg-white/[0.03] border-white/10 shadow-2xl overflow-hidden relative">
      
      {/* Chat Header */}
      <div className="px-5 py-4 border-b border-white/10 bg-[#0E0C17]/85 backdrop-blur-md flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-pink shadow-glow-pink animate-pulse" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            AI Manga Mentor
          </h3>
          <span className="text-[10px] font-mono text-brand-cyan uppercase bg-brand-cyan/10 border border-brand-cyan/20 px-2 py-0.5 rounded ml-1">
            Sensei v1.5
          </span>
        </div>

        <button
          onClick={clearChat}
          className="p-1.5 rounded-lg border border-white/5 hover:border-white/10 text-slate-400 hover:text-white transition-colors duration-200"
          title="Limpar Histórico"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages Feed Area */}
      <div 
        ref={scrollContainerRef}
        className="flex-grow overflow-y-auto p-5 space-y-4 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex flex-col max-w-[85%] ${
                msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
              }`}
            >
              {/* Image Preview inside chat bubble */}
              {msg.image && (
                <div className="relative w-44 aspect-video rounded-xl overflow-hidden mb-1.5 border border-white/10 bg-black/40">
                  <Image
                    src={msg.image}
                    alt="Uploaded Drawing Sketch"
                    fill
                    className="object-cover"
                    sizes="176px"
                  />
                </div>
              )}

              {/* Text Bubble */}
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-brand-purple text-white rounded-tr-none shadow-glow-purple/10"
                    : "glass-card border-white/5 bg-[#120F1D]/80 text-slate-100 rounded-tl-none"
                }`}
              >
                {/* Basic Bold markdown rendering helper */}
                {msg.content.split("**").map((part, i) => 
                  i % 2 === 1 ? <strong key={i} className="text-brand-cyan font-bold">{part}</strong> : part
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Streaming / Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5 mr-auto max-w-[85%]"
          >
            <div className="flex space-x-1.5 p-3 rounded-2xl rounded-tl-none glass-card border-white/5 bg-[#120F1D]/50 items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-bounce" style={{ animationDelay: "300ms" }} />
              <span className="text-[10px] font-mono text-slate-400 ml-2">Sensei analisando...</span>
            </div>
          </motion.div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-400 flex items-start gap-2 max-w-[95%] mx-auto">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-0.5">Erro no Co-Piloto</p>
              <p className="font-light">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Input Form bar */}
      <form 
        onSubmit={handleSend}
        className="p-4 border-t border-white/10 bg-[#0C0914]/85 backdrop-blur-md flex flex-col gap-3 z-10"
      >
        {/* Upload Thumbnail Overlay */}
        <AnimatePresence>
          {filePreview && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl p-2 max-w-[150px] overflow-hidden relative"
            >
              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                <Image
                  src={filePreview}
                  alt="Attachment Preview"
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <span className="text-[10px] text-slate-400 font-mono truncate max-w-[70px]">
                {selectedFile?.name}
              </span>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 hover:bg-black text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2">
          {/* File Picker Paperclip Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl border border-white/10 hover:border-white/20 text-slate-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-200"
            disabled={isLoading}
          >
            <Paperclip className="w-4 h-4" />
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              selectedFile 
                ? "Diga algo sobre o rascunho anexado..." 
                : "Pergunte sobre poses, anatomia ou envie um esboço..."
            }
            className="flex-grow py-2.5 px-4 bg-[#08050D] border border-white/10 rounded-xl text-sm font-light text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all duration-300"
            disabled={isLoading}
          />

          {/* Submit Send Button */}
          <button
            type="submit"
            disabled={(!inputText.trim() && !selectedFile) || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-white hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

    </div>
  );
}
