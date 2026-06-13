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
          bg: "#0A0A0C", // Ink Black
          dark: "#141416", // Deep Charcoal
          purple: "#D92B2B", // Manga Crimson Red (accent)
          pink: "#FF5A5A", // Manga Coral Rose (sub-accent)
          cyan: "#38BDF8", // Drafting Sky Blue (guidelines)
        },
      },
      fontFamily: {
        sans: ["var(--font-space)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-purple": "0 0 20px rgba(217, 43, 43, 0.35)",
        "glow-pink": "0 0 20px rgba(255, 90, 90, 0.35)",
        "glow-cyan": "0 0 20px rgba(56, 189, 248, 0.35)",
        "glow-purple-lg": "0 0 40px rgba(217, 43, 43, 0.5)",
        "glow-pink-lg": "0 0 40px rgba(255, 90, 90, 0.5)",
        "glow-cyan-lg": "0 0 40px rgba(56, 189, 248, 0.5)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-medium": "float 5s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
