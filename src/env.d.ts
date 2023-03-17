/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// https://github.com/unocss/unocss/blob/main/packages/preset-attributify/README.md#typescript-support-jsxtsx

import type { AttributifyAttributes } from "@unocss/preset-attributify";

interface Attributes extends AttributifyAttributes {
  hstack?: boolean;
  i?: string;
}

declare global {
  namespace astroHTML.JSX {
    /* eslint-disable-next-line */
    interface HTMLAttributes extends Attributes {}
  }
}

declare module "solid-js" {
  namespace JSX {
    /* eslint-disable-next-line */
    interface HTMLAttributes<T> extends Attributes {}
  }
}
