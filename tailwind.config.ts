
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#1A1F2C",
          foreground: "#FFFFFF",
          dark: "#0A0F1C",
        },
        secondary: {
          DEFAULT: "#F1F0FB",
          foreground: "#1A1F2C",
          dark: "#252836",
        },
        accent: {
          DEFAULT: "#8B5CF6",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F8F9FA",
          foreground: "#64748B",
          dark: "#171923",
        },
        subtle: {
          DEFAULT: "#E5DEFF",
          dark: "#2D2B55",
        },
        soft: {
          DEFAULT: "#F6F5FF", 
          dark: "#252836",
        },
        card: {
          DEFAULT: "#FFFFFF",
          dark: "#1A1F2C",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'elegant': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'elegant-dark': '0 4px 20px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
