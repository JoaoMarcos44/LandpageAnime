"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Wand2, Sparkles, Sliders, CheckCircle2, RefreshCw, PenTool } from "lucide-react";
import confetti from "canvas-confetti";

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
}

// Pre-defined manga face & sketch reference guidelines
const sampleSketches = {
  portrait: [
    // Head circle guide
    [{ x: 200, y: 170 }, { type: "arc", cx: 200, cy: 170, r: 70 }],
    // Axis lines
    [{ x: 200, y: 90 }, { x: 200, y: 260 }],
    [{ x: 120, y: 170 }, { x: 280, y: 170 }],
    // Face outline
    [{ x: 130, y: 170 }, { x: 135, y: 215 }],
    [{ x: 135, y: 215 }, { x: 200, y: 260 }],
    [{ x: 200, y: 260 }, { x: 265, y: 215 }],
    [{ x: 265, y: 215 }, { x: 270, y: 170 }],
    // Neck
    [{ x: 170, y: 240 }, { x: 170, y: 290 }],
    [{ x: 230, y: 240 }, { x: 230, y: 290 }],
    // Shoulders
    [{ x: 170, y: 290 }, { x: 110, y: 330 }],
    [{ x: 230, y: 290 }, { x: 290, y: 330 }],
    // Eyes shapes (simple guides)
    [{ x: 155, y: 180 }, { x: 180, y: 180 }],
    [{ x: 155, y: 180 }, { x: 167, y: 195 }],
    [{ x: 167, y: 195 }, { x: 180, y: 180 }],
    [{ x: 220, y: 180 }, { x: 245, y: 180 }],
    [{ x: 220, y: 180 }, { x: 233, y: 195 }],
    [{ x: 233, y: 195 }, { x: 245, y: 180 }],
    // Nose guide
    [{ x: 200, y: 205 }, { x: 195, y: 215 }],
    [{ x: 195, y: 215 }, { x: 205, y: 215 }],
    // Mouth guide
    [{ x: 185, y: 235 }, { x: 200, y: 240 }],
    [{ x: 200, y: 240 }, { x: 215, y: 235 }],
    // Hair (anime spikes)
    [{ x: 190, y: 100 }, { x: 170, y: 130 }],
    [{ x: 170, y: 130 }, { x: 200, y: 120 }],
    [{ x: 200, y: 120 }, { x: 230, y: 130 }],
    [{ x: 230, y: 130 }, { x: 210, y: 100 }],
    [{ x: 160, y: 110 }, { x: 130, y: 160 }],
    [{ x: 240, y: 110 }, { x: 270, y: 160 }],
  ],
  tree: [
    // Canopy guides
    [{ x: 200, y: 140 }, { type: "arc", cx: 200, cy: 140, r: 50 }],
    [{ x: 160, y: 170 }, { type: "arc", cx: 160, cy: 170, r: 40 }],
    [{ x: 240, y: 170 }, { type: "arc", cx: 240, cy: 170, r: 40 }],
    // Trunk guides
    [{ x: 190, y: 210 }, { x: 190, y: 310 }],
    [{ x: 210, y: 210 }, { x: 210, y: 310 }],
    // Roots
    [{ x: 190, y: 310 }, { x: 170, y: 330 }],
    [{ x: 210, y: 310 }, { x: 230, y: 330 }],
    // Branch lines
    [{ x: 190, y: 230 }, { x: 165, y: 210 }],
    [{ x: 210, y: 230 }, { x: 235, y: 210 }],
  ],
  dog: [
    // Head & snout
    [{ x: 200, y: 175 }, { type: "arc", cx: 200, cy: 175, r: 50 }],
    [{ x: 200, y: 205 }, { type: "arc", cx: 200, cy: 205, r: 25 }],
    // Droopy ears
    [{ x: 155, y: 145 }, { x: 130, y: 210 }],
    [{ x: 130, y: 210 }, { x: 160, y: 195 }],
    [{ x: 245, y: 145 }, { x: 270, y: 210 }],
    [{ x: 270, y: 210 }, { x: 240, y: 195 }],
    // Eyes & Nose
    [{ x: 175, y: 170 }, { type: "arc", cx: 175, cy: 170, r: 5 }],
    [{ x: 225, y: 170 }, { type: "arc", cx: 225, cy: 170, r: 5 }],
    [{ x: 200, y: 195 }, { type: "arc", cx: 200, cy: 195, r: 7 }],
    // Body & legs
    [{ x: 200, y: 280 }, { type: "arc", cx: 200, cy: 280, r: 45 }],
    [{ x: 170, y: 280 }, { x: 170, y: 340 }],
    [{ x: 230, y: 280 }, { x: 230, y: 340 }],
    // Tail
    [{ x: 240, y: 300 }, { x: 280, y: 280 }],
  ]
};

// 4 base AI style templates
const stylesData = [
  {
    id: "cyberpunk",
    name: "Cyberpunk Kunoichi",
    category: "Sci-Fi Manga",
    src: "/gallery_cyberpunk.png",
    prompt: "Garota ninja cibernética em Neo-Tokyo, detalhes neon, visor holográfico.",
  },
  {
    id: "fantasy",
    name: "Arcane Sorceress",
    category: "Fantasy Ink",
    src: "/gallery_wizard.png",
    prompt: "Feiticeira conjurando runas arcanas em biblioteca antiga, traço de nanquim detalhado.",
  },
  {
    id: "shonen",
    name: "Custom Manga Art",
    category: "Action Shonen",
    src: "/gallery_action.png",
    prompt: "Cena de ação shonen com guerreiro dinâmico, linhas de velocidade dramáticas.",
  },
  {
    id: "portrait",
    name: "Silent Breath",
    category: "Anime Portrait",
    src: "/manga_final.png",
    prompt: "Retrato delicado de garota de anime sorrindo, hachuras leves, estilo mangá clássico.",
  },
];

// Keyword-based templates to simulate smart image-to-image AI triggers
const keywordTemplates = [
  {
    id: "tree",
    src: "/manga_tree.png",
    keywords: ["árvore", "arvore", "tree", "floresta", "forest", "folha", "natureza", "nature", "planta", "plant", "galho"],
    name: "Natureza / Árvore"
  },
  {
    id: "dog",
    src: "/manga_dog.png",
    keywords: ["cachorro", "cão", "cao", "dog", "animal", "pet", "gato", "cat", "filhote", "puppy", "mascote"],
    name: "Animal / Mascote"
  },
  {
    id: "portrait", // Reuses portrait ID but triggers dynamically on keywords
    src: "/manga_final.png",
    keywords: ["boneca", "boneco", "personagem", "garota", "menina", "girl", "rosto", "face", "humano", "human", "olhos", "eyes"],
    name: "Retrato / Boneca"
  }
];

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const preloadedStylesRef = useRef<{ [key: string]: HTMLImageElement }>({});
  
  const [brushColor, setBrushColor] = useState("#D92B2B"); // Start with Manga Crimson Red
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Custom cursor states
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMouseInCanvas, setIsMouseInCanvas] = useState(false);
  
  // AI Refinement and Style states
  const [selectedStyle, setSelectedStyle] = useState(stylesData[0]);
  const [customPrompt, setCustomPrompt] = useState("");
  
  // Active target parameters for the ongoing simulation run
  const [activeTargetId, setActiveTargetId] = useState("");
  const [resultImage, setResultImage] = useState("");
  const [resultName, setResultName] = useState("");

  // Simulated state controls
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isDrawingExample, setIsDrawingExample] = useState(false);

  // User strokes for geometric shape classification
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const strokesRef = useRef<Stroke[]>([]);
  const [detectedSketchType, setDetectedSketchType] = useState<string>("");
  const [activeGuideType, setActiveGuideType] = useState<"portrait" | "tree" | "dog">("portrait");
  const [aiAnalysisResult, setAiAnalysisResult] = useState({
    pattern: "Desconhecido",
    confidence: 0,
    details: ""
  });

  const colors = [
    { name: "Vermelho Mangá", value: "#D92B2B", shadow: "shadow-brand-purple/30" },
    { name: "Rosa Coral", value: "#FF5A5A", shadow: "shadow-brand-pink/30" },
    { name: "Azul de Esboço", value: "#38BDF8", shadow: "shadow-brand-cyan/30" },
    { name: "Ouro", value: "#FACC15", shadow: "shadow-yellow-500/30" },
    { name: "Branco", value: "#FFFFFF", shadow: "shadow-white/30" },
    { name: "Nanquim", value: "#0A0A0C", shadow: "shadow-black/30" },
  ];

  const drawSketchInstant = (type: "portrait" | "tree" | "dog") => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    // Set dark background
    ctx.fillStyle = "#141416";
    ctx.fillRect(0, 0, 400, 400);

    // Draw reference grid lines faintly
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for (let i = 50; i < 400; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 400);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(400, i);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
    ctx.lineWidth = 1.5;

    const paths = sampleSketches[type];
    paths.forEach((path) => {
      const start = path[0] as { x: number; y: number };
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      const next = path[1];
      if (next) {
        if ("type" in next && next.type === "arc") {
          const arc = next as { cx: number; cy: number; r: number };
          ctx.arc(arc.cx, arc.cy, arc.r, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          const nPoint = next as { x: number; y: number };
          ctx.lineTo(nPoint.x, nPoint.y);
          ctx.stroke();
        }
      } else {
        ctx.closePath();
      }
    });

    // Restore user brush settings
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;

    // Populate strokes state so it classifies correctly
    const newStrokes: Stroke[] = [];
    paths.forEach((path) => {
      const start = path[0] as { x: number; y: number };
      const strokePoints: Point[] = [{ x: start.x, y: start.y }];
      const next = path[1];
      if (next) {
        if ("type" in next && next.type === "arc") {
          const cx = next.cx as number;
          const cy = next.cy as number;
          const r = next.r as number;
          for (let a = 0; a < Math.PI * 2; a += 0.5) {
            strokePoints.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
          }
        } else if ("x" in next && "y" in next) {
          strokePoints.push({ x: next.x as number, y: next.y as number });
        }
      }
      newStrokes.push({ points: strokePoints });
    });
    strokesRef.current = newStrokes;
    setStrokes(newStrokes);
    setDetectedSketchType(type);
  };

  // Set up Canvas and Preload Style Images
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use 2x scale for retina support
    canvas.width = 400 * 2;
    canvas.height = 400 * 2;
    canvas.style.width = "100%";
    canvas.style.maxHeight = "400px";

    const context = canvas.getContext("2d");
    if (!context) return;

    context.scale(2, 2);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;
    contextRef.current = context;

    // Draw initial portrait sketch guide on load so canvas doesn't load empty
    setTimeout(() => {
      drawSketchInstant("portrait");
    }, 50);

    // Preload all base style templates
    stylesData.forEach((style) => {
      const img = new window.Image();
      img.src = style.src;
      img.onload = () => {
        preloadedStylesRef.current[style.id] = img;
      };
    });

    // Preload smart keyword-based templates
    keywordTemplates.forEach((tmpl) => {
      const img = new window.Image();
      img.src = tmpl.src;
      img.onload = () => {
        preloadedStylesRef.current[tmpl.id] = img;
      };
    });
  }, []);

  // Update stroke properties
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = brushColor;
      contextRef.current.lineWidth = brushSize;
    }
  }, [brushColor, brushSize]);

  // Drawing logic: Mouse & Touch handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (isDrawingExample || isGenerating) return;
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);

    // Record stroke points in ref to avoid laggy React re-renders during active drawing
    strokesRef.current.push({ points: [{ x, y }] });
    setDetectedSketchType("");
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current || !canvasRef.current || isDrawingExample || isGenerating) return;
    e.preventDefault();

    const rect = canvasRef.current.getBoundingClientRect();
    let clientX, clientY;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();

    // Buffer coordinates in ref instantly
    if (strokesRef.current.length > 0) {
      strokesRef.current[strokesRef.current.length - 1].points.push({ x, y });
    }
  };

  const stopDrawing = () => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);

    // Sync to React state once stroke is finished to trigger batch analysis
    setStrokes([...strokesRef.current]);
  };

  const clearCanvas = (init: boolean = false) => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    context.fillStyle = "#141416";
    context.fillRect(0, 0, 400, 400);

    // Draw reference grid lines faintly
    context.strokeStyle = "rgba(255,255,255,0.03)";
    context.lineWidth = 1;
    for (let i = 50; i < 400; i += 50) {
      context.beginPath();
      context.moveTo(i, 0);
      context.lineTo(i, 400);
      context.stroke();

      context.beginPath();
      context.moveTo(0, i);
      context.lineTo(400, i);
      context.stroke();
    }

    // Restore brush settings
    if (!init) {
      context.strokeStyle = brushColor;
      context.lineWidth = brushSize;
    }

    strokesRef.current = [];
    setStrokes([]);
    setDetectedSketchType("");
  };

  // Load and animate the sample drawing guide
  const loadSampleSketch = (type: "portrait" | "tree" | "dog") => {
    if (isDrawingExample || isGenerating) return;
    setIsDrawingExample(true);
    clearCanvas(false);
    
    const ctx = contextRef.current;
    if (!ctx) return;

    // Use light blue sketch pencil style
    ctx.strokeStyle = "rgba(56, 189, 248, 0.75)";
    ctx.lineWidth = 1.5;

    const paths = sampleSketches[type];
    let pathIdx = 0;
    let pointIdx = 0;

    // Populate strokes and guide state
    const newStrokes: Stroke[] = [];
    paths.forEach((path) => {
      const start = path[0] as { x: number; y: number };
      const strokePoints: Point[] = [{ x: start.x, y: start.y }];
      const next = path[1];
      if (next) {
        if ("type" in next && next.type === "arc") {
          const cx = next.cx as number;
          const cy = next.cy as number;
          const r = next.r as number;
          for (let a = 0; a < Math.PI * 2; a += 0.5) {
            strokePoints.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
          }
        } else if ("x" in next && "y" in next) {
          strokePoints.push({ x: next.x as number, y: next.y as number });
        }
      }
      newStrokes.push({ points: strokePoints });
    });
    strokesRef.current = newStrokes;
    setStrokes(newStrokes);
    setDetectedSketchType(type);

    const animateSketch = () => {
      if (pathIdx >= paths.length) {
        // Restore user brush settings
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
        setIsDrawingExample(false);
        return;
      }

      const path = paths[pathIdx];
      const start = path[0] as { x: number; y: number };

      if (pointIdx === 0) {
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
      }

      const next = path[pointIdx + 1];
      if (next) {
        if ("type" in next && next.type === "arc") {
          const arc = next as { cx: number; cy: number; r: number };
          ctx.arc(arc.cx, arc.cy, arc.r, 0, Math.PI * 2);
          ctx.stroke();
          pathIdx++;
          pointIdx = 0;
        } else {
          const nPoint = next as { x: number; y: number };
          ctx.lineTo(nPoint.x, nPoint.y);
          ctx.stroke();
          pointIdx++;
        }
      } else {
        ctx.closePath();
        pathIdx++;
        pointIdx = 0;
      }

      // Slightly staggered drawing velocity
      setTimeout(animateSketch, 25);
    };

    animateSketch();
  };

  // Classify user drawings geometrically and prompt-wise
  const classifyDrawing = (currentStrokes: Stroke[], prompt: string) => {
    const promptLower = prompt.toLowerCase();

    // 1. Check prompt first for explicit keywords
    const isTreePrompt = ["árvore", "arvore", "tree", "floresta", "forest", "folha", "natureza", "nature", "planta", "plant", "galho"].some(kw => promptLower.includes(kw));
    const isDogPrompt = ["cachorro", "cão", "cao", "dog", "animal", "pet", "gato", "cat", "filhote", "puppy", "mascote"].some(kw => promptLower.includes(kw));
    const isPortraitPrompt = ["boneca", "boneco", "personagem", "garota", "menina", "girl", "rosto", "face", "humano", "human", "olhos", "eyes", "portrait", "retrato"].some(kw => promptLower.includes(kw));

    if (isTreePrompt) {
      return { pattern: "Natureza / Árvore", id: "tree", confidence: 98, details: "Identificado por termo no prompt" };
    }
    if (isDogPrompt) {
      return { pattern: "Animal / Mascote", id: "dog", confidence: 98, details: "Identificado por termo no prompt" };
    }
    if (isPortraitPrompt) {
      return { pattern: "Retrato / Boneca", id: "portrait", confidence: 98, details: "Identificado por termo no prompt" };
    }

    // If a reference guide was loaded and there are strokes, return that
    if (detectedSketchType && currentStrokes.length > 0) {
      if (detectedSketchType === "tree") {
        return { pattern: "Natureza / Árvore", id: "tree", confidence: 95, details: "Guia de referência carregado" };
      }
      if (detectedSketchType === "dog") {
        return { pattern: "Animal / Mascote", id: "dog", confidence: 95, details: "Guia de referência carregado" };
      }
      if (detectedSketchType === "portrait") {
        return { pattern: "Retrato / Boneca", id: "portrait", confidence: 95, details: "Guia de referência carregado" };
      }
    }

    // 2. Perform geometric check of strokes if prompt is neutral/empty
    if (currentStrokes.length === 0) {
      return { pattern: "Estilo Selecionado", id: selectedStyle.id, confidence: 100, details: "Canvas vazio, usando estilo padrão" };
    }

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    let totalPoints = 0;

    currentStrokes.forEach(stroke => {
      stroke.points.forEach(p => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
        totalPoints++;
      });
    });

    if (totalPoints < 5 || minX === Infinity) {
      return { pattern: "Estilo Selecionado", id: selectedStyle.id, confidence: 100, details: "Rascunho muito pequeno, usando estilo padrão" };
    }

    const width = maxX - minX;
    const height = maxY - minY;
    const aspectRatio = width / (height || 1);

    // Distribution calculation (points in upper half vs lower half)
    const midY = minY + height / 2;
    let pointsInUpper = 0;
    let pointsInLower = 0;

    currentStrokes.forEach(stroke => {
      stroke.points.forEach(p => {
        if (p.y < midY) pointsInUpper++;
        else pointsInLower++;
      });
    });

    const upperRatio = pointsInUpper / (pointsInUpper + pointsInLower || 1);

    // Heuristics:
    if (aspectRatio > 1.25) {
      const conf = Math.min(94, Math.round(75 + aspectRatio * 10));
      return {
        pattern: "Animal / Mascote",
        id: "dog",
        confidence: conf,
        details: `Formato horizontal detectado (Proporção L/A: ${aspectRatio.toFixed(2)})`
      };
    }

    if (upperRatio > 0.6) {
      const conf = Math.min(94, Math.round(65 + upperRatio * 40));
      return {
        pattern: "Natureza / Árvore",
        id: "tree",
        confidence: conf,
        details: `Distribuição superior densa (Copa detectada: ${(upperRatio * 100).toFixed(0)}%)`
      };
    }

    const conf = Math.min(94, Math.round(80 + (0.5 - Math.abs(0.5 - upperRatio)) * 30));
    return {
      pattern: "Retrato / Boneca",
      id: "portrait",
      confidence: conf,
      details: `Formato vertical equilibrado (Retícula: ${(upperRatio * 100).toFixed(0)}% superior)`
    };
  };

  // Run AI Simulation with horizontal scanline animation
  const handleGeneratePanel = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (isGenerating || isDrawingExample || !canvas || !ctx) return;

    // Run classifier
    const analysis = classifyDrawing(strokes, customPrompt);
    setAiAnalysisResult(analysis);

    const targetId = analysis.id;
    let targetSrc = "";
    let targetName = analysis.pattern;

    // Find image source matching targetId
    const matchedStyle = stylesData.find(s => s.id === targetId);
    const matchedKeyword = keywordTemplates.find(k => k.id === targetId);

    if (matchedKeyword) {
      targetSrc = matchedKeyword.src;
    } else if (matchedStyle) {
      targetSrc = matchedStyle.src;
      targetName = matchedStyle.name;
    } else {
      targetSrc = selectedStyle.src;
      targetName = selectedStyle.name;
    }

    setActiveTargetId(targetId);
    setResultImage(targetSrc);
    setResultName(targetName);
    setIsGenerating(true);
    setGenerationStep(1);

    // Capture the current sketch
    const sketchImage = new Image();
    sketchImage.src = canvas.toDataURL();

    // Start scanline animation
    let scanlineY = 0;
    const speed = 2.8;

    const animateScanline = () => {
      ctx.fillStyle = "#120F1D";
      ctx.fillRect(0, 0, 400, 400);

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, scanlineY, 400, 400 - scanlineY);
      ctx.clip();
      ctx.drawImage(sketchImage, 0, 0, 400, 400);
      ctx.restore();

      const finalImg = preloadedStylesRef.current[targetId] || preloadedStylesRef.current[selectedStyle.id];
      if (finalImg) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, 400, scanlineY);
        ctx.clip();
        ctx.drawImage(finalImg, 0, 0, 400, 400);
        ctx.restore();
      }

      if (scanlineY < 400) {
        ctx.save();
        ctx.strokeStyle = "rgba(56, 189, 248, 0.95)";
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "#38BDF8";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(0, scanlineY);
        ctx.lineTo(400, scanlineY);
        ctx.stroke();
        ctx.restore();
      }

      const progressPercent = scanlineY / 400;
      if (progressPercent < 0.25) {
        setGenerationStep(1);
      } else if (progressPercent < 0.55) {
        setGenerationStep(2);
      } else if (progressPercent < 0.8) {
        setGenerationStep(3);
      } else {
        setGenerationStep(4);
      }

      if (scanlineY < 400) {
        scanlineY += speed;
        requestAnimationFrame(animateScanline);
      } else {
        if (finalImg) {
          ctx.drawImage(finalImg, 0, 0, 400, 400);
        }
        
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#D92B2B", "#FF5A5A", "#38BDF8"],
        });

        setTimeout(() => {
          setIsGenerating(false);
          setGenerationStep(0);
          setShowModal(true);
        }, 650);
      }
    };

    sketchImage.onload = () => {
      requestAnimationFrame(animateScanline);
    };
  };

  // Mouse coordinate updates for custom cursor
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  return (
    <section id="demo" className="py-24 relative overflow-hidden bg-brand-bg bg-manga-draft-grid bg-manga-screentone">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-purple/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-xs font-semibold uppercase tracking-wider mb-4">
            <Wand2 className="w-3.5 h-3.5 text-brand-cyan" />
            Sandbox Interativa
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Desenhe no Nosso{" "}
            <span className="bg-gradient-to-r from-brand-purple to-brand-cyan bg-clip-text text-transparent text-neon-glow-purple">
              Canvas Virtual
            </span>
          </h2>
          <p className="text-slate-400 font-light max-w-xl mx-auto text-sm sm:text-base">
            Esboce qualquer traço com o mouse ou toque. Escolha um estilo de referência e digite no prompt (ex: &quot;árvore&quot;, &quot;cachorro&quot; ou &quot;boneca&quot;) para testar a inteligência da IA!
          </p>
        </div>

        {/* Studio Workspace Layout */}
        <div className="max-w-5xl mx-auto manga-card-panel manga-crop-marks overflow-hidden flex flex-col md:grid md:grid-cols-12">
          
          {/* Sidebar Tools Column (Col 5) */}
          <div className="p-6 md:col-span-5 bg-[#0E0B1C]/80 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              
              {/* Brush section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sliders className="w-4 h-4 text-brand-cyan" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Estúdio de Pincéis
                  </h3>
                </div>

                {/* Color Palette Selector */}
                <div className="mb-4">
                  <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">
                    Cor do Nanquim
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setBrushColor(color.value)}
                        className={`w-7 h-7 rounded-lg transition-all duration-300 border-2 flex items-center justify-center ${
                          brushColor === color.value 
                            ? "scale-110 border-white" 
                            : "border-transparent hover:scale-105"
                        } ${color.shadow}`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      >
                        {brushColor === color.value && (
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            color.value === "#FFFFFF" ? "bg-black" : "bg-white"
                          }`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brush Thickness Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      Espessura do Pincel
                    </label>
                    <span className="text-xs font-mono font-semibold text-brand-cyan">{brushSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-purple focus:outline-none"
                  />
                </div>
              </div>

              <div className="h-px bg-white/5" />

              {/* Reference Guides Selector */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <PenTool className="w-4 h-4 text-brand-cyan" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Guias de Esboço
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "portrait", name: "Retrato" },
                    { id: "tree", name: "Árvore" },
                    { id: "dog", name: "Cachorro" }
                  ].map((guide) => (
                    <button
                      key={guide.id}
                      onClick={() => {
                        const newType = guide.id as "portrait" | "tree" | "dog";
                        setActiveGuideType(newType);
                        drawSketchInstant(newType);
                      }}
                      className={`py-2 px-1 rounded-xl text-center border transition-all duration-300 text-[10px] font-bold ${
                        activeGuideType === guide.id
                          ? "bg-brand-cyan/10 border-brand-cyan/50 text-brand-cyan shadow-glow-cyan"
                          : "bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/15 hover:text-slate-200"
                      }`}
                    >
                      {guide.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/5" />

              {/* AI Reference Style Selector */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <PenTool className="w-4 h-4 text-brand-pink" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Estilo de Destino da IA
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {stylesData.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style)}
                      className={`p-2.5 rounded-xl text-left border transition-all duration-300 flex flex-col justify-between min-h-[68px] ${
                        selectedStyle.id === style.id
                          ? "bg-brand-purple/10 border-brand-purple/50 shadow-glow-purple"
                          : "bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]"
                      }`}
                    >
                      <span className="text-[10px] font-bold text-slate-200 block truncate leading-tight">
                        {style.name}
                      </span>
                      <span className="text-[8px] font-mono text-brand-cyan uppercase tracking-wider block mt-1">
                        {style.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Refinement Custom Prompt Input */}
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">
                  Instruções Adicionais para IA (Opcional)
                </label>
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Ex: desenhar árvore, cão, boneca..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple/50 transition-colors duration-200"
                />
                <span className="text-[9px] font-mono text-slate-500 block mt-1.5 leading-relaxed">
                  💡 Experimente digitar &quot;árvore&quot;, &quot;cão&quot; ou &quot;boneca&quot; para ver a IA reconhecer seu desenho!
                </span>
              </div>

            </div>

            {/* Quick Actions Panel */}
            <div className="space-y-3 pt-6 border-t border-white/5">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => clearCanvas(false)}
                  disabled={isDrawingExample || isGenerating}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-white/10 hover:border-red-500/30 text-xs font-semibold text-slate-300 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Limpar
                </button>
                <button
                  onClick={() => loadSampleSketch(activeGuideType)}
                  disabled={isDrawingExample || isGenerating}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-white/10 hover:border-brand-cyan/30 text-xs font-semibold text-slate-300 hover:text-brand-cyan hover:bg-brand-cyan/5 transition-all duration-200 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isDrawingExample ? "animate-spin text-brand-cyan" : ""}`} />
                  Esboço
                </button>
              </div>

              <button
                onClick={handleGeneratePanel}
                disabled={isGenerating || isDrawingExample}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-xs font-semibold text-white shadow-glow-purple hover:shadow-glow-pink hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
              >
                <Wand2 className="w-3.5 h-3.5 animate-pulse" />
                Renderizar IA
              </button>
            </div>
          </div>

          {/* Canvas Draw Container (Col 7) */}
          <div className="md:col-span-7 relative flex items-center justify-center p-6 bg-[#07050A]">
            
            {/* Canvas wrapper */}
            <div className="relative w-full max-w-[400px] aspect-square rounded-xl overflow-hidden border border-white/10 shadow-inner bg-[#120F1D] flex items-center justify-center">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={(e) => {
                  draw(e);
                  handleCanvasMouseMove(e);
                }}
                onMouseUp={stopDrawing}
                onMouseEnter={() => setIsMouseInCanvas(true)}
                onMouseLeave={() => {
                  stopDrawing();
                  setIsMouseInCanvas(false);
                }}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="block w-full h-full cursor-none touch-none"
              />

              {/* Dynamic stylus brush size cursor */}
              {isMouseInCanvas && !isGenerating && !isDrawingExample && (
                <div
                  className="absolute rounded-full border border-white/40 bg-white/5 pointer-events-none -translate-x-1/2 -translate-y-1/2 z-30 shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                  style={{
                    left: `${mousePos.x}px`,
                    top: `${mousePos.y}px`,
                    width: `${brushSize}px`,
                    height: `${brushSize}px`,
                  }}
                />
              )}

              {/* Rendering/Analyzing Overlay */}
              <AnimatePresence>
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#0C0914]/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center select-none z-20"
                  >
                    {/* Animated Loader Circle */}
                    <div className="relative w-16 h-16 mb-6">
                      <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                      <div className="absolute inset-0 rounded-full border-4 border-brand-purple border-t-transparent animate-spin" />
                      <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-brand-pink animate-pulse" />
                    </div>

                    <h4 className="text-sm font-semibold text-white mb-1">
                      Forge AI Renderizando...
                    </h4>

                    {/* AI Pattern Detection Result display */}
                    <div className="mb-4 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 inline-flex flex-col items-center">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400">Padrão Detectado</span>
                      <span className="text-xs font-bold text-brand-pink">{aiAnalysisResult.pattern}</span>
                      <span className="text-[9px] text-brand-cyan/90 font-mono mt-0.5">{aiAnalysisResult.details} ({aiAnalysisResult.confidence}% conf.)</span>
                    </div>

                    {/* Progress details */}
                    <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mb-3">
                      <motion.div
                        className="h-full bg-gradient-to-r from-brand-purple to-brand-cyan"
                        initial={{ width: "0%" }}
                        animate={{ 
                          width: 
                            generationStep === 1 ? "25%" : 
                            generationStep === 2 ? "55%" : 
                            generationStep === 3 ? "80%" : "100%" 
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    
                    <span className="text-[11px] font-mono text-brand-cyan/80 h-4 transition-all duration-300 max-w-[280px] truncate block">
                      {generationStep === 1 && "Analisando traços vetoriais..."}
                      {generationStep === 2 && `Estilo: ${resultName}...`}
                      {generationStep === 3 && (customPrompt ? `Aplicando detalhes: "${customPrompt}"...` : "Gerando hachuras e retículas...")}
                      {generationStep === 4 && "Finalizando lineart de alta fidelidade..."}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Ambient glows behind workspace */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />
          </div>

        </div>
      </div>

      {/* Styled Success / Download Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-lg p-6 rounded-2xl glass-card border-brand-cyan/30 bg-[#0E0C17] shadow-glow-cyan text-center z-10"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4.5 right-4.5 text-xs text-slate-500 hover:text-white"
              >
                Fechar
              </button>

              <div className="mx-auto w-12 h-12 rounded-full bg-brand-cyan/15 flex items-center justify-center mb-4 text-brand-cyan">
                <CheckCircle2 className="w-7 h-7 text-brand-cyan shadow-glow-cyan rounded-full" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Forjamento Completo!
              </h3>
              
              <p className="text-slate-300 text-sm font-light leading-relaxed mb-1 block">
                Seu rascunho foi processado e refinado com sucesso no estilo
              </p>
              <span className="text-xs font-mono text-brand-cyan uppercase tracking-wider block mb-5">
                {resultName} {customPrompt && `+ "${customPrompt}"`}
              </span>

              {/* Image Preview Area */}
              <div className="relative w-full aspect-square max-w-[260px] mx-auto rounded-xl overflow-hidden border border-white/10 shadow-lg bg-[#0C0914] mb-6 flex items-center justify-center">
                <img
                  src={resultImage}
                  alt={resultName}
                  className="object-contain w-full h-full"
                />
              </div>

              <div className="flex gap-3">
                <a
                  href={resultImage}
                  download={`mangaforge-${activeTargetId}.png`}
                  className="flex-1 py-3 rounded-xl border border-white/10 hover:border-brand-cyan/30 bg-white/5 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-all duration-200"
                >
                  Baixar Lineart
                </a>
                <button
                  onClick={() => {
                    setShowModal(false);
                    // Scroll to CTA
                    const ctaSection = document.getElementById("cta");
                    if (ctaSection) {
                      ctaSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-purple text-xs font-bold uppercase tracking-wider text-white shadow-glow-cyan hover:opacity-95 transition-opacity duration-200"
                >
                  Acesso Beta
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
