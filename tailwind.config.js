/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ... existing extensions ...
    },
  },
  plugins: [],
  safelist: [
    'perspective-1000',
    'transform-style-3d',
    'preserve-3d',
    'backface-visible',
    'rotate-y-45'
  ]
} 