import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette derived from the Para logo (green wordmark + gold & pink
        // botanical accents on cream). Green is the primary brand/dark color.
        green: {
          DEFAULT: "#487E20", // leaf + wordmark green
          dark: "#33590F",
          light: "#6BA03C",
        },
        gold: {
          DEFAULT: "#C8922A", // matches the logo's gold leaves
          dark: "#A6791F",
          light: "#E6C067",
        },
        pink: {
          DEFAULT: "#E5399A", // logo petal pink (readable accent)
          dark: "#C42D82",
          light: "#FB47A0",
        },
        cream: "#F6F2E7", // logo background cream
        ink: "#1C1C1C",
        muted: "#6B7280",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      container: {
        center: true,
        padding: "1rem",
        screens: { "2xl": "1200px" },
      },
    },
  },
  plugins: [],
};

export default config;
