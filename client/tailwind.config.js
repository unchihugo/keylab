/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#fde4aa',
        primaryDark: '#ffd063',
        primaryDarker: '#f1bc41',
        secondary: '#aac3fd',
        secondaryDark: '#6392ff',
        secondaryDarker: '#4176f1'
      },
      dropShadow: {
        'cartoon': '4px 4px 0px rgba(0, 0, 0, 1)',
      },
    },
    fontFamily: {
      'display': ['"Dela Gothic One"', 'sans-serif'],
      'body': ['"Space Grotesk"', 'monospace'],
    }
  },
  plugins: [],
}