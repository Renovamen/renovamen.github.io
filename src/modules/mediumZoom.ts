// Modified from: https://github.com/vuepress/vuepress-next/tree/main/ecosystem/plugin-medium-zoom

import mediumZoom from "medium-zoom";
import { nextTick, type InjectionKey } from "vue";
import { type Zoom } from "medium-zoom";
import { type UserModule } from "~/types";

declare module "medium-zoom" {
  interface Zoom {
    refresh: (selector?: string) => void;
  }
}

export const mediumZoomSymbol: InjectionKey<Zoom> = Symbol("mediumZoom");

export const install: UserModule = ({ app, router, isClient }) => {
  if (isClient) {
    // create zoom instance and provide it
    const zoom = mediumZoom();
    zoom.refresh = () => {
      zoom.detach();
      zoom.attach(":not(a) > img:not(.no-zoom)");
    };
    app.provide(mediumZoomSymbol, zoom);

    router.afterEach(() => {
      nextTick(zoom.refresh);
    });
  }
};
