/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        genzPurple: '#a78bfa', // pastel purple
        genzPink: '#f9a8d4',   // pastel pink
        genzBlue: '#7dd3fc',   // pastel blue
        genzGray: '#f3f4f6',   // soft gray
      },
    },
  },
  plugins: [],
}
