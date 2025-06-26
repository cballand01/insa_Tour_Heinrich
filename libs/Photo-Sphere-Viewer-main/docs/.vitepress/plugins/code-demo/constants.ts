import ICON_CODEPEN from './icons/codepen.svg?raw';
import ICON_JSFIDDLE from './icons/jsfiddle.svg?raw';
import ICON_STACKBLITZ from './icons/stackblitz.svg?raw';

export type Service = 'codepen' | 'jsfiddle' | 'stackblitz';

export const SERVICES: Record<Service, {
    name: string;
    url: string;
    icon: string;
}> = {
    codepen: {
        // https://blog.codepen.io/documentation/api/prefill
        name: 'Codepen',
        url: 'https://codepen.io/pen/define',
        icon: ICON_CODEPEN,
    },
    jsfiddle: {
        // https://docs.jsfiddle.net/api/display-a-fiddle-from-post
        name: 'JSFiddle',
        url: 'https://jsfiddle.net/api/post/library/pure',
        icon: ICON_JSFIDDLE,
    },
    stackblitz: {
        // https://developer.stackblitz.com/platform/api/post-api
        name: 'StackBlitz',
        url: 'https://stackblitz.com/run',
        icon: ICON_STACKBLITZ,
    },
};
