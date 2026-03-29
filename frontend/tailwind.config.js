/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          darkest: '#091413',
          dark:    '#285A48',
          mid:     '#408A71',
          light:   '#B0E4CC',
        },
        moody: {
          dark:    '#37353E',
          mid:     '#44444E',
          muted:   '#715A5A',
          light:   '#D3DAD9',
        }
      }
    },
  },
  plugins: [],
}