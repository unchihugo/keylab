/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#fde4aa',
          dark: '#ffd063',
          darker: '#f1bc41',
        },
        
        secondary: {
          DEFAULT: '#aac3fd',
          dark: '#6392ff',
          darker: '#4176f1',
        },
      },
      dropShadow: {
        'cartoon': '4px 4px 0px rgba(0, 0, 0, 1)',
        'cartoon-y': '0px 0.25rem 0px rgba(0, 0, 0, 1)',
      },
      boxShadow: {
        'inner-cartoon-y': 'inset 0px 0.125rem 0px rgba(0, 0, 0, 1)',
      },
    },
    fontFamily: {
      'display': ['"Dela Gothic One"', 'sans-serif'],
      'body': ['"Space Grotesk"', 'monospace'],
    }
  },
  plugins: [],
}