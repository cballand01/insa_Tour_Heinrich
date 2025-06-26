import type { Navbar } from '@photo-sphere-viewer/core';
import { AbstractButton, events, utils } from '@photo-sphere-viewer/core';
import { PlayPauseEvent, VolumeChangeEvent } from '../events';
import volumeIcon from '../icons/volume.svg';
import type { VideoPlugin } from '../VideoPlugin';

export class VolumeButton extends AbstractButton {
    static override readonly id = 'videoVolume';
    static override readonly groupId = 'video';

    private readonly plugin?: VideoPlugin;

    private readonly rangeContainer: HTMLElement;
    private readonly range: HTMLElement;
    private readonly trackElt: HTMLElement;
    private readonly progressElt: HTMLElement;
    private readonly handleElt: HTMLElement;

    private readonly slider: utils.Slider;

    constructor(navbar: Navbar) {
        super(navbar, {
            className: 'psv-video-volume-button',
            hoverScale: true,
            collapsable: false,
            tabbable: true,
            icon: volumeIcon,
        });

        this.plugin = this.viewer.getPlugin('video');

        if (this.plugin) {
            this.rangeContainer = document.createElement('div');
            this.rangeContainer.className = 'psv-video-volume__container';
            this.container.appendChild(this.rangeContainer);

            this.range = document.createElement('div');
            this.range.className = 'psv-video-volume__range';
            this.rangeContainer.appendChild(this.range);

            this.trackElt = document.createElement('div');
            this.trackElt.className = 'psv-video-volume__track';
            this.range.appendChild(this.trackElt);

            this.progressElt = document.createElement('div');
            this.progressElt.className = 'psv-video-volume__progress';
            this.range.appendChild(this.progressElt);

            this.handleElt = document.createElement('div');
            this.handleElt.className = 'psv-video-volume__handle';
            this.range.appendChild(this.handleElt);

            this.slider = new utils.Slider(
                this.range,
                utils.SliderDirection.VERTICAL,
                this.__onSliderUpdate.bind(this),
            );

            this.viewer.addEventListener(events.PanoramaLoadedEvent.type, this);
            this.plugin.addEventListener(PlayPauseEvent.type, this);
            this.plugin.addEventListener(VolumeChangeEvent.type, this);

            this.__setVolume(0);
        }
    }

    override destroy() {
        if (this.plugin) {
            this.viewer.removeEventListener(events.PanoramaLoadedEvent.type, this);
            this.plugin.removeEventListener(PlayPauseEvent.type, this);
            this.plugin.removeEventListener(VolumeChangeEvent.type, this);
        }

        this.slider.destroy();

        super.destroy();
    }

    override isSupported() {
        return !!this.plugin;
    }

    handleEvent(e: Event) {
        switch (e.type) {
            case events.PanoramaLoadedEvent.type:
            case PlayPauseEvent.type:
            case VolumeChangeEvent.type:
                this.__setVolume(this.plugin.getVolume());
                break;
        }
    }

    onClick() {
        this.plugin.setMute();
    }

    private __onSliderUpdate(data: utils.SliderUpdateData) {
        if (data.mousedown) {
            this.plugin.setVolume(data.value);
        }
    }

    private __setVolume(volume: number) {
        let level;
        if (volume === 0) level = 0;
        else if (volume < 0.333) level = 1;
        else if (volume < 0.666) level = 2;
        else level = 3;

        utils.toggleClass(this.container, 'psv-video-volume-button--0', level === 0);
        utils.toggleClass(this.container, 'psv-video-volume-button--1', level === 1);
        utils.toggleClass(this.container, 'psv-video-volume-button--2', level === 2);
        utils.toggleClass(this.container, 'psv-video-volume-button--3', level === 3);

        this.handleElt.style.bottom = `${volume * 100}%`;
        this.progressElt.style.height = `${volume * 100}%`;
    }
}
