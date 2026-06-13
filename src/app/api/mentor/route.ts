import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const { message, image, fileType } = await req.json();

    // System instruction defining the persona
    const systemInstruction = 
      "Você é o 'Sensei', um editor e crítico de arte de mangás profissional, muito experiente, estrito mas encorajador. " +
      "Seu objetivo é analisar o esboço, storyboard ou rascunho de personagem enviado pelo criador. " +
      "Forneça feedbacks construtivos curtos e precisos divididos em 3 tópicos markdown: " +
      "1. Anatomia e Pose; 2. Qualidade do Traço (Inking); 3. Composição de Painel e Storytelling. " +
      "Sempre use negrito para destacar termos técnicos do mangá e finalize com uma frase motivadora.";

    // Fallback: If no API key is available, run a typing simulator stream
    if (!apiKey) {
      const mockResponse = 
        "Analisando seu rascunho com o Forge Engine... 🎨\n\n" +
        "**1. Anatomia e Pose:**\nOs contornos do cabelo e do rosto estão bem delineados e mostram boa expressividade. Recomendo suavizar a curvatura da nuca e alongar levemente a linha do ombro para dar uma pose mais natural ao personagem.\n\n" +
        "**2. Qualidade do Traço (Inking):**\nO traço principal é estável, indicando uma boa simulação de pena **G-Pen**. Para detalhes mais delicados como os olhos e as linhas de expressão labial, recomendo reduzir o tamanho do pincel simulando uma **Maru-Pen**.\n\n" +
        "**3. Composição e Storytelling:**\nPor ser um close-up focado nas emoções, funciona perfeitamente para focar na introspecção. Se quiser dar mais drama à cena, tente inserir linhas de velocidade (**Speed Lines**) diagonais de contraste no fundo.\n\n" +
        "Bom trabalho, continue praticando e refinando a arte! 🌟";

      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          const words = mockResponse.split(" ");
          
          for (let i = 0; i < words.length; i++) {
            controller.enqueue(encoder.encode(words[i] + " "));
            // Space out chunks slightly to simulate real API streaming
            await new Promise((resolve) => setTimeout(resolve, 35));
          }
          controller.close();
        },
      });

      return new NextResponse(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    // Initialize Google GenAI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction,
    });

    const promptParts: Array<string | { inlineData: { data: string; mimeType: string } }> = [];
    
    // Add text message prompt
    promptParts.push(message || "Por favor, analise a arte em anexo.");

    // Add inline base64 image if present
    if (image) {
      promptParts.push({
        inlineData: {
          data: image,
          mimeType: fileType || "image/jpeg",
        },
      });
    }

    // Fetch stream from Gemini
    const result = await model.generateContentStream(promptParts);

    // Pipe Gemini response chunks directly to client
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            controller.enqueue(encoder.encode(text));
          }
        } catch (err) {
          console.error("Gemini stream read error:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });

  } catch (err) {
    console.error("Mentor route handler error:", err);
    const errMsg = err instanceof Error ? err.message : "Erro desconhecido na rota de análise.";
    return NextResponse.json(
      { error: errMsg },
      { status: 500 }
    );
  }
}
