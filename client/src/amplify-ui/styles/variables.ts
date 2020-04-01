import {Breakpoint} from "./media";
import {css} from "emotion";

export const variablesStyle = css`
  :root {
    --color-black: #000;
    --color-white: #fff;
    --color-off-white: #f8f8f8;

    --color-orange-lt: #ffc46d;
    --color-orange-md: #ffac31;
    --color-orange-hv: #ff9900;

    --color-ink-lt: #55677d;
    --color-ink-md: #31465f;
    --color-ink-hv: #152939;

    --color-blue-lt: #00b9f2;
    --color-blue-md: #28c3f3;
    --color-blue-hv: #04ace0;

    --color-grey-lt: #f1f1eb;
    --color-grey-md: #e5e5df;
    --color-grey-hv: #828282;

    --color-dark-hv: #131415;

    --color-purple: #527fff;
    --color-anchor: #007eb9;

    --color-twitter: #4199d4;
    --github-gray: #333;
    --youtube-red: #c4302b;

    --primary-color: var(--color-orange-hv);
    --font-color: var(--color-ink-hv);
    --font-color-secondary: var(--color-grey-hv);
    --secondary-color: var(--color-ink-hv);
    --bg-color: var(--color-white);
    --bg-color-secondary: var(--color-grey-md);
    --bg-color-tertiary: var(--color-grey-lt);
    --bg-color-hover: var(--color-grey-lt);
    --border-color: var(--color-grey-md);
    --code-bg-color: var(--color-ink-hv);
    --code-font-color: var(--color-white);
    --font-color-contrast: var(--color-white);

    --breakpoint-fablet: ${Breakpoint.FABLET};
    --breakpoint-tablet: ${Breakpoint.TABLET};
    --breakpoint-laptop: ${Breakpoint.LAPTOP};
    --breakpoint-desktop: ${Breakpoint.DESKTOP};
    --breakpoint-monitor: ${Breakpoint.MONITOR};
  }

  [data-theme="dark"] {
    --font-color: var(--color-white);
    --font-color-secondary: var(--color-grey-md);
    --bg-color: var(--color-dark-hv);
    --bg-color-secondary: var(--color-ink-hv);
    --bg-color-tertiary: var(--color-ink-md);
    --bg-color-hover: var(--color-ink-md);
    --border-color: var(--color-ink-md);
  }
`;
