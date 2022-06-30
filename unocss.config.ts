import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup
} from "unocss";

export default defineConfig({
  shortcuts: [
    ["flex-center", "flex items-center justify-center"],
    ["hstack", "flex items-center"],
    ["vstack", "flex flex-col justify-center"],
    [
      "nav-item",
      "hstack space-x-1 text-gray-600 hover:text-black dark:(text-gray-300 hover:text-white)"
    ],
    ["prose-lg", "lg:text-lg max-w-content"]
  ],
  theme: {
    fontFamily: {
      sans: `"Computer Modern Sans", system-ui, -apple-system, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif`
    },
    boxShadow: {
      nav: "0 1px 8px 0 rgba(27, 35, 47, .1)"
    },
    colors: {
      brand: "#377bb5"
    },
    maxWidth: {
      content: "85ch"
    }
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        ui: "DM Sans:400,700"
      }
    })
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  safelist: "prose prose-lg m-auto text-left".split(" ")
});
