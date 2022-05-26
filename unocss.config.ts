import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup
} from "unocss";

export default defineConfig({
  shortcuts: [
    ["flex-center", "flex items-center justify-center"],
    ["hstack", "flex items-center"],
    ["vstack", "flex flex-col justify-center"],
    [
      "btn",
      "px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50"
    ],
    [
      "nav-item",
      "hstack space-x-1 text-gray-600 hover:text-black dark:(text-gray-300 hover:text-white)"
    ]
  ],
  rules: [
    ["nav-shadow", { "box-shadow": "0 1px 8px 0 rgba(27, 35, 47, .1);" }]
  ],
  theme: {
    fontFamily: {
      sans: `"DM Sans", system-ui, -apple-system, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji`
    }
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true
    }),
    presetTypography()
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  safelist: "prose m-auto text-left".split(" ")
});
