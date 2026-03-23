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
        // Material Design 3 Color System - The Golden Monolith
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
        primary: {
          DEFAULT: "#745b17",
          container: "#c5a55a",
          fixed: "#ffdf99",
          "fixed-dim": "#e5c374",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#5f5e5e",
          container: "#e2dfde",
          fixed: "#e5e2e1",
          "fixed-dim": "#c8c6c5",
          foreground: "#ffffff",
        },
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
        // Semantic tokens
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
        "inverse-surface": "#2f3130",
        "inverse-on-surface": "#f1f1f0",
        "inverse-primary": "#e5c374",
        "surface-tint": "#745b17",
        // Legacy brand mapping for backward compatibility
        brand: {
          primary: "#745b17",
          secondary: "#5f5e5e",
          accent: "#c5a55a",
          dark: "#1a1c1c",
          light: "#f4f4f3",
          gold: "#c5a55a",
        },
        // Cement grayscale
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
        DEFAULT: "0.125rem", // 2px - architectural sharpness
        sm: "0.125rem",
        md: "0.25rem", // 4px
        lg: "0.5rem", // 8px
        xl: "0.75rem",
        full: "9999px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
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
        soft: "0 2px 15px -3px rgba(26, 28, 28, 0.07), 0 10px 20px -2px rgba(26, 28, 28, 0.04)",
        card: "0 0 0 1px rgba(26, 28, 28, 0.05), 0 1px 3px 0 rgba(26, 28, 28, 0.1)",
        elevated: "0 10px 15px -3px rgba(26, 28, 28, 0.1), 0 4px 6px -2px rgba(26, 28, 28, 0.05)",
        ambient: "0 20px 40px rgba(26, 28, 28, 0.06)",
        glow: "0 0 40px rgba(197, 165, 90, 0.15)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
