import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-thai)", "system-ui", "sans-serif"],
        outfit: ["var(--font-outfit)", "var(--font-thai)", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          orange: "#D77757",
          blue: "#5769F7",
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'blob': 'blob 7s infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'shimmer': 'shimmer 2.8s linear infinite',
        'pop': 'pop 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'glow': 'glow 3.5s ease-in-out infinite',
        'spin-slow': 'spin 16s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-130%) skewX(-12deg)' },
          '100%': { transform: 'translateX(130%) skewX(-12deg)' },
        },
        pop: {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.75' },
        },
      }
    },
  },
  plugins: [],
};

export default config;
