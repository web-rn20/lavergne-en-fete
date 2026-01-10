import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs principales
        charcoal: {
          DEFAULT: "#1A1A1A",
          light: "#2A2A2A",
          dark: "#0D0D0D",
        },
        pearl: {
          DEFAULT: "#F5F5F5",
          muted: "#E0E0E0",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#E5C76B",
          dark: "#B8962E",
        },
        // Couleurs d'accent (Hover/Interaction)
        "stadium-red": "#C8102E",
        "tfc-violet": "#5B2D8E",
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        handwritten: ["Reenie Beanie", "cursive"],
        body: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      borderWidth: {
        film: "8px",
        polaroid: "12px",
      },
      boxShadow: {
        film: "0 4px 20px rgba(0, 0, 0, 0.6)",
        glow: {
          gold: "0 0 20px rgba(212, 175, 55, 0.5)",
          red: "0 0 20px rgba(200, 16, 46, 0.5)",
          violet: "0 0 20px rgba(91, 45, 142, 0.5)",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(212, 175, 55, 0.3)" },
          "100%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
