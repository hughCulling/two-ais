// tailwind.config.ts
// Standard configuration file for Tailwind CSS with Next.js App Router

import type { Config } from 'tailwindcss'

const config: Config = {
  // Specify the files Tailwind should scan for classes
  content: [
    // './src/pages/**/*.{js,ts,jsx,tsx,mdx}', // Include if using 'pages' directory
    './src/components/**/*.{js,ts,jsx,tsx,mdx}', // Scan components folder
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // Scan app router folder
  ],
  // Define theme customizations
  theme: {
    extend: {
      // --- ADD YOUR CUSTOMIZATIONS HERE ---
      colors: {
        // Example: Add your theme color now or later
        'theme-primary': '#d4d65b', // Your muted olive/mustard green
        // 'theme-primary-dark': '#b0b24a', // Optional darker shade for hover etc.
      },
      // fontFamily: { // Example if using custom fonts via CSS variables
      //   sans: ['var(--font-geist-sans)', /* Add fallback fonts */],
      //   mono: ['var(--font-geist-mono)', /* Add fallback fonts */],
      // },
      // Add other extensions like backgroundImage, spacing, etc. if needed
    },
  },
  // Add any Tailwind plugins here
  plugins: [],
  // Configure dark mode (media strategy uses OS preference)
  darkMode: 'media', // or 'class' if you prefer manual toggling
}
export default config

