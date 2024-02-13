/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
    './src/*.{js,jsx}',
    './node_modules/@tremor/**/*.{js,ts,jsx,tsx}',
  ],
  important: true,
  theme: {
    extend: {
      colors: {
        'color-dark-violet': '#281b49',
        'color-magenta': '#ed1c70',
        'color-red': '#F12509',
        'color-pale-blue': '#60b2cc',
        'color-darker-grey': '#b2b2b2',
        'color-light-grey': '#646481',
        'color-light-grey2': '#dbdbdb',
        'color-violet': '#b28ec2',
        'color-lavender': '#9c96b5',
        'color-border-grey': '#dedee1',
        'color-bg-grey1': '#fdfdfd',
        'color-bg-grey2': '#fafafa',
        'color-grey3': '#f2f2f2',
        'color-border': '#e1e1e1',
        'color-purple': '#862EE7',
        'color-light-purple': '#ebe4ff',
        'color-dark-purple': '#261A45',
        'color-light-blue': '#86b7fe',
        'color-dashboard-bg': '#f7f8fA',
        'color-banner-green': '#00D986',
        
        tremor: {
          brand: {
            faint: '#eff6ff', // blue-50
            muted: '#bfdbfe', // blue-200
            subtle: '#60a5fa', // blue-400
            DEFAULT: '#3b82f6', // blue-500
            emphasis: '#1d4ed8', // blue-700
            inverted: '#ffffff', // white
          },
          background: {
            muted: '#f9fafb', // gray-50
            subtle: '#f3f4f6', // gray-100
            DEFAULT: '#ffffff', // white
            emphasis: '#374151', // gray-700
          },
          border: {
            DEFAULT: '#e5e7eb', // gray-200
          },
          ring: {
            DEFAULT: '#e5e7eb', // gray-200
          },
          content: {
            subtle: '#9ca3af', // gray-400
            DEFAULT: '#6b7280', // gray-500
            emphasis: '#374151', // gray-700
            strong: '#111827', // gray-900
            inverted: '#ffffff', // white
          },
        },
      },

      fontFamily: {
        inter: ['Inter'],
      },

      keyframes: {
        slideDownAndFade: {
          from: { opacity: 0, transform: 'translateY(-2px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideLeftAndFade: {
          from: { opacity: 0, transform: 'translateX(2px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        slideUpAndFade: {
          from: { opacity: 0, transform: 'translateY(2px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideRightAndFade: {
          from: { opacity: 0, transform: 'translateX(-2px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
      },
      animation: {
        slideDownAndFade:
          'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideLeftAndFade:
          'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideRightAndFade:
          'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
