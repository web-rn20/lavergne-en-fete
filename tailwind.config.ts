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
        // Palette Pixelik
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
        // Accents Sport (usage minimal)
        "stadium-red": "#FF2D55",
        "tfc-violet": "#8B5CF6",
      },
      fontFamily: {
        display: ["var(--font-oswald)", "Oswald", "sans-serif"],
        script: ["var(--font-yellowtail)", "Yellowtail", "cursive"],
        body: ["var(--font-montserrat)", "Montserrat", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      spacing: {
        "18": "4.5rem",
        "26": "6.5rem",
        "104": "26rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
