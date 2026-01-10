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
        // Palette Luxe Minimaliste
        void: {
          DEFAULT: "#080808",
          soft: "#0F0F0F",
          lighter: "#1A1A1A",
        },
        "off-white": {
          DEFAULT: "#F5F5F5",
          muted: "#A0A0A0",
          dim: "#606060",
        },
      },
      fontFamily: {
        display: ["var(--font-oswald)", "Oswald", "sans-serif"],
        script: ["var(--font-yellowtail)", "Yellowtail", "cursive"],
        body: ["var(--font-montserrat)", "Montserrat", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      borderRadius: {
        "luxury": "32px",
        "luxury-xl": "40px",
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
      },
    },
  },
  plugins: [],
};

export default config;
