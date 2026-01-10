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
        // Palette Pro-Grade
        cream: {
          DEFAULT: "#F9F8F7",
          dark: "#F3F1EE",
          darker: "#E8E5E0",
        },
        void: {
          DEFAULT: "#080808",
          soft: "#0F0F0F",
          lighter: "#1A1A1A",
        },
        accent: {
          DEFAULT: "#E86A33",
          hover: "#D45A25",
          soft: "#FFF4EF",
        },
        text: {
          primary: "#1A1A1A",
          secondary: "#4A4A4A",
          muted: "#8A8A8A",
          light: "#F5F5F5",
        },
      },
      fontFamily: {
        display: ["var(--font-oswald)", "Oswald", "sans-serif"],
        script: ["var(--font-yellowtail)", "Yellowtail", "cursive"],
        body: ["var(--font-montserrat)", "Montserrat", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      borderRadius: {
        "lg": "16px",
        "xl": "24px",
        "2xl": "32px",
        "3xl": "40px",
        "4xl": "48px",
      },
      boxShadow: {
        "soft": "0 2px 8px rgba(0, 0, 0, 0.08)",
        "card": "0 6px 16px rgba(0, 0, 0, 0.12)",
        "card-hover": "0 12px 32px rgba(0, 0, 0, 0.16)",
        "elevated": "0 16px 48px rgba(0, 0, 0, 0.18)",
      },
      spacing: {
        "18": "4.5rem",
        "26": "6.5rem",
        "104": "26rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "fade-in-up": "fadeInUp 0.7s ease-out forwards",
        "float": "float 4s ease-in-out infinite",
        "draw-arrow": "drawArrow 0.8s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        drawArrow: {
          "to": { strokeDashoffset: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
