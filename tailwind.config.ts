import type { Config } from "tailwindcss";

const VALUES = {
  7_5: "7.5px",
  10: "10px",
  15: "15px",
  30: "30px",
  45: "45px",
  60: "60px",
  90: "90px",
  120: "120px",
};

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [],
} satisfies Config;
