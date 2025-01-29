/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {
      screen: {
        sm: "340px",
        md: "540px",
        lg: "768px",
        xl: "1180px",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            h2: {
              color: '#1e40af',
            },
            h3: {
              color: '#1f2937',
            },
          },
        },
      },
    },
  },
};
