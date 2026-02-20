/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gelap': '#272727',       
        'abu': '#393E46',        
        'emas': '#FFD369',        
        'terang': '#EEEEEE',      
      }
    },
  },
  plugins: [],
}