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
        // Obsidian Gilt - Dark Theme Color System
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
        primary: {
          DEFAULT: "#e5c374", // Gold
          container: "#9c7f38",
          fixed: "#ffdf99",
          "fixed-dim": "#e8c265",
          foreground: "#161311",
        },
        secondary: {
          DEFAULT: "#a8a29e",
          container: "#57534e",
          fixed: "#e5e2e1",
          foreground: "#161311",
        },
        tertiary: {
          DEFAULT: "#99a7dc",
          container: "#364573",
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
        // Semantic tokens
        "on-primary": "#161311",
        "on-primary-container": "#ffdf99",
        "on-surface": "#e9e1dd",
        "on-surface-variant": "#c1c6ce",
        "on-background": "#e9e1dd",
        "on-error": "#690005",
        "on-error-container": "#ffdad6",
        "on-secondary": "#161311",
        "on-secondary-container": "#e5e2e1",
        "inverse-surface": "#e9e1dd",
        "inverse-on-surface": "#161311",
        "inverse-primary": "#745b17",
        "surface-tint": "#e5c374",
        // Legacy brand mapping
        brand: {
          primary: "#161311",
          primaryLight: "#292524",
          primaryDark: "#0c0a09",
          secondary: "#e5c374",
          secondaryLight: "#e8c265",
          secondaryDark: "#9c7f38",
          accent: "#e5c374",
          gold: "#e5c374",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
          info: "#3b82f6",
        },
        // Cement grayscale (dark adjusted)
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
        sans: ["var(--font-inter)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        display: ["var(--font-noto-serif)", "Noto Serif", "Georgia", "serif"],
        headline: ["Noto Serif", "Georgia", "serif"],
        body: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        label: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.125rem", // 2px
        sm: "0.125rem",
        md: "0.25rem", // 4px
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-down": "slideDown 0.4s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
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
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.3), 0 10px 20px -2px rgba(0, 0, 0, 0.2)",
        card: "0 0 0 1px rgba(255, 255, 255, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.2)",
        elevated: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)",
        ambient: "0 20px 40px rgba(0, 0, 0, 0.4)",
        glow: "0 0 40px rgba(229, 195, 116, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
