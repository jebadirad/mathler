/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'scale-in-center':
          'scale-in-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both',
        'scale-out-center':
          'scale-out-center 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530)   both',
      },
      keyframes: {
        'scale-in-center': {
          '0%': {
            transform: 'scale(0)',
            opacity: '1',
          },
          to: {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        'scale-out-center': {
          '0%': {
            transform: 'scale(1)',
            opacity: '1',
          },
          to: {
            transform: 'scale(0)',
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [require('daisyui'), require('@tailwindcss/typography')],
  daisyui: {
    themes: ['corporate', 'synthwave'],
    darkTheme: 'synthwave',
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
  },
};
