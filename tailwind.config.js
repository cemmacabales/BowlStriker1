
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        background: '#0D0D0D',
        primary: {
          cyan: '#00D4FF',
          purple: '#8B5CF6',
        },
        glass: {
          100: 'rgba(255, 255, 255, 0.05)',
          200: 'rgba(255, 255, 255, 0.10)',
          300: 'rgba(255, 255, 255, 0.15)',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #00D4FF, #8B5CF6)',
        'gradient-dark': 'linear-gradient(to bottom, #0D0D0D, #1a1a1a)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #00D4FF, 0 0 10px #00D4FF' },
          '100%': { boxShadow: '0 0 20px #8B5CF6, 0 0 30px #8B5CF6' },
        }
      }
    },
  },
  plugins: [],
}
