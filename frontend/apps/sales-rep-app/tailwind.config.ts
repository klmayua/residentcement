import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        /* Golden Monolith - Dark Theme (Mobile Sales App) */
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
        "on-error-container": "#ffdad6",

        /* Status Colors */
        status: {
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
          info: "#3b82f6",
        },

        /* Brand */
        brand: {
          gold: "#e5c374",
          goldLight: "#ffdf99",
          goldDark: "#9c7f38",
          obsidian: "#161311",
          charcoal: "#1a1c1c",
        },
      },

      fontFamily: {
        /* Noto Serif for headlines */
        headline: ["Noto Serif", "Georgia", "serif"],
        /* Plus Jakarta Sans for body */
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        body: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        label: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },

      /* 4px Architectural Corners */
      borderRadius: {
        DEFAULT: "0.25rem",
        sm: "0.125rem",
        md: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px",
      },

      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-down": "slideDown 0.4s ease-out",
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },

      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.3), 0 10px 20px -2px rgba(0, 0, 0, 0.2)",
        card: "0 0 0 1px rgba(255, 255, 255, 0.03), 0 1px 3px 0 rgba(0, 0, 0, 0.3)",
        elevated: "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
        glow: "0 0 30px rgba(229, 195, 116, 0.15)",
      },

      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
