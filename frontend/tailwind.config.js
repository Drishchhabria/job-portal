/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Outfit", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
      colors: {
        ink: {
          950: "#050A18",
          900: "#080E20",
          800: "#0D1530",
          700: "#111D3C",
          600: "#1A2A52",
        },
        brand: {
          DEFAULT: "#FF6B35",
          light: "#FF8C5A",
          dark: "#E5521C",
        },
        cyan: {
          400: "#00D4FF",
          300: "#33DEFF",
        },
        slate: {
          400: "#8B9FC8",
          300: "#A8B8D8",
          200: "#C8D5EA",
          100: "#E5ECFA",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "slide-in": "slideIn 0.3s ease-out forwards",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
