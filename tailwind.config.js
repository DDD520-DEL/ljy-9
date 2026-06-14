/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-purple': 'var(--color-neon-purple)',
        'neon-cyan': 'var(--color-neon-cyan)',
        'neon-pink': 'var(--color-neon-pink)',
        'neon-green': 'var(--color-neon-green)',
        'neon-amber': 'var(--color-neon-amber)',
        'neon-yellow': 'var(--color-neon-yellow)',
        'neon-red': 'var(--color-neon-red)',
        'deep-navy': 'var(--bg-deep-navy)',
        'darker-navy': 'var(--bg-darker-navy)',
        'card-bg': 'var(--bg-card)',
        'card-border': 'var(--border-card)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive'],
        'retro': ['VT323', 'monospace'],
      },
      boxShadow: {
        'neon-purple': 'var(--shadow-neon-purple)',
        'neon-cyan': 'var(--shadow-neon-cyan)',
        'neon-pink': 'var(--shadow-neon-pink)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'scanline': 'scanline 6s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}
