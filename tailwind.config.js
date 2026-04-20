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
        'primary-text': '#160042',
        primary: { DEFAULT: '#3b82f6', hover: '#2563eb' },
        danger: { DEFAULT: '#ef4444', hover: '#dc2626' },
        success: { DEFAULT: '#22c55e', hover: '#16a34a' },
        surface: { DEFAULT: '#f5f5f5', raised: '#ffffff' }
      }
    },
  },
  plugins: [],
}
