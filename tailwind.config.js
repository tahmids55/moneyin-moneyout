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
        bg: {
          primary: '#18181B',
          secondary: '#1F1F23',
          card: '#232326',
          elevated: '#2A2A2E',
        },
        text: {
          primary: '#E4E4E7',
          secondary: '#A1A1AA',
          disabled: '#71717A',
        },
        border: {
          soft: '#2F2F34',
        },
        accent: {
          primary: '#3B82F6',
          hover: '#2563EB',
          success: '#22C55E',
          danger: '#EF4444',
          warning: '#F59E0B',
        },
      },
    },
  },
  plugins: [],
}

