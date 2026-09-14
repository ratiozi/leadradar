/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0a0a',
          800: '#121212',
          700: '#1a1a1a',
          600: '#242424',
          500: '#2d2d2d',
        },
        brand: {
          blue: '#0088ff',
          teal: '#00b894',
          green: '#00a94f',
          orange: '#ff8c00',
          red: '#ff2d55',
          purple: '#8b5cf6',
          pink: '#d946ef',
          cyan: '#06b6d4',
        }
      }
    },
  },
  plugins: [],
}
