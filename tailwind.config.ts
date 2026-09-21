import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#080b0d",
        surface: "#0d1416",
        line: "#1f4a3a",
        accent: "#6cf7ad",
        ink: "#e8f1ee",
        muted: "#8a9a96",
        warn: "#f5c542",
        tint: {
          green: "#1f6b4a",
          teal: "#1f5a66",
          maroon: "#5a1f3a",
          amber: "#5a4a1f",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "14px",
        panel: "24px",
        field: "12px",
      },
      boxShadow: {
        glow: "0 0 24px rgba(108, 247, 173, 0.28)",
        "glow-lg": "0 0 36px rgba(108, 247, 173, 0.35)",
      },
      keyframes: {
        drift: {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(0, -50%, 0)" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
      },
      animation: {
        drift: "drift 90s linear infinite",
        blink: "blink 1s steps(1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
