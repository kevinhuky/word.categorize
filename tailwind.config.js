/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        sage: {
          50: '#f8faf9',
          100: '#f1f5f2',
          200: '#e2eae4',
          300: '#c8d7cc',
          400: '#a8bfad',
          500: '#8ba490',
          600: '#718777',
          700: '#5d6f62',
          800: '#4c5a50',
          900: '#404a44',
        },
        warm: {
          50: '#fdf9f7',
          100: '#faf2ee',
          200: '#f3e2d8',
          300: '#eaccb8',
          400: '#deb094',
          500: '#d49972',
          600: '#c6845a',
          700: '#a56d4b',
          800: '#865940',
          900: '#6d4a37',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      }
    },
  },
  plugins: [],
}