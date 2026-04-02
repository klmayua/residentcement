import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Golden Monolith - Dark Theme (Obsidian Gilt) */
        background: "#161311",
        foreground: "#e9e1dd",

        surface: {
          DEFAULT: "#161311",
          bright: "#1a1c1c",
          dim: "#1c1917",
          variant: "#292524",
        },

        "surface-container": {
          lowest: "#0c0a09",
          low: "#1c1917",
          DEFAULT: "#221f1d",
          high: "#292524",
          highest: "#383432",
        },

        /* Primary: Gold */
        primary: {
          DEFAULT: "#e5c374",
          container: "#9c7f38",
          fixed: "#ffdf99",
          "fixed-dim": "#e8c265",
          foreground: "#161311",
        },

        /* Secondary: Warm Gray */
        secondary: {
          DEFAULT: "#a8a29e",
          container: "#57534e",
          fixed: "#e5e2e1",
          "fixed-dim": "#c8c6c5",
          foreground: "#161311",
        },

        /* Tertiary: Muted Blue */
        tertiary: {
          DEFAULT: "#99a7dc",
          container: "#364573",
          fixed: "#dce1ff",
          "fixed-dim": "#b6c4fb",
          foreground: "#161311",
        },

        error: {
          DEFAULT: "#ffb4ab",
          container: "#93000a",
          foreground: "#161311",
        },

        outline: {
          DEFAULT: "#7e7667",
          variant: "#4d4540",
        },

        /* Semantic Tokens */
        "on-primary": "#161311",
        "on-primary-container": "#ffdf99",
        "on-surface": "#e9e1dd",
        "on-surface-variant": "#c1c6ce",
        "on-background": "#e9e1dd",
        "on-error": "#690005",

        /* Inverse Colors */
        "inverse-surface": "#e9e1dd",
        "inverse-on-surface": "#161311",
        "inverse-primary": "#745b17",
        "surface-tint": "#e5c374",

        /* Brand Colors */
        brand: {
          gold: "#e5c374",
          goldLight: "#ffdf99",
          goldDark: "#9c7f38",
          obsidian: "#161311",
          charcoal: "#1a1c1c",
          stone: "#292524",
        },

        /* Stone Palette - Dark Mode */
        stone: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
          950: "#0c0a09",
        },
      },

      fontFamily: {
        /* Noto Serif for headlines - The Golden Monolith Authority */
        headline: ["var(--font-noto-serif)", "Georgia", "serif"],
        /* Plus Jakarta Sans for body - Clean precision */
        sans: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
        body: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
        label: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
      },

      /* Sharp architectural corners - dealer portal style */
      borderRadius: {
        DEFAULT: "0px",
        sm: "0px",
        md: "0px",
        lg: "0px",
        xl: "0px",
        full: "9999px",
      },

      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-down": "slideDown 0.6s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },

      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.3), 0 10px 20px -2px rgba(0, 0, 0, 0.2)",
        card: "0 0 0 1px rgba(255, 255, 255, 0.03), 0 1px 3px 0 rgba(0, 0, 0, 0.3)",
        elevated: "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
        glow: "0 0 40px rgba(229, 195, 116, 0.15)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
