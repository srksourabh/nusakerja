/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        md: {
          seed: "#6750a4",
          primary: "#6750a4",
          "on-primary": "#ffffff",
          "primary-container": "#eaddff",
          "on-primary-container": "#21005d",
          secondary: "#625b71",
          "secondary-container": "#e8def8",
          "on-secondary-container": "#1d192b",
          tertiary: "#7d5260",
          background: "#fbf8fd",
          "on-background": "#1c1b1f",
          surface: "#fbf8fd",
          "on-surface": "#1c1b1f",
          "surface-container-low": "#f7f2fa",
          "surface-container": "#f3edf7",
          "surface-container-high": "#ece6f0",
          outline: "#79747e",
          merah: "#dc2626",
        },
      },
      borderRadius: {
        "3xl": "24px",
        "4xl": "32px",
        "5xl": "48px",
      },
    },
  },
  plugins: [],
};
