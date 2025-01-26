import type { Config } from "tailwindcss";

const VALUES = {
  7_5: "7.5px",
  10: "10px",
  15: "15px",
  30: "30px",
  45: "45px",
  60: "60px",
  120: "120px",
};

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        BLACK: "#2A2A2A",
        WHITE: "#EBEBEB",
        GREEN: "#009736",
        RED: "#EE2A35",
        BEIGE: "#F5F5F5",
      },
      padding: VALUES,
    },
  },
  plugins: [],
} satisfies Config;
