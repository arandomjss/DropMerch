/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        genzPurple: '#a78bfa', 
        genzPink: '#f9a8d4',   
        genzBlue: '#7dd3fc',   
        genzGray: '#f3f4f6',   
      },
    },
  },
  plugins: [],
}
