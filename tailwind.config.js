/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#273486',
        'bg-gray-900': '#111827',
        'bg-gray-800': '#1F2937',
        'bg-blue-600': '#2563EB',
        'text-primary': '#FFFFFF',
        'text-secondary': '#D1D5DB',
        border: '#374151',
      },
    },
  },
  plugins: [],
}