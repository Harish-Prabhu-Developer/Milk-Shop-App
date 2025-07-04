/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class", // Enable dark mode
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
        // Dark mode overrides
        // Dark-specific colors (use as custom names)
// Dark Theme (Updated for visual consistency)
        "dark-background": "#121212",       // true dark
        "dark-textPrimary": "#EDEDED",      // bright text
        "dark-textSecondary": "#A0A0A0",    // softer for subtitles
        "dark-border": "#2C2C2C",           // darker border
        "dark-primary": "#3D8BFD",          // same as light for brand consistency
        "dark-secondary": "#F9C80E",        // same as light (can be tweaked if needed)
        "dark-success": "#28D17C",          // more vibrant green
        "dark-danger": "#FF5C5C",           // brighter red
        "dark-info": "#4DD0E1",             // cyan tone for info
        "dark-muted": "#555555",            // subtle muted gray        
      },
    },
  },
  plugins: [],
};
