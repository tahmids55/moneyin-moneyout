/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        app: {
          primary: '#C0C0C0',
          secondary: '#6B7280',
          accent: '#F87171',
          background: '#F9FAFB',
          card: '#FFFFFF',
          text: '#111827',
        },
        appDark: {
          background: '#1F1F1F',
          card: '#2C2C2C',
          primary: '#9CA3AF',
          accent: '#F87171',
          text: '#E5E7EB',
        },
      },
    },
  },
  plugins: [],
}

