import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0F172A",
          950: "#080D1A",
          900: "#0F172A",
          800: "#141C33",
          700: "#1B2542",
        },
        // "electric"/"skyline" keep their original token names (many
        // components already reference them) but carry Snapdown's gold/red
        // wrestling palette instead of Statline's blue -- repointing the
        // values here re-themes the whole site without touching every file.
        electric: {
          DEFAULT: "#D4A017",
          500: "#D4A017",
          600: "#B8890A",
        },
        skyline: {
          DEFAULT: "#D8C89D",
          300: "#D8C89D",
        },
        intl: {
          DEFAULT: "#10B981",
          300: "#6EE7B7",
          500: "#10B981",
          600: "#059669",
        },
      },
      fontFamily: {
        heading: ["var(--font-big-shoulders)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        stencil: ["var(--font-big-shoulders-stencil)", "sans-serif"],
      },
      backgroundImage: {
        "angular-hero":
          "linear-gradient(135deg, #0F172A 0%, #0F172A 40%, #141C33 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
