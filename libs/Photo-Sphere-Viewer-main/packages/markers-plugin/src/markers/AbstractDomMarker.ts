import { utils, type Viewer } from '@photo-sphere-viewer/core';
import { MARKER_DATA } from '../constants';
import { type MarkersPlugin } from '../MarkersPlugin';
import { MarkerConfig } from '../model';
import { Marker } from './Marker';

/**
 * Base class for markers added in the DOM
 * @internal
 */
export abstract class AbstractDomMarker extends Marker {
    override get domElement(): HTMLElement | SVGElement {
        return this.element;
    }

    constructor(viewer: Viewer, plugin: MarkersPlugin, config: MarkerConfig) {
        super(viewer, plugin, config);
    }

    protected afterCreateElement(): void {
        this.element[MARKER_DATA] = this;
    }

    override destroy(): void {
        delete this.element[MARKER_DATA];

        super.destroy();
    }

    override update(config: MarkerConfig): void {
        super.update(config);

        const element = this.domElement;

        element.id = `psv-marker-${this.config.id}`;

        // reset CSS class
        element.setAttribute('class', 'psv-marker');
        if (this.state.visible) {
            element.classList.add('psv-marker--visible');
        }
        if (this.config.tooltip) {
            element.classList.add('psv-marker--has-tooltip');
        }
        if (this.config.content) {
            element.classList.add('psv-marker--has-content');
        }
        if (this.config.className) {
            utils.addClasses(element, this.config.className);
        }

        // apply style
        element.style.opacity = `${this.config.opacity}`;
        element.style.zIndex = `${30 + this.config.zIndex}`; // 30 is the base z-index in the stylesheet
        if (this.config.style) {
            Object.assign(element.style, this.config.style);
        }
    }
}
