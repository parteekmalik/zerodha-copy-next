import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      animation: {
        slidein: "slidein .5s ease-in-out forwards",
      },
      keyframes: {
        slidein: {
          "0%": {
            transform: "translateX(100%)",
          },
          "40%": {
            transform: "translateX(-10%)",
          },
          "80%": {
            transform: "translateX(5%)",
          },
          "100%": {
            transform: "translateX(0%)",
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
