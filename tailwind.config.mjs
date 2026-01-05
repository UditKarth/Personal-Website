/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      spacing: {
        'section': '80px',
        'section-lg': '120px',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
      },
      letterSpacing: {
        'tight': '-0.02em',
        'tighter': '-0.04em',
      },
      fontSize: {
        'hero': ['48px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'hero-lg': ['64px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
      },
    },
  },
  plugins: [],
}

