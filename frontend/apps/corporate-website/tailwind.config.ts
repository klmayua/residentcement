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
        /* Golden Monolith - Light Theme (Sand/Stone) */
        background: "#f9f9f8",
        foreground: "#1a1c1c",

        surface: {
          DEFAULT: "#f9f9f8",
          bright: "#f9f9f8",
          dim: "#dadad9",
          variant: "#e2e2e2",
        },

        "surface-container": {
          lowest: "#ffffff",
          low: "#f4f4f3",
          DEFAULT: "#eeeeed",
          high: "#e8e8e7",
          highest: "#e2e2e2",
        },

        /* Primary: Rich Gold */
        primary: {
          DEFAULT: "#745b17",
          container: "#c5a55a",
          fixed: "#ffdf99",
          "fixed-dim": "#e5c374",
          foreground: "#ffffff",
        },

        /* Secondary: Warm Gray */
        secondary: {
          DEFAULT: "#5f5e5e",
          container: "#e2dfde",
          fixed: "#e5e2e1",
          "fixed-dim": "#c8c6c5",
          foreground: "#ffffff",
        },

        /* Tertiary: Slate Blue */
        tertiary: {
          DEFAULT: "#4e5c8c",
          container: "#99a7dc",
          fixed: "#dce1ff",
          "fixed-dim": "#b6c4fb",
          foreground: "#ffffff",
        },

        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
          foreground: "#ffffff",
        },

        outline: {
          DEFAULT: "#7e7667",
          variant: "#d0c5b4",
        },

        /* Semantic Tokens */
        "on-primary": "#ffffff",
        "on-primary-container": "#4f3b00",
        "on-primary-fixed": "#251a00",
        "on-primary-fixed-variant": "#5a4300",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#636262",
        "on-secondary-fixed": "#1c1b1b",
        "on-secondary-fixed-variant": "#474746",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#2d3b69",
        "on-tertiary-fixed": "#071845",
        "on-tertiary-fixed-variant": "#364573",
        "on-surface": "#1a1c1c",
        "on-surface-variant": "#4d4639",
        "on-background": "#1a1c1c",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",

        /* Inverse Colors */
        "inverse-surface": "#2f3130",
        "inverse-on-surface": "#f1f1f0",
        "inverse-primary": "#e5c374",
        "surface-tint": "#745b17",

        /* Brand Colors */
        brand: {
          gold: "#745b17",
          goldLight: "#c5a55a",
          goldDark: "#5a4300",
          sand: "#f9f9f8",
          stone: "#e2e2e2",
          charcoal: "#1a1c1c",
        },

        /* Cement Palette */
        cement: {
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
        },
      },

      fontFamily: {
        /* Noto Serif for headlines - The Golden Monolith Authority */
        headline: ["Noto Serif", "Georgia", "Times New Roman", "serif"],
        /* Plus Jakarta Sans for body - Clean precision */
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        body: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        label: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },

      /* 4px Architectural Corners */
      borderRadius: {
        DEFAULT: "0.25rem", // 4px
        sm: "0.125rem",     // 2px
        md: "0.25rem",      // 4px
        lg: "0.5rem",       // 8px
        xl: "0.75rem",      // 12px
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
        /* Ambient Shadows - Premium Feel */
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.1), 0 10px 20px -2px rgba(0, 0, 0, 0.08)",
        card: "0 0 0 1px rgba(0, 0, 0, 0.03), 0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        elevated: "0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.08)",
        ambient: "0 20px 40px rgba(0, 0, 0, 0.1)",
        glow: "0 0 40px rgba(229, 195, 116, 0.2)",
      },

      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
