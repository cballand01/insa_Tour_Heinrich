import type { Navbar } from '@photo-sphere-viewer/core';
import { AbstractButton } from '@photo-sphere-viewer/core';
import type { AutorotatePlugin } from './AutorotatePlugin';
import { AutorotateEvent } from './events';
import iconActive from './icons/play-active.svg';
import icon from './icons/play.svg';

export class AutorotateButton extends AbstractButton {
    static override readonly id = 'autorotate';

    private readonly plugin: AutorotatePlugin;

    constructor(navbar: Navbar) {
        super(navbar, {
            className: 'psv-autorotate-button',
            hoverScale: true,
            collapsable: true,
            tabbable: true,
            icon: icon,
            iconActive: iconActive,
        });

        this.plugin = this.viewer.getPlugin('autorotate');

        this.plugin?.addEventListener(AutorotateEvent.type, this);
    }

    override destroy() {
        this.plugin?.removeEventListener(AutorotateEvent.type, this);

        super.destroy();
    }

    override isSupported() {
        return !!this.plugin;
    }

    handleEvent(e: Event) {
        if (e instanceof AutorotateEvent) {
            this.toggleActive(e.autorotateEnabled);
        }
    }

    onClick() {
        if (this.plugin.isEnabled()) {
            this.plugin.disableOnIdle();
        }
        this.plugin.toggle();
    }
}
