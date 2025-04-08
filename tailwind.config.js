/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Define custom colors for dark mode if needed
        dark: {
          bg: '#121212',
          card: '#1e1e1e',
          border: '#2e2e2e',
          text: '#e0e0e0',
          muted: '#a0a0a0',
        },
      },
    },
  },
  plugins: [],
};
