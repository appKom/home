import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        tealBlue: "#1995AD",
        lightBlue: "#A1D6E2",
        onlineOrange: "#F9B759",
        onlineBlue: "#0D5474",
        gold: "#FFD700",
      },
    },
  },
  plugins: [],
};
export default config;
