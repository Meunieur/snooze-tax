/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        alarm: {
          danger: '#EF4444',
          warning: '#F59E0B',
          success: '#10B981',
          gold: '#FBBF24',
          dark: '#0F172A',
          card: '#1E293B',
          border: '#334155'
        }
      },
      animation: {
        'pulse-fast': 'pulse 0.7s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'bounce-short': 'bounce 0.5s ease-in-out 2',
        'coin-fall': 'coinFall 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards'
      },
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translate3d(-2px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(4px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-6px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(6px, 0, 0)' },
        },
        coinFall: {
          '0%': { transform: 'translateY(-100px) scale(0.5)', opacity: '0' },
          '50%': { transform: 'translateY(15px) scale(1.2)', opacity: '1' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}
