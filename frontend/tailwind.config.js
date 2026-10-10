/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#0A0F1F",
          surface: "#0F1729",
          elevated: "#141E33",
          border: "#1F2A44",
        },
        accent: {
          blue: "#3B82F6",
          violet: "#8B5CF6",
          cyan: "#06B6D4",
        },
        status: {
          success: "#10B981",
          warning: "#F59E0B",
          danger: "#EF4444",
          muted: "#64748B",
        },
        text: {
          primary: "#F8FAFC",
          secondary: "#94A3B8",
          muted: "#64748B",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        glow: "0 0 24px rgba(59, 130, 246, 0.35)",
        "glow-violet": "0 0 24px rgba(139, 92, 246, 0.35)",
      },
    },
  },
  plugins: [],
};