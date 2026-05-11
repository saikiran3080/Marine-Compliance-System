/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        harbor: {
          50: '#eef9fb',
          100: '#d7f0f4',
          500: '#1a8ca3',
          600: '#147487',
          900: '#13313d',
        },
        signal: {
          green: '#0f9f6e',
          amber: '#c27803',
          red: '#d33d3d',
        },
      },
      boxShadow: {
        soft: '0 14px 34px rgba(31, 44, 60, 0.08)',
      },
    },
  },
}
