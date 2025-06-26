import { AbstractComponent, utils } from '@photo-sphere-viewer/core';
import minus from '../icons/minus.svg';
import plus from '../icons/plus.svg';
import type { MapComponent } from './MapComponent';

export class MapZoomToolbar extends AbstractComponent {
    private readonly zoomIndicator: HTMLElement;
    private readonly handler = new utils.PressHandler(100);
    private time: number;
    private animation?: ReturnType<typeof requestAnimationFrame>;

    constructor(private map: MapComponent) {
        super(map, {
            className: 'psv-map__toolbar',
        });

        this.container.innerHTML = `${minus}<span class="psv-map__toolbar-text">100%</span>${plus}`;

        this.zoomIndicator = this.container.querySelector('.psv-map__toolbar-text');

        const zoomButtons = this.container.querySelectorAll('svg');
        zoomButtons[0].dataset['delta'] = '-1';
        zoomButtons[1].dataset['delta'] = '1';

        this.container.addEventListener('mousedown', this);
        window.addEventListener('mouseup', this);
        this.container.addEventListener('touchstart', this);
        window.addEventListener('touchend', this);
    }

    override destroy(): void {
        window.removeEventListener('mouseup', this);
        window.removeEventListener('touchend', this);

        super.destroy();
    }

    handleEvent(e: Event) {
        switch (e.type) {
            case 'mousedown':
            case 'touchstart': {
                const button = utils.getMatchingTarget(e, 'svg[data-delta]');
                const delta: string = button?.dataset['delta'];
                if (delta) {
                    cancelAnimationFrame(this.animation);
                    this.handler.down();
                    this.time = performance.now();
                    this.animateZoom(parseInt(delta, 10));
                    e.preventDefault();
                    e.stopPropagation();
                }
                break;
            }
            case 'mouseup':
            case 'touchend':
                if (this.animation) {
                    this.handler.up(() => {
                        cancelAnimationFrame(this.animation);
                        this.animation = null;
                    });
                    e.preventDefault();
                    e.stopPropagation();
                }
                break;
            default:
                break;
        }
    }

    setText(zoom: number) {
        this.zoomIndicator.innerText = `${Math.round(Math.exp(zoom) * 100)}%`;
    }

    private animateZoom(delta: number) {
        this.animation = requestAnimationFrame((t) => {
            this.map.zoom((delta * (t - this.time)) / 1000);
            this.time = t;
            this.animateZoom(delta);
        });
    }
}
