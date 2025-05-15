/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores principais
        'evergreen': {
          50: '#f0f9f1',
          100: '#dcf1de',
          200: '#bae3bf',
          300: '#8dce96',
          400: '#5ab46a',
          500: '#3a9a4a', // Cor principal
          600: '#2d7c3b',
          700: '#256331',
          800: '#214f2a',
          900: '#1d4224',
          950: '#0f2413',
        },
        // Cores de água
        'water': {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fb',
          400: '#36aaf5',
          500: '#0c8ee4',
          600: '#0071c2',
          700: '#005a9e',
          800: '#004c83',
          900: '#00406d',
          950: '#002847',
        },
        // Cores de terra
        'earth': {
          50: '#faf6f1',
          100: '#f4e9dc',
          200: '#e9d3b9',
          300: '#dbb68c',
          400: '#cc9460',
          500: '#c17d45',
          600: '#b36a3a',
          700: '#945332',
          800: '#77432d',
          900: '#613827',
          950: '#341d14',
        },
        // Cores de acentuação
        'accent': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'eco': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'eco-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'eco': '0.75rem',
      },
    },
  },
  plugins: [],
} 