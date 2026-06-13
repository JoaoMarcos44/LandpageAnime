import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          bg:     "#06060C", // 墨色 Sumi — deep ink black
          dark:   "#0D0D1A", // 藍墨 Ai-sumi — indigo charcoal
          purple: "#C8102E", // 朱色 Shu-iro — Japanese vermillion (primary)
          pink:   "#FF6B9D", // 桜色 Sakura — cherry blossom pink (secondary)
          cyan:   "#4361EE", // 藍色 Ai-iro — traditional indigo blue (tertiary)
        },
      },
      fontFamily: {
        sans: ["var(--font-space)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-purple":    "0 0 20px rgba(200, 16, 46, 0.40)",
        "glow-pink":      "0 0 20px rgba(255, 107, 157, 0.35)",
        "glow-cyan":      "0 0 20px rgba(67, 97, 238, 0.35)",
        "glow-purple-lg": "0 0 45px rgba(200, 16, 46, 0.55)",
        "glow-pink-lg":   "0 0 45px rgba(255, 107, 157, 0.50)",
        "glow-cyan-lg":   "0 0 45px rgba(67, 97, 238, 0.50)",
      },
      animation: {
        "pulse-slow":   "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float-slow":   "float 8s ease-in-out infinite",
        "float-medium": "float 5s ease-in-out infinite",
        "spin-slow":    "spin 20s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-15px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
