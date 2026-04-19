/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clinical: {
          blue: '#1e40af',
          green: '#166534',
          red: '#991b1b',
          yellow: '#92400e',
        }
      }
    },
  },
  plugins: [],
}