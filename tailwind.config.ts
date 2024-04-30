/* eslint-disable prettier/prettier */
/** @type {import('tailwindcss').Config} */

// @ts-expect-error TS(2591): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  content: [
    "./src/App.{js,jsx,ts,tsx}",
    "./src/screens/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/navigation/**/*.{js,jsx,ts,tsx}",
    "./components/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      robotoRegular: [
        "Roboto-Regular",
      ],
    },
  },
  plugins: [],
};
