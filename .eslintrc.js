module.exports = {
  env: {
    node: true,
    es2022: true,
    browser: true
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module"
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/triple-slash-reference": "off"
  },
  overrides: [
    {
      files: ["*.astro"],
      parser: "astro-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"]
      },
      extends: ["plugin:astro/recommended", "prettier"]
    },
    {
      files: ["*.tsx"],
      parser: "@typescript-eslint/parser",
      plugins: ["solid"],
      extends: ["plugin:solid/typescript"],
      rules: {
        "prefer-const": "off",
        "solid/no-innerhtml": "off"
      }
    },
    {
      files: ["*.ts"],
      parser: "@typescript-eslint/parser"
    },
    {
      files: ["*.{ts,tsx,js}"],
      extends: ["plugin:prettier/recommended"]
    },
    {
      // Define the configuration for `<script>` tag.
      // Script in `<script>` is assigned a virtual file name with the `.js` extension.
      files: ["**/*.astro/*.js", "*.astro/*.js"],
      rules: {
        // If you are using "prettier/prettier" rule,
        // you don't need to format inside <script> as it will be formatted as a `.astro` file.
        "prettier/prettier": "off"
      }
    }
  ],
  ignorePatterns: ["node_modules/", "dist/", "auto-imports.d.ts"]
};
