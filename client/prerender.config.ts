import {PrerenderConfig} from "@stencil/core";
import {routes as entryUrls} from "./src/api/routes";

export const config: PrerenderConfig = {
  crawlUrls: false,
  entryUrls,
  beforeHydrate(document, _) {
    // @ts-ignore
    document.defaultView.navigator.product = "NS";
  },
  hydrateOptions() {
    return {
      addModulePreloads: true,
      removeUnusedStyles: true,
      minifyStyleElements: true,
      minifyScriptElements: true,
      removeAttributeQuotes: true,
      removeBooleanAttributeQuotes: true,
      removeEmptyAttributes: true,
      removeHtmlComments: true,
      maxHydrateCount: 2000,
      runtimeLogging: true,
      timeout: 1000000,
    };
  },
  filterUrl(url) {
    if (url && url.toString().includes("authenticator")) return false;
    return !!(url && entryUrls.includes(url.pathname) && url.pathname !== "/");
  },
};
