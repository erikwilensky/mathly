import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0B1020",
          panel: "#131A2E",
          "panel-raised": "#1B2440",
          line: "#2A3457",
          ink: "#EEF1FA",
          "ink-soft": "#A6AFCC",
          "ink-faint": "#6B7494",
          indigo: "#6C63FF",
          teal: "#2DD4BF",
          gold: "#FFB81C",
          green: "#22C55E",
          red: "#F04B4B",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "Arial", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-6px)" },
          "75%": { transform: "translateX(6px)" },
        },
      },
      animation: {
        pop: "pop 0.18s ease-out",
        shake: "shake 0.3s ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
