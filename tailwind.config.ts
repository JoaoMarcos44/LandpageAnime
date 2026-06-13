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
          bg: "#06040A",
          dark: "#0C0914",
          purple: "#A855F7",
          pink: "#EC4899",
          cyan: "#06B6D4",
        },
      },
      fontFamily: {
        sans: ["var(--font-space)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-purple": "0 0 20px rgba(168, 85, 247, 0.35)",
        "glow-pink": "0 0 20px rgba(236, 72, 153, 0.35)",
        "glow-cyan": "0 0 20px rgba(6, 182, 212, 0.35)",
        "glow-purple-lg": "0 0 40px rgba(168, 85, 247, 0.5)",
        "glow-pink-lg": "0 0 40px rgba(236, 72, 153, 0.5)",
        "glow-cyan-lg": "0 0 40px rgba(6, 182, 212, 0.5)",
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
