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
        inkora: {
          navy: '#0B1020',
          dark: '#080C18',
          charcoal: '#111827',
          surface: '#151D30',
          surfaceLight: '#1E293B',
          teal: '#56E0C5',
          tealGlow: 'rgba(86, 224, 197, 0.25)',
          amber: '#FFB86B',
          amberGlow: 'rgba(255, 184, 107, 0.25)',
          ivory: '#F7F5EF',
          ivorySurface: '#FFFFFF',
          ivoryMuted: '#EFECE6',
          textDark: '#0F172A',
          textMutedDark: '#64748B',
          textLight: '#F8FAFC',
          textMutedLight: '#94A3B8',
          borderDark: 'rgba(255, 255, 255, 0.08)',
          borderLight: 'rgba(0, 0, 0, 0.08)',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        editorial: ['"Newsreader"', '"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at 50% 0%, rgba(86, 224, 197, 0.12) 0%, transparent 70%)',
        'radial-amber': 'radial-gradient(circle at 80% 20%, rgba(255, 184, 107, 0.10) 0%, transparent 60%)',
      },
      animation: {
        'ink-pulse': 'inkPulse 4s ease-in-out infinite',
        'float-slow': 'floatSlow 7s ease-in-out infinite',
      },
      keyframes: {
        inkPulse: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
