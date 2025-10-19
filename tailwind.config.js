/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3b82f6",
          hover: "#2563eb",
        },
      },
      borderRadius: {
        container: "0.75rem",
      },
    },
  },
  plugins: [],
};
