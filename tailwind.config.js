/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}', './src/*.{js,jsx}'],
  important: true,
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
