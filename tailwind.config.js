/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        menu: '#1E1E2D',
        'menu-active': '#1B1B28',
        'menu-text': '#4A4B68',
        'menu-item-text': '#888C9F',
        'primary-text': '#160042'
      }
    },
  },
  plugins: [],
}
