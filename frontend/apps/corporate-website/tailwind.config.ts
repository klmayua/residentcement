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
        // Monolithic Curator Design System
        background: "#f9f9f9",
        foreground: "#1a1c1c",
        surface: {
          DEFAULT: "#f9f9f9",
          bright: "#f9f9f9",
          dim: "#dadada",
          variant: "#e2e2e2",
        },
        "surface-container": {
          lowest: "#ffffff",
          low: "#f3f3f3",
          DEFAULT: "#eeeeee",
          high: "#e8e8e8",
          highest: "#e2e2e2",
        },
        // Primary: Authoritative Black (#000000)
        primary: {
          DEFAULT: "#000000",
          container: "#1c1b1b",
          fixed: "#e5e2e1",
          "fixed-dim": "#c8c6c5",
          foreground: "#ffffff",
        },
        // Secondary: Camel Gold (#79591f)
        secondary: {
          DEFAULT: "#79591f",
          container: "#fdd08b",
          fixed: "#ffdead",
          "fixed-dim": "#ebc07c",
          foreground: "#ffffff",
        },
        tertiary: {
          DEFAULT: "#000000",
          container: "#1b1c1c",
          fixed: "#e4e2e2",
          "fixed-dim": "#c8c6c6",
          foreground: "#ffffff",
        },
        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
          foreground: "#ffffff",
        },
        outline: {
          DEFAULT: "#747878",
          variant: "#c4c7c7",
        },
        // Semantic tokens
        "on-primary": "#ffffff",
        "on-primary-container": "#858383",
        "on-primary-fixed": "#1c1b1b",
        "on-primary-fixed-variant": "#474746",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#78571e",
        "on-secondary-fixed": "#281900",
        "on-secondary-fixed-variant": "#5f4107",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#848483",
        "on-tertiary-fixed": "#1b1c1c",
        "on-tertiary-fixed-variant": "#474747",
        "on-surface": "#1a1c1c",
        "on-surface-variant": "#444748",
        "on-background": "#1a1c1c",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
        "inverse-surface": "#2f3131",
        "inverse-on-surface": "#f1f1f1",
        "inverse-primary": "#c8c6c5",
        "surface-tint": "#5f5e5e",
      },
      fontFamily: {
        // Newsreader for headlines (The Curator persona)
        headline: ["var(--font-newsreader)", "Newsreader", "Georgia", "serif"],
        // Work Sans for body and labels (Industrial foundation)
        sans: ["var(--font-work-sans)", "Work Sans", "system-ui", "sans-serif"],
        body: ["var(--font-work-sans)", "Work Sans", "system-ui", "sans-serif"],
        label: ["var(--font-work-sans)", "Work Sans", "system-ui", "sans-serif"],
      },
      // NO ROUNDED CORNERS - The Monolithic Rule
      borderRadius: {
        DEFAULT: "0px",
        sm: "0px",
        md: "0px",
        lg: "0px",
        xl: "0px",
        "2xl": "0px",
        full: "9999px", // Only for avatars/circular elements
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-down": "slideDown 0.4s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        marquee: "marquee 40s linear infinite",
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
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      boxShadow: {
        // Ambient shadows - extra diffused, low opacity
        ambient: "0 20px 60px rgba(26, 28, 28, 0.04)",
        "ambient-lg": "0 40px 80px rgba(26, 28, 28, 0.06)",
        // No harsh drop shadows
        soft: "0 4px 20px rgba(26, 28, 28, 0.03)",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem", // spacing-16 equivalent for section breaks
        "28": "7rem",   // spacing-20
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
