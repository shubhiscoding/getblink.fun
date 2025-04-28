/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./web/app/**/*.{js,ts,jsx,tsx}",
    "./web/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-color': 'rgb(0, 0, 0)',
        'card-bg': '#192734',
        'text-color': '#ffffff',
        'text-secondary': '#8899A6',
        'accent-purple': '#9945FF',
        'accent-green': '#14F195',
        'border-color': '#38444D',
      },
    },
  },
  plugins: [],
}
