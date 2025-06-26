import type { Navbar } from '@photo-sphere-viewer/core';
import { AbstractButton, events } from '@photo-sphere-viewer/core';
import { ProgressEvent } from '../events';
import { formatTime } from '../utils';
import type { VideoPlugin } from '../VideoPlugin';

export class TimeCaption extends AbstractButton {
    static override readonly id = 'videoTime';
    static override readonly groupId = 'video';

    private plugin?: VideoPlugin;

    private readonly contentElt: HTMLElement;

    constructor(navbar: Navbar) {
        super(navbar, {
            className: 'psv-caption psv-video-time',
            hoverScale: false,
            collapsable: false,
            tabbable: false,
        });

        this.contentElt = document.createElement('div');
        this.contentElt.className = 'psv-caption-content';
        this.container.appendChild(this.contentElt);

        this.plugin = this.viewer.getPlugin('video');

        if (this.plugin) {
            this.viewer.addEventListener(events.PanoramaLoadedEvent.type, this);
            this.plugin.addEventListener(ProgressEvent.type, this);
        }
    }

    override destroy() {
        if (this.plugin) {
            this.viewer.removeEventListener(events.PanoramaLoadedEvent.type, this);
            this.plugin.removeEventListener(ProgressEvent.type, this);
        }

        delete this.plugin;

        super.destroy();
    }

    handleEvent(e: Event) {
        switch (e.type) {
            case events.PanoramaLoadedEvent.type:
            case ProgressEvent.type: {
                let caption = `<strong>${formatTime(this.plugin.getTime())}</strong>`;
                if (isFinite(this.plugin.getDuration())) {
                    caption += ` / ${formatTime(this.plugin.getDuration())}`;
                }
                this.contentElt.innerHTML = caption;
                break;
            }
        }
    }

    onClick(): void {
        // nothing
    }
}
