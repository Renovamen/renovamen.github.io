/* eslint-disable */

/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import type { AttributifyAttributes } from "@unocss/preset-attributify";

declare global {
  namespace astroHTML.JSX {
    interface HTMLAttributes extends AttributifyAttributes { }
  }
}
