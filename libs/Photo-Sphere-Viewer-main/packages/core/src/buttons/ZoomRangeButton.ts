import type { Navbar } from '../components/Navbar';
import { SYSTEM } from '../data/system';
import { ReadyEvent, ZoomUpdatedEvent } from '../events';
import { Slider, SliderDirection, SliderUpdateData, getStyleProperty, invertResolvableBoolean } from '../utils';
import { AbstractButton } from './AbstractButton';

export class ZoomRangeButton extends AbstractButton {
    static override readonly id = 'zoomRange';
    static override readonly groupId = 'zoom';

    private readonly slider: Slider;
    private readonly zoomRange: HTMLElement;
    private readonly zoomValue: HTMLElement;
    private readonly mediaMinWidth: number;

    constructor(navbar: Navbar) {
        super(navbar, {
            className: 'psv-zoom-range',
            hoverScale: false,
            collapsable: false,
            tabbable: false,
        });

        this.zoomRange = document.createElement('div');
        this.zoomRange.className = 'psv-zoom-range-line';
        this.container.appendChild(this.zoomRange);

        this.zoomValue = document.createElement('div');
        this.zoomValue.className = 'psv-zoom-range-handle';
        this.zoomRange.appendChild(this.zoomValue);

        this.slider = new Slider(this.container, SliderDirection.HORIZONTAL, data => this.__onSliderUpdate(data));

        this.mediaMinWidth = parseInt(getStyleProperty(this.container, 'max-width'), 10);

        this.viewer.addEventListener(ZoomUpdatedEvent.type, this);
        if (this.viewer.state.ready) {
            this.__moveZoomValue(this.viewer.getZoomLevel());
        } else {
            this.viewer.addEventListener(ReadyEvent.type, this);
        }
    }

    override destroy() {
        this.slider.destroy();

        this.viewer.removeEventListener(ZoomUpdatedEvent.type, this);
        this.viewer.removeEventListener(ReadyEvent.type, this);

        super.destroy();
    }

    handleEvent(e: Event) {
        if (e instanceof ZoomUpdatedEvent) {
            this.__moveZoomValue(e.zoomLevel);
        } else if (e instanceof ReadyEvent) {
            this.__moveZoomValue(this.viewer.getZoomLevel());
        }
    }

    onClick() {
        // nothing
    }

    override isSupported() {
        return invertResolvableBoolean(SYSTEM.isTouchEnabled);
    }

    override autoSize() {
        if (this.state.supported) {
            if (this.viewer.state.size.width <= this.mediaMinWidth && this.state.visible) {
                this.hide(false);
            } else if (this.viewer.state.size.width > this.mediaMinWidth && !this.state.visible) {
                this.show(false);
            }
        }
    }

    private __moveZoomValue(level: number) {
        this.zoomValue.style.left = (level / 100) * this.zoomRange.offsetWidth - this.zoomValue.offsetWidth / 2 + 'px';
    }

    private __onSliderUpdate(data: SliderUpdateData) {
        if (data.mousedown) {
            this.viewer.zoom(data.value * 100);
        }
    }
}
