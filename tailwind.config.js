/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Аврора · стекло — grotesk headings
        display: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      colors: {
        // Agro-field palette — forest green + wheat gold (names kept for zero-churn)
        cream: "#F4F8EE", // light glass base / dark-panel text
        sand: "#E7EEDC",
        clay: "#D7E2C7",
        espresso: "#15291C", // primary dark text / solid CTA (deep forest)
        bark: "#1C3A26", // deep green glass panels
        umber: "#566B53", // secondary text (muted olive)
        gold: "#C2922E", // wheat gold
        ember: "#2F8F4E", // primary accent (leaf green)
        sage: "#6FA85C", // success / sprout
      },
      // доп. ступени прозрачности: в демо используются bg-ember/12, bg-gold/12, bg-amber-300/28 и т.п.
      opacity: {
        8: "0.08",
        12: "0.12",
        14: "0.14",
        18: "0.18",
        28: "0.28",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      keyframes: {
        floatUp: {
          "0%": { opacity: "0", transform: "translateY(28px)", filter: "blur(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)", filter: "blur(0)" },
        },
      },
      animation: {
        floatUp: "floatUp 0.9s cubic-bezier(0.32,0.72,0,1) both",
      },
    },
  },
  plugins: [],
};
