"use client";

import { useState } from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string; // Data URL for rendering image preview in message bubble
}

export function useMangaMentor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Olá! Eu sou seu **AI Manga Mentor**. Envie um esboço, painel de história ou rascunho de personagem e me diga o que deseja analisar. Posso ajudar com proporções anatômicas, enquadramento de painéis e técnicas de nanquim!",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<{ base64: string; dataUrl: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(",")[1] || dataUrl;
        resolve({ base64, dataUrl });
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const sendMessage = async (text: string, file: File | null = null) => {
    if (!text.trim() && !file) return;

    setError(null);
    setIsLoading(true);

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `assistant-${Date.now()}`;
    
    let base64Image = "";
    let localDataUrl = "";

    try {
      // 1. Process image if uploaded
      if (file) {
        const fileRes = await fileToBase64(file);
        base64Image = fileRes.base64;
        localDataUrl = fileRes.dataUrl;
      }

      // 2. Add optimistic User Message
      const userMessage: Message = {
        id: userMessageId,
        role: "user",
        content: text,
        image: localDataUrl || undefined,
      };

      setMessages((prev) => [...prev, userMessage]);

      // 3. Post to API
      const response = await fetch("/api/mentor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          image: base64Image,
          fileType: file?.type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erro de servidor ao contatar o AI Mentor.");
      }

      // 4. Initialize stream reading
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Resposta de stream do servidor indisponível.");
      }

      // Add empty optimistic assistant message to be populated
      const initialAssistantMessage: Message = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, initialAssistantMessage]);
      setIsLoading(false); // Done thinking, now typing

      // Stream loop
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === assistantMessageId) {
              return { ...msg, content: msg.content + chunk };
            }
            return msg;
          })
        );
      }

    } catch (err) {
      console.error("MangaMentor Stream Error:", err);
      const errMsg = err instanceof Error ? err.message : "Ocorreu um erro ao processar sua solicitação.";
      setError(errMsg);
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Olá! Envie um esboço ou rascunho de personagem e me diga o que deseja analisar. Posso ajudar com anatomia, proporções e layouts de página!",
      },
    ]);
    setError(null);
    setIsLoading(false);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
}
