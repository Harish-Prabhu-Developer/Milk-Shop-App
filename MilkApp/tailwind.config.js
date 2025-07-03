/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
       colors: {
        primary: "#3D8BFD",
        secondary: "#F9C80E",
        background: "#FFFFFF",
        textPrimary: "#222222",
        textSecondary: "#666666",
        border: "#E0E0E0",
        success: "#28A745",
        danger: "#DC3545",
        info: "#17A2B8",
        muted: "#CCCCCC",
      },
    },
  },
  plugins: [],
}

