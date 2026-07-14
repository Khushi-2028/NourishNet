/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12"
        },
        accent: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b"
        },
        surface: {
          light: "#ffffff",
          dark: "#0f1115"
        },
        ink: {
          light: "#0f172a",
          dark: "#f1f5f9"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "Inter", "ui-sans-serif", "sans-serif"]
      },
      boxShadow: {
        soft: "0 2px 20px -4px rgba(15, 23, 42, 0.08)",
        card: "0 4px 24px -6px rgba(15, 23, 42, 0.12)",
        glow: "0 0 0 1px rgba(249, 115, 22, 0.15), 0 8px 24px -8px rgba(249, 115, 22, 0.35)"
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem"
      },
      backdropBlur: {
        xs: "2px"
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" }
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.55 }
        }
      },
      animation: {
        shimmer: "shimmer 2s infinite linear",
        fadeUp: "fadeUp 0.4s ease-out",
        pulseSoft: "pulseSoft 2s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
