/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors - Change these to update your theme
        primary: {
          DEFAULT: "#1A5F9E",  // Main brand color
          light: "#2B7BC4",    // Lighter shade for hover effects
          dark: "#0F4A7A",     // Darker shade for pressed states
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#1A5F9E",      // Main
          700: "#0F4A7A",
          800: "#1E3A8A",
          900: "#1E293B",
        },
        // Secondary/Background colors
        secondary: {
          DEFAULT: "#F0F0F0",  // Secondary background
          light: "#F8F8F8",    // Lighter background
          dark: "#E0E0E0",     // Darker background
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#F0F0F0",      // Main
          300: "#E0E0E0",
          400: "#D1D5DB",
          500: "#9CA3AF",
        },
      },
    },
  },
  plugins: [],
}
