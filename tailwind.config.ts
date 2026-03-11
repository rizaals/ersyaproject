import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      colors: {
        // ersya projects — brand teal palette
        teal: {
          50:  '#f0fdfc',
          100: '#ccfbf7',
          200: '#99f5ef',
          300: '#5eecd8',
          400: '#2dd4bf',
          500: '#26bfbf',  // primary brand
          600: '#1a9f9f',  // hover
          700: '#157a7a',
          800: '#115c5c',
          900: '#0d4040',
          950: '#082828',
        },
        brand: {
          DEFAULT: '#26bfbf',
          light:   '#5eecd8',
          dark:    '#1a9f9f',
          subtle:  '#f0fdfc',
        },
        // shadcn/ui tokens — mapped to brand teal
        border:     'hsl(var(--border))',
        input:      'hsl(var(--input))',
        ring:       'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #2dd4bf 0%, #26bfbf 50%, #1a9f9f 100%)',
        'brand-gradient-light': 'linear-gradient(135deg, #f0fdfc 0%, #ccfbf7 100%)',
      },
    },
  },
  plugins: [],
}

export default config
