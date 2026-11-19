/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        elang: {
          dark: '#17171A',        // Hitam Elang
          gold: '#C9A33D',        // Emas Tembaga
          paper: '#F0ECE2',       // Tulang / Kertas
          stone: '#6B5B45',       // Cokelat Batu
          brick: '#8A2E22',       // Merah Bata Gelap
          muted: '#242429',
          border: '#32323A',
        },
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
