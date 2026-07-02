import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#182026",
        mist: "#eef4f1",
        leaf: "#2f6f5e",
        coral: "#cf5f45",
        gold: "#b98322",
        sky: "#3b6f93"
      },
      boxShadow: {
        soft: "0 12px 30px rgba(24, 32, 38, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
