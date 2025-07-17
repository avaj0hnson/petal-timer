/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  safelist: [
    {
      pattern: /(bg|text|border|ring|hover:bg|hover:text|focus:ring)-(blush|mint|indigo|yellow|cyan|gray)-(50|100|200|300|400|500|600|700|800|900)/,
      variants: ['hover', 'focus'],
    },
    {
      pattern: /(bg|text|border|ring|hover:bg|hover:text|focus:ring)-(white|black)/,
      variants: ['hover', 'focus'],
    },
    'bg-white/80', 'bg-indigo-950/60', 'backdrop-blur-md', 'border-white/40', 'border-indigo-800'
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#fff0f6',
          100: '#ffeaf4',
          200: '#ffd3e4',
          300: '#fda4af',
          400: '#f8b4d9',
          500: '#f472b6',
          600: '#ec4899',
          700: '#c02660',
          800: '#a61e4d',
          900: '#701a3f',
          text: '#a61e4d',
          DEFAULT: '#f8b4d9'
        },
        mint: {
          50: '#f0fdfa',
          100: '#e6fff6',
          200: '#ccfbef',
          300: '#99f6e4',
          400: '#5eead4',
          500: '#2dd4bf',
          600: '#14b8a6',
          700: '#0d9488',
          800: '#087f5b',
          900: '#065f46',
          text: '#087f5b',
          DEFAULT: '#b3f5dd',
          dark: '#7fecc3'
        },
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          DEFAULT: '#1a1b2f',
        },
        yellow: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12'
        },
        cyan: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63'
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          DEFAULT: '#1f2937'
        },
        softwhite: '#fdfdfd'
      },
      fontFamily: {
        cute: ['"Rubik"', 'cursive', 'system-ui', 'sans-serif']
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
