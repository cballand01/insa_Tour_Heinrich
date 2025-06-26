import type { Navbar } from '@photo-sphere-viewer/core';
import { AbstractButton } from '@photo-sphere-viewer/core';
import { HideMarkersEvent, ShowMarkersEvent } from './events';
import type { MarkersPlugin } from './MarkersPlugin';
import pin from './icons/pin.svg';

export class MarkersButton extends AbstractButton {
    static override readonly id = 'markers';

    private readonly plugin: MarkersPlugin;

    constructor(navbar: Navbar) {
        super(navbar, {
            className: 'psv-markers-button',
            icon: pin,
            hoverScale: true,
            collapsable: true,
            tabbable: true,
        });

        this.plugin = this.viewer.getPlugin('markers');

        if (this.plugin) {
            this.plugin.addEventListener(ShowMarkersEvent.type, this);
            this.plugin.addEventListener(HideMarkersEvent.type, this);

            this.toggleActive(true);
        }
    }

    override destroy() {
        if (this.plugin) {
            this.plugin.removeEventListener(ShowMarkersEvent.type, this);
            this.plugin.removeEventListener(HideMarkersEvent.type, this);
        }

        super.destroy();
    }

    override isSupported() {
        return !!this.plugin;
    }

    handleEvent(e: Event) {
        if (e instanceof ShowMarkersEvent) {
            this.toggleActive(true);
        } else if (e instanceof HideMarkersEvent) {
            this.toggleActive(false);
        }
    }

    onClick() {
        this.plugin.toggleAllMarkers();
    }
}
