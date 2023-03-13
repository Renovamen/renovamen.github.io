/* eslint-disable */

/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// https://github.com/unocss/unocss/blob/main/packages/preset-attributify/README.md#typescript-support-jsxtsx

import type { AttributifyAttributes } from "@unocss/preset-attributify";

declare global {
  namespace astroHTML.JSX {
    interface HTMLAttributes extends AttributifyAttributes { }
  }
}

declare module 'solid-js' {
  namespace JSX {
    interface HTMLAttributes<T> extends AttributifyAttributes {
      hstack?: boolean;
      i?: string;
    }
  }
}
