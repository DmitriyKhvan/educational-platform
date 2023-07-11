/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}', './src/*.{js,jsx}'],
  important: true,
  theme: {
    extend: {
      colors: {
        'color-dark-violet': '#281b49',
        'color-magenta': '#ed1c70',
        'color-pale-blue': '#60b2cc',
        'color-darker-grey': '#b2b2b2',
        'color-light-grey': '#646481',
        'color-light-grey2': '#dbdbdb',
        'color-violet': '#b28ec2',
        'color-lavender': '#9c96b5',
        'color-black': '#000000',
        'color-white': '#ffffff',
        'color-border-grey': '#dedee1',
        'color-bg-grey1': '#fdfdfd',
        'color-bg-grey2': '#fafafa',
        'color-grey3': '#f2f2f2',
        'color-border': '#e1e1e1',
        'color-transparent': 'transparent',
        'color-purple': '#6134af',
        'color-dark-purple': '#261A45',
        'color-border-white': '#dedee1',
        'color-purple1': '#6133af',
        'color-light-blue': '#86b7fe',
      },
      fontFamily: {
        inter: ['Inter'],
      },
    },
  },
  plugins: [],
};
