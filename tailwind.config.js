/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#283558',
        'med-blue': '#323F63',
        'light-blue': '#737C97',
        'gray': '#80909C',
        'med-gray': '#F4F5FA',
        'med-light-gray': '#9398AA',
        'light-gray': '#F2F2F2',
        'cyan': '#44C0FF'
      },
      spacing: {
        15: '3.75rem'
      }
    },
  },
  plugins: [],
}