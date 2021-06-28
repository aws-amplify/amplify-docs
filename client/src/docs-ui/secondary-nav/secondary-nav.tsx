import {Component, Host, h, Prop, State, Listen} from "@stencil/core";
import {
  secondaryNavStyle,
  hostStyle,
  linkActiveStyle,
  shadowStyle,
} from "./secondary-nav.style";
import {createVNodeFromHyperscriptNode} from "../../utils/hyperscript";
import {pageContext} from "../page/page.context";
import {SelectedFilters} from "../page/page.types";
import {
  AWS_USER_GUIDE,
  IOS_REFERENCE,
  ANDROID_REFERENCE,
  JS_REFERENCE,
} from "../../constants/links";

@Component({tag: "docs-secondary-nav", shadow: false})
export class DocsSecondaryNav {
  /*** the current filter state */
  @Prop() readonly selectedFilters?: SelectedFilters;
  /*** whether or not the current page has a menu */
  @Prop() readonly pageHasMenu?: boolean;

  render() {
    return (
      <Host class={hostStyle} id="secondary-nav">
        <docs-container>
          <div class={secondaryNavStyle}>
            <div>
              <div>
                {[
                  {
                    label: "Getting Started",
                    url: "/start",
                  },
                  {
                    label: "Libraries",
                    url: "/lib",
                    additionalActiveChildRoots: ["/lib", "/sdk"],
                  },
                  {
                    label: "UI Components",
                    url: "/ui",
                    additionalActiveChildRoots: ["/ui"],
                  },
                  {
                    label: "CLI",
                    url: "/cli",
                  },
                  {
                    label: "Console",
                    url: "/console",
                  },
                  {
                    label: "Guides",
                    url: "/guides",
                  },
                  {
                    label: "Sample Apps",
                    url: "/sample-app",
                  },
                  ...(this.selectedFilters?.platform
                    ? [
                        {
                          label: "API Reference",
                          url: (() => {
                            switch (this.selectedFilters.platform) {
                              case "ios": {
                                return IOS_REFERENCE;
                              }
                              case "android": {
                                return ANDROID_REFERENCE;
                              }
                              case "js": {
                                return JS_REFERENCE;
                              }
                            }
                          })(),
                          external: true,
                        },
                      ]
                    : []),
                ].map(({url, label, external, additionalActiveChildRoots}) =>
                  createVNodeFromHyperscriptNode([
                    external ? "amplify-external-link" : "docs-internal-link",
                    {
                      key: label,
                      href: url,
                      ...(external
                        ? {graphic: "black"}
                        : {
                            childActiveClass: linkActiveStyle,
                            additionalActiveChildRoots,
                          }),
                    },
                    ["span", null, label],
                  ]),
                )}
                <div class={shadowStyle}></div>
              </div>
            </div>
          </div>
          {this.pageHasMenu && <amplify-sidebar-open-button />}
        </docs-container>
      </Host>
    );
  }
}

pageContext.injectProps(DocsSecondaryNav, ["selectedFilters"]);
