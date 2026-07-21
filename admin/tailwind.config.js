/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blush-aveia': '#F7F4EC',
        'abacate-suave': '#96B475',
        'abacate-suave-dark': '#839F63',
        'musgo-profundo': '#2A3E2D',
        'marrom-cafe': '#3D2A1C',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        display: ['Fredoka', 'sans-serif'],
        handwritten: ['"Playpen Sans"', 'cursive'],
      },
    },
  },
  plugins: [],
}
