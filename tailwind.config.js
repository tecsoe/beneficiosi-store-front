const colors = require('tailwindcss/colors');

module.exports = {
  purge: [],
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  mode: 'jit',
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '.5rem',
        sm: '1rem',
        lg: '2rem',
        xl: '3rem',
      },
    },
    extend: {
      colors: {
        main: {
          light: '#f55f5f',
          DEFAULT: '#F04141',
          dark: '#d91616',
        },
        gray: colors.trueGray,
        'blue-gray': colors.gray,
        orange: colors.orange,
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}