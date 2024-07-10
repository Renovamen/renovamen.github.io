import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup
} from "unocss";

const DEFAULT_FONTS =
  "system-ui, -apple-system, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif";

export default defineConfig({
  shortcuts: [
    {
      "flex-center": "flex items-center justify-center",
      hstack: "flex items-center",
      vstack: "hstack flex-col",
      "inline-hstack": "inline-flex items-center",
      "prose-lg": "lg:text-lg max-w-content",
      "nav-item": "gap-x-1 underline-offset-4 text-fg-light hover:text-fg-dark",
      "nav-active": "underline decoration-wavy text-fg-dark",
      btn: "hstack gap-x-1 rounded transition-colors decoration-none text-sm !text-fg bg-bg-dark hover:(bg-neutral-500 !text-white !no-underline)",
      "add-ring": "ring-offset-bg outline-none ring-2 ring-primary ring-offset-2",
      "theme-icon": "absolute transition-transform",
      "theme-icon-cur": "scale-100 rotate-0",
      "theme-icon-prev": "scale-0 -rotate-90",
      "theme-icon-next": "scale-0 rotate-90"
    }
  ],
  preflights: [
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getCSS: ({ theme }: { theme: any }) => `
        :root {
          --fg: 0 0% 20%;
          --fg-light: 0 0% 35%;
          --fg-dark: 0 0% 0%;
          --bg: 0 0% 100%;
          --bg-dark: 0 0% 92%;
          --border: 0 0% 85%;
          --primary: 210 80% 45%;
          --info: ${theme.colors.blue[600]};
          --success: ${theme.colors.green[700]};
          --warning: ${theme.colors.amber[600]};
          --danger: ${theme.colors.red[600]};
        }

        .dark {
          --fg: 0 0% 85%;
          --fg-light: 0 0% 75%;
          --fg-dark: 0 0% 100%;
          --bg: 0 0% 17%;
          --bg-dark: 0 0% 25%;
          --border: 0 0% 35%;
          --primary: 210 70% 63%;
          --info: ${theme.colors.sky[500]};
          --success: ${theme.colors.green[500]};
          --warning: ${theme.colors.amber[500]};
          --danger: ${theme.colors.red[500]};
        }

        * {
          border-color: hsl(var(--border));
        }

        body {
          color: hsl(var(--fg));
          background: hsl(var(--bg));
        }
      `
    }
  ],
  variants: [
    (matcher) => {
      const modes = ["theme-light:", "theme-auto:", "theme-dark:"];

      for (const mode of modes) {
        if (matcher.startsWith(mode)) {
          return {
            matcher: matcher.slice(mode.length),
            selector: (s) => `html.${mode.slice(0, -1)} ${s}`
          };
        }
      }

      return matcher;
    }
  ],
  theme: {
    fontFamily: {
      sans: `Computer Modern Sans, ${DEFAULT_FONTS}`,
      ui: DEFAULT_FONTS
    },
    colors: {
      fg: {
        DEFAULT: "hsl(var(--fg))",
        light: "hsl(var(--fg-light))",
        dark: "hsl(var(--fg-dark))"
      },
      bg: {
        DEFAULT: "hsl(var(--bg))",
        dark: "hsl(var(--bg-dark))"
      },
      border: "hsl(var(--border))",
      primary: "hsl(var(--primary))",
      info: "var(--info)",
      success: "var(--success)",
      warning: "var(--warning)",
      danger: "var(--danger)"
    },
    maxWidth: {
      content: "90ch"
    }
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        display: "inline-block",
        "vertical-align": "sub"
      }
    }),
    presetTypography()
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()]
});
