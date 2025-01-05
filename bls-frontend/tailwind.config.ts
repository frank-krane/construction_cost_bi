import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/theme");

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    nextui(),
    function ({ addBase }: { addBase: (base: Record<string, any>) => void }) {
      addBase({
        '::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(100, 100, 100, 0.5)',
          borderRadius: '3px',
        },
      });
    },
  ],
} satisfies Config;
