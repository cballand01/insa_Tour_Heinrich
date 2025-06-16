import arrowIconSvg from './arrow.svg';
import { VirtualTourArrowStyle } from './model';

export const LINK_DATA = 'tourLink';
export const LINK_ID = '__tour-link__';

export const LOADING_TOOLTIP = {
    className: 'psv-virtual-tour-tooltip',
    content: `<div class="psv-virtual-tour-loader"><div></div><div></div><div></div></div>`,
};

/**
 * Default style of the link arrow
 */
export const DEFAULT_ARROW: VirtualTourArrowStyle = {
    element: () => {
        const button = document.createElement('button');
        button.className = 'psv-virtual-tour-arrow';
        button.innerHTML = arrowIconSvg;
        return button;
    },
    size: { width: 80, height: 80 },
};
