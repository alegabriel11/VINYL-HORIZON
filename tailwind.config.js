/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'black-pearl': '#091C2A',
          'black-pearl-light': '#122838',
          'walnut': '#3A2E29',
          'rose-fog': '#E1C2B3',
          'pale-taupe': '#BE9C83',
          'white-berry': '#EFEFEF',
          'timberwolf': '#D1D1D1',
        },
        borderRadius: {
          'friendly': '2rem',
        }
      },
    },
    plugins: [],
  }