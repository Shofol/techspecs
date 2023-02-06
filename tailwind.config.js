/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-blue": "#283555",
        "med-blue": "#323F63",
        "light-blue": "#737C97",
        gray: "#80909C",
        "med-gray": "#F4F5FA",
        "med-light-gray": "#9398AA",
        "deep-gray": "#DCE4ED",
        "light-gray": "#F2F2F2",
        "lighter-gray": "d1dfe4",
        "deepest-gray": "#E5E7EF",
        "mild-gray": "#f9fafc",
        cyan: "#44C0FF",
        lime: "#8BD001",
        blue: "#3C96FF",
        link: "#00C1FF",
      },
      spacing: {
        15: "3.75rem",
      },
    },
  },
  plugins: [],
};
