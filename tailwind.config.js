/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e0f7f6",
          100: "#b3ecea",
          200: "#80e0dd",
          300: "#4dd3d0",
          400: "#26c8c4",
          500: "#03A6A1", // main
          600: "#028c88",
          700: "#02716e",
          800: "#015754",
          900: "#003c3a",
        },
        secondary: {
          50: "#fff8ed",
          100: "#fff1db",
          200: "#ffeac8",
          300: "#ffe3bb", // main
          400: "#ffdca8",
          500: "#ffd495",
          600: "#ffcd82",
          700: "#ffc66f",
          800: "#ffbe5c",
          900: "#ffb749",
        },
        accent: {
          50: "#fff2e6",
          100: "#ffd9b8",
          200: "#ffc08a",
          300: "#FFA673", // main
          400: "#ff944d",
          500: "#ff8226",
          600: "#ff7000",
          700: "#e65f00",
          800: "#cc4f00",
          900: "#b33f00",
        },
        warning: {
          50: "#fff2e6",
          100: "#ffd9b8",
          200: "#ffc08a",
          300: "#FFA673", // main
          400: "#ff944d",
          500: "#ff8226",
          600: "#ff7000",
          700: "#e65f00",
          800: "#cc4f00",
          900: "#b33f00",
        },
        danger: {
          50: "#ffeae3",
          100: "#ffc6b3",
          200: "#ffa180",
          300: "#FF4F0F", // main
          400: "#e6450d",
          500: "#cc3c0b",
          600: "#b33309",
          700: "#992a07",
          800: "#802105",
          900: "#661803",
        },
        background: {
          DEFAULT: "#FFE3BB",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
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
      },
    },
  },
  plugins: [],
};
