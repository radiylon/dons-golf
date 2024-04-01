/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        lemonade: {
          ...require("daisyui/src/theming/themes")["lemonade"],
          primary: "#f9fdf0",
          secondary: "#f4bb47",
          "base-100": "#315b42",
          accent: "#77787c",
          neutral: "#131313"
        },
      },
    ]
  },
  plugins: [require("daisyui")],
}

