/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "pixpar-black": "#0a0a0f",
        "pixpar-gray": "#1c1c22",
        "pixpar-green": "#4ade80",
        "pixpar-blue": "#60a5fa",
        "pixpar-purple": "#c084fc",
        "pixpar-pink": "#f472b6",
        "pixpar-yellow": "#facc15",
        "pixpar-white": "#f3f4f6",
      },
    },
  },
  plugins: [],
};
