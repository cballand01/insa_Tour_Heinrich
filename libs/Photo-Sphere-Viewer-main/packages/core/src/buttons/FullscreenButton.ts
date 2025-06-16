import type { Navbar } from '../components/Navbar';
import { FullscreenEvent } from '../events';
import { AbstractButton } from './AbstractButton';
import { ICONS } from '../data/constants';

export class FullscreenButton extends AbstractButton {
    static override readonly id = 'fullscreen';

    constructor(navbar: Navbar) {
        super(navbar, {
            className: 'psv-fullscreen-button',
            hoverScale: true,
            collapsable: false,
            tabbable: true,
            icon: ICONS.fullscreenIn,
            iconActive: ICONS.fullscreenOut,
        });

        this.viewer.addEventListener(FullscreenEvent.type, this);
    }

    override destroy() {
        this.viewer.removeEventListener(FullscreenEvent.type, this);

        super.destroy();
    }

    handleEvent(e: Event) {
        if (e instanceof FullscreenEvent) {
            this.toggleActive(e.fullscreenEnabled);
        }
    }

    onClick() {
        this.viewer.toggleFullscreen();
    }
}
