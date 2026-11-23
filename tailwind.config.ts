import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: { DEFAULT: "#0D1117" },
        blueprint: { DEFAULT: "#111927", 800: "#0F1722", 700: "#16202F" },
        neural: { DEFAULT: "#00F0FF", dim: "#0891B2" },
        sawdust: { DEFAULT: "#F59E0B", dim: "#B45309" },
        pine: { DEFAULT: "#10B981", dim: "#047857" },
        coral: { DEFAULT: "#FF4D6D", dim: "#BE185D" },
        chalk: "#F8FAFC",
        pewter: "#94A3B8",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.03em",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
