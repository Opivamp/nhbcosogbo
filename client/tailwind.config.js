/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        royal: {
          50: '#f0f5ff',
          100: '#e0ecfe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#36abf6',
          500: '#0c8de9',
          600: '#026dc7',
          700: '#0256a2',
          800: '#0047ab',
          900: '#023a97', // Exact primary brand blue from NHBC emblem
          950: '#002666',
        },
        navy: {
          50: '#f0f5ff',
          100: '#e0ecfe',
          200: '#c5daf8',
          300: '#96bef0',
          400: '#5c9ce5',
          500: '#2c77d4',
          600: '#1459be',
          700: '#0b47a2',
          800: '#023a97', // Signature Heritage Baptist Royal Blue
          900: '#002b73',
          950: '#001844',
        },
        gold: {
          50: '#fcf9ee',
          100: '#f8f2d5',
          200: '#f1e2a9',
          300: '#e7ce76',
          400: '#ddb74a',
          500: '#c5a059',
          600: '#b8860b',
          700: '#8c6508',
          800: '#73520e',
          900: '#624512',
          950: '#382506',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}