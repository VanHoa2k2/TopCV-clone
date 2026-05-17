import type { Config } from "tailwindcss";
const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "15px",
      screens: {
        "2xl": "1170px",
      },
    },
    extend: {
      width: {
        "calc-job-detail": "calc(100% - 144px)",
        "calc-left-content-job-detail": "calc(33% - 24px)",
        "calc-name-company": "calc(100% - 106px)",
      },
      boxShadow: {
        custom: "0 8px 16px 0 rgba(1, 18, 34, 0.04)",
        contentRight: "0 0 14px rgba(167, 139, 250, .2)",
        hoverCardCompany: "0 10px 30px rgba(124, 58, 237, .2)",
      },
      transitionProperty: {
        transform: "transform",
      },
      transform: {
        "rotate-180": "rotate(180deg)",
      },
      colors: {
        dark: "#212f3f",
        primary: "#7c3aed",

        white: "#fff",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    variants: {
      extend: {
        transform: ["hover"],
        rotate: ["hover"],
      },
    },

    background: {
      sectionCompanyHeader: `transparent linear-gradient(6deg, #fff, #ede9fe 100%, rgba(237, 233, 254, .702) 0) 0 0 no-repeat padding-box`,
    },

    backgroundImage: {
      auth: `url('/assets/images/auth_bg_desktop.png')`,
      auth02: `url('/assets/images/banner-02.webp')`,
      "auth-arrow": `url('/assets/images/auth_arrow.webp')`,
      "section-header": `url('/assets/images/bg_header.webp')`,
      line: `linear-gradient(90deg, rgba(167, 139, 250, 0), #a78bfa 50%, rgba(167, 139, 250, 0))`,
      sectionJobHeader: `linear-gradient(0deg, #fff, #f5f3ff)`,
      lineJobHeader: `linear-gradient(0deg, #fff, #dadada 50.45%, #fff);`,
      bgHeaderUploadCV: "linear-gradient(86deg, #6d28d9 7.25%, #5b21b6 94.78%)",
      bgJobDetailIcon: "linear-gradient(11deg, #8b5cf6, #7c3aed)",
      bgCompanyDetail: "linear-gradient(90deg, #212f3f, #7c3aed)",
    },
    backgroundSize: {
      full: "100% 100%",
    },
  },
  corePlugins: {
    lineClamp: true,
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar-hide")],
} satisfies Config;

export default config;
