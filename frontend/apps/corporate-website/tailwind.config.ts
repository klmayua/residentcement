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
        // Stitch Design System - Monolithic Curator
        background: "#f9f9f9",
        foreground: "#1a1c1c",
        surface: "#f9f9f9",
        "surface-bright": "#f9f9f9",
        "surface-dim": "#dadada",
        "surface-variant": "#e2e2e2",
        
        "surface-container": {
          lowest: "#ffffff",
          low: "#f3f3f3",
          DEFAULT: "#eeeeee",
          high: "#e8e8e8",
          highest: "#e2e2e2",
        },

        // Primary: Black/Dark - Architectural Authority
        primary: {
          DEFAULT: "#000000",
          container: "#1c1b1b",
          fixed: "#e5e2e1",
          "fixed-dim": "#c8c6c5",
          foreground: "#ffffff",
        },

        // Secondary: Amber/Gold - Premium Accent
        secondary: {
          DEFAULT: "#79591f",
          container: "#fdd08b",
          fixed: "#ffdead",
          "fixed-dim": "#ebc07c",
          foreground: "#ffffff",
        },

        // Tertiary: Dark Slate
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

        // Semantic Tokens
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

        // Inverse Colors
        "inverse-surface": "#2f3131",
        "inverse-on-surface": "#f1f1f1",
        "inverse-primary": "#c8c6c5",
        "surface-tint": "#5f5e5e",

        // Glassmorphism Colors
        glass: {
          light: "rgba(255, 255, 255, 0.1)",
          medium: "rgba(255, 255, 255, 0.2)",
          dark: "rgba(0, 0, 0, 0.3)",
          white: "rgba(255, 255, 255, 0.8)",
        },
      },

      fontFamily: {
        // Newsreader for headlines - Editorial elegance
        headline: ["Newsreader", "serif"],
        // Work Sans for body - Clean modern sans
        body: ["Work Sans", "sans-serif"],
        label: ["Work Sans", "sans-serif"],
        sans: ["Work Sans", "sans-serif"],
      },

      // Sharp architectural corners
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
        marquee: "marquee 40s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
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
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },

      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.1)",
        card: "0 0 0 1px rgba(0, 0, 0, 0.03)",
        elevated: "0 10px 15px -3px rgba(0, 0, 0, 0.15)",
        ambient: "0 20px 40px rgba(0, 0, 0, 0.1)",
        glow: "0 0 40px rgba(121, 89, 31, 0.2)",
        // Glassmorphism shadows
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.1)",
        glassHover: "0 8px 32px 0 rgba(0, 0, 0, 0.15)",
      },

      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
        // Architectural spacing scale
        "arch-sm": "2rem",
        "arch-md": "4rem",
        "arch-lg": "8.5rem",
        "arch-xl": "12rem",
      },

      fontSize: {
        "display": ["4rem", { lineHeight: "0.9", letterSpacing: "-0.02em" }],
        "display-lg": ["6rem", { lineHeight: "0.9", letterSpacing: "-0.02em" }],
        "headline-lg": ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        "title-lg": ["1.5rem", { lineHeight: "1.3" }],
      },

      backdropBlur: {
        xs: "2px",
        glass: "12px",
        glassStrong: "20px",
      },

      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #000000 0%, #1c1b1b 100%)",
        "gradient-secondary": "linear-gradient(135deg, #79591f 0%, #ebc07c 100%)",
        "gradient-glass": "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addUtilities, theme }: any) {
      const newUtilities = {
        // Glassmorphism utilities
        ".glass": {
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
        ".glass-dark": {
          background: "rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
        ".glass-strong": {
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        },
        ".glass-card": {
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.1)",
        },
        // Text utilities
        ".text-gradient": {
          background: "linear-gradient(135deg, #79591f 0%, #ebc07c 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        },
        // Architectural layouts
        ".layout-monolith": {
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: theme("spacing.8"),
        },
        ".layout-bento": {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: theme("spacing.4"),
        },
      };
      addUtilities(newUtilities);
    },
  ],
};

export default config;
