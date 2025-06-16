import type { Navbar } from '@photo-sphere-viewer/core';
import { AbstractButton } from '@photo-sphere-viewer/core';
import compass from './compass.svg';
import { GyroscopeUpdatedEvent } from './events';
import type { GyroscopePlugin } from './GyroscopePlugin';

export class GyroscopeButton extends AbstractButton {
    static override readonly id = 'gyroscope';

    private readonly plugin: GyroscopePlugin;

    /**
     * @param {PSV.components.Navbar} navbar
     */
    constructor(navbar: Navbar) {
        super(navbar, {
            className: 'psv-gyroscope-button',
            icon: compass,
            hoverScale: true,
            collapsable: true,
            tabbable: true,
        });

        this.plugin = this.viewer.getPlugin('gyroscope');

        if (this.plugin) {
            this.plugin.addEventListener(GyroscopeUpdatedEvent.type, this);
        }
    }

    override destroy() {
        if (this.plugin) {
            this.plugin.removeEventListener(GyroscopeUpdatedEvent.type, this);
        }

        super.destroy();
    }

    override isSupported() {
        return !this.plugin ? false : { initial: false, promise: this.plugin.isSupported() };
    }

    /**
     * @internal
     */
    handleEvent(e: Event) {
        if (e instanceof GyroscopeUpdatedEvent) {
            this.toggleActive(e.gyroscopeEnabled);
        }
    }

    /**
     * Toggles gyroscope control
     */
    onClick() {
        this.plugin.toggle();
    }
}
