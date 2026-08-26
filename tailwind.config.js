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
          DEFAULT: '#C9A227',
          light: '#D4AF37',
          dark: '#A8891E',
          accent: '#E8C547',
          muted: '#E8D9A8',
        },
        store: {
          ink: '#0A0A0A',
          black: '#0A0A0A',
          white: '#FFFFFF',
          gold: '#C9A227',
          goldDark: '#A8891E',
          muted: '#6B6B6B',
          // aliases — old navy/primary blues now resolve to gold/black
          primary: '#C9A227',
          navy: '#0A0A0A',
          'navy-light': '#C9A227',
          surface: '#F5F5F5',
          cream: '#FFFFFF',
          sand: '#FFFFFF',
          sage: '#C9A227',
          sageDark: '#A8891E',
        },
      },
      borderRadius: {
        '2.5xl': '1.25rem',
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 12px 40px rgba(10, 10, 10, 0.08)',
      },
    },
  },
  plugins: [],
};
