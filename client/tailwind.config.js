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
        primary: {
          50: 'oklch(0.98 0.02 var(--color-primary, 250))',
          100: 'oklch(0.95 0.04 var(--color-primary, 250))',
          200: 'oklch(0.92 0.07 var(--color-primary, 250))',
          300: 'oklch(0.88 0.10 var(--color-primary, 250))',
          400: 'oklch(0.82 0.14 var(--color-primary, 250))',
          500: 'oklch(0.75 0.18 var(--color-primary, 250))',
          600: 'oklch(0.68 0.16 var(--color-primary, 250))',
          700: 'oklch(0.60 0.14 var(--color-primary, 250))',
          800: 'oklch(0.50 0.12 var(--color-primary, 250))',
          900: 'oklch(0.40 0.10 var(--color-primary, 250))',
          950: 'oklch(0.30 0.08 var(--color-primary, 250))',
        },
        secondary: {
          50: 'oklch(0.98 0.02 var(--color-secondary, 190))',
          100: 'oklch(0.95 0.04 var(--color-secondary, 190))',
          200: 'oklch(0.92 0.07 var(--color-secondary, 190))',
          300: 'oklch(0.88 0.10 var(--color-secondary, 190))',
          400: 'oklch(0.82 0.14 var(--color-secondary, 190))',
          500: 'oklch(0.75 0.18 var(--color-secondary, 190))',
          600: 'oklch(0.68 0.16 var(--color-secondary, 190))',
          700: 'oklch(0.60 0.14 var(--color-secondary, 190))',
          800: 'oklch(0.50 0.12 var(--color-secondary, 190))',
          900: 'oklch(0.40 0.10 var(--color-secondary, 190))',
          950: 'oklch(0.30 0.08 var(--color-secondary, 190))',
        },
        accent: {
          50: 'oklch(0.98 0.02 var(--color-accent, 45))',
          100: 'oklch(0.95 0.04 var(--color-accent, 45))',
          200: 'oklch(0.92 0.07 var(--color-accent, 45))',
          300: 'oklch(0.88 0.10 var(--color-accent, 45))',
          400: 'oklch(0.82 0.14 var(--color-accent, 45))',
          500: 'oklch(0.75 0.18 var(--color-accent, 45))',
          600: 'oklch(0.68 0.16 var(--color-accent, 45))',
          700: 'oklch(0.60 0.14 var(--color-accent, 45))',
          800: 'oklch(0.50 0.12 var(--color-accent, 45))',
          900: 'oklch(0.40 0.10 var(--color-accent, 45))',
          950: 'oklch(0.30 0.08 var(--color-accent, 45))',
        },
      },
      spacing: {
        'xs': 'var(--spacing-xs)',
        'sm': 'var(--spacing-sm)',
        'md': 'var(--spacing-md)',
        'lg': 'var(--spacing-lg)',
        'xl': 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        '3xl': 'var(--spacing-3xl)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
      },
      fontSize: {
        'xs': 'var(--text-xs)',
        'sm': 'var(--text-sm)',
        'base': 'var(--text-base)',
        'lg': 'var(--text-lg)',
        'xl': 'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
        '3xl': 'var(--text-3xl)',
        '4xl': 'var(--text-4xl)',
        '5xl': 'var(--text-5xl)',
      },
      lineHeight: {
        'none': 'var(--leading-none)',
        'tight': 'var(--leading-tight)',
        'snug': 'var(--leading-snug)',
        'normal': 'var(--leading-normal)',
        'relaxed': 'var(--leading-relaxed)',
        'loose': 'var(--leading-loose)',
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        'full': 'var(--radius-full)',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
      },
      transitionDuration: {
        'fast': 'var(--transition-fast)',
        'normal': 'var(--transition-normal)',
        'slow': 'var(--transition-slow)',
      },
      zIndex: {
        'negative': 'var(--z-negative)',
        'elevate': 'var(--z-elevate)',
        'sticky': 'var(--z-sticky)',
        'drawer': 'var(--z-drawer)',
        'dropdown': 'var(--z-dropdown)',
        'modal': 'var(--z-modal)',
        'popover': 'var(--z-popover)',
        'tooltip': 'var(--z-tooltip)',
      },
      screens: {
        'sm': 'var(--breakpoint-sm)',
        'md': 'var(--breakpoint-md)',
        'lg': 'var(--breakpoint-lg)',
        'xl': 'var(--breakpoint-xl)',
        '2xl': 'var(--breakpoint-2xl)',
      },
    },
  },
  plugins: [],
}