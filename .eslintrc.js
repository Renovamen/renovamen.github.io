const astro = require("@renovamen/eslint-config-astro");
const solid = require("@renovamen/eslint-config-solid");

module.exports = {
  extends: ["@renovamen/eslint-config-astro", "@renovamen/eslint-config-solid"],
  overrides: astro.overrides.concat(solid.overrides),
  ignorePatterns: ["node_modules/", "dist/", "auto-imports.d.ts"]
};
