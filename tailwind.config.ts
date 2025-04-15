// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  // Specify the files Tailwind should scan for classes
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // *** Enable class-based dark mode ***
  darkMode: 'class',
  // Define theme customizations
  theme: {
    extend: {
      // --- YOUR CUSTOMIZATIONS HERE ---
      colors: {
        'theme-primary': '#d4d65b',
      },
      // fontFamily: { ... },
    },
  },
  // Add any Tailwind plugins here
  plugins: [],
}
export default config
