/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          light: '#ffeaf4',
          DEFAULT: '#ffd6e8',
          dark: '#f8b4d9',
        },
        softwhite: '#fdfdfd',
      },
      fontFamily: {
        cute: ['"Baloo 2"', 'cursive'],
      },
      boxShadow: {
        soft: '0 4px 12px rgba(248, 180, 217, 0.4)',
      },
      borderRadius: {
        cute: '1.5rem',
      },
    },
  },
  plugins: [],
}
