/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: '#00f6ff',
          pink: '#ff006e',
          yellow: '#ffbe0b',
          green: '#06ffa5',
          purple: '#b100ff',
        },
        arcade: {
          bg: '#0a0a14',
          card: '#1a1a2e',
          border: '#2a2a44',
        }
      },
      fontFamily: {
        display: ['Russo One', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 246, 255, 0.5)',
        'neon-pink': '0 0 20px rgba(255, 0, 110, 0.5)',
        'neon-yellow': '0 0 20px rgba(255, 190, 11, 0.5)',
        'neon-green': '0 0 20px rgba(6, 255, 165, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { filter: 'brightness(1)' },
          '100%': { filter: 'brightness(1.3)' },
        }
      }
    },
  },
  plugins: [],
}
