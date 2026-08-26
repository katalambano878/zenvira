/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./{app,components,lib,pages,hooks}/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        handwriting: ['Pacifico', 'cursive'],
      },
      colors: {
        brand: {
          DEFAULT: '#535C4E',
          light: '#6B7564',
          dark: '#3F463A',
          accent: '#8A947C',
          muted: '#C5CBBE',
        },
        store: {
          cream: '#F7F5F0',
          sand: '#EFEBE3',
          ink: '#1A1A1A',
          sage: '#535C4E',
          sageDark: '#3F463A',
          muted: '#6B6B6B',
        },
      },
      borderRadius: {
        '2.5xl': '1.25rem',
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 12px 40px rgba(26, 26, 26, 0.08)',
      },
    },
  },
  plugins: [],
};
