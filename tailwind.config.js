/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        velenora: {
          navy: '#142C46',
          'navy-light': '#1E3B5C',
          'navy-dark': '#0D1E30',
          deepblue: '#17475A',
          teal: '#087A83',
          'teal-light': '#2A7776',
          'teal-dark': '#065960',
          ivory: '#F8F7F3',
          surface: '#F1F2F3',
          panel: '#FFFFFF',
          border: '#E1E5E8',
          primary: '#10263B',
          secondary: '#667586',
          grey: '#E1E5E8',
          'grey-light': '#F8F9FA',
          'grey-dark': '#9CA3AF',
          charcoal: '#10263B',
          sage: '#6C8B7F',
          burgundy: '#5C1D2E',
          petrol: '#17475A',
          powder: '#D8A49B',
          purple: '#4A3B52',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        arabic: ['Noto Sans Arabic', 'Cairo', 'sans-serif'],
      },
      boxShadow: {
        'panel': '0 1px 3px 0 rgba(16, 38, 59, 0.05)',
        'luxury': '0 10px 30px -10px rgba(20, 44, 70, 0.08)',
        'luxury-lg': '0 20px 40px -15px rgba(20, 44, 70, 0.12)',
      }
    },
  },
  plugins: [],
}
