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
        // Material Design 3 Color System - Professional Admin Theme
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
          DEFAULT: "#745b17", // Gold/Brown for authority
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Legacy brand mapping
        brand: {
          primary: "#1C1917",
          primaryDark: "#0f0e0d",
          secondary: "#C5A55A",
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
        DEFAULT: "0.125rem",
        sm: "0.125rem",
        md: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
        "2xl": "1rem",
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
      },
    },
  },
  plugins: [],
};

export default config;
