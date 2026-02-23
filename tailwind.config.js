/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          start: '#1e3a8a', // blue-900
          end: '#172554', // blue-950
          'hover-start': '#172554', // blue-950
          'hover-end': '#1e1b4b', // indigo-950
          light: '#3b82f6', // blue-500
          lighter: '#60a5fa', // blue-400
        },
      },
    },
  },
  plugins: [],
};
