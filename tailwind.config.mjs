/** @type {import('tailwindcss').Config} */
// Trellis Steel: graphite ground, steel structure, chalk paper, one lime accent.
export default {
  content: ['./src/**/*.{astro,html,js,ts}'],
  theme: {
    borderRadius: { none: '0', DEFAULT: '2px', sm: '2px', full: '9999px' },
    extend: {
      colors: {
        graphite: { DEFAULT: '#15181B', 2: '#1E2226', 3: '#2A2F34' },
        steel: { DEFAULT: '#9AA3A8', dim: '#5E676C' },
        chalk: { DEFAULT: '#F4F2EE', 2: '#E8E5DF' },
        lime: { DEFAULT: '#C6F432', hi: '#D6FF5A', ink: '#2B3600' },
        body: '#3A4146',
      },
      fontFamily: {
        display: ['"IBM Plex Sans"', '"Helvetica Neue"', 'Arial', 'system-ui', 'sans-serif'],
        sans: ['"IBM Plex Sans"', '"Helvetica Neue"', 'Arial', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', '"SF Mono"', 'Menlo', 'Consolas', 'monospace'],
      },
      maxWidth: { page: '1760px' },
    },
  },
  plugins: [],
};
