/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*{.html, .js}", 
    "./public/**/**/*.js"
  ],
  theme: {
    extend: {},
    fontFamily: {
      "sans": ["Raleway", "sans-serif"]
    }
  },
  plugins: [],
}
