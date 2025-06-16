import { utils, type Viewer } from '@photo-sphere-viewer/core';
import { SVG_NS } from '../constants';
import { type MarkersPlugin } from '../MarkersPlugin';
import { MarkerType } from '../MarkerType';
import { MarkerConfig } from '../model';
import { AbstractStandardMarker } from './AbstractStandardMarker';

/**
 * @internal
 */
export class MarkerSvg extends AbstractStandardMarker {
    get svgElement(): SVGElement {
        return this.domElement.firstElementChild as any;
    }

    constructor(viewer: Viewer, plugin: MarkersPlugin, config: MarkerConfig) {
        super(viewer, plugin, config);
    }

    override isSvg(): boolean {
        return true;
    }

    override createElement(): void {
        const svgType = this.type === MarkerType.square ? 'rect' : this.type;
        const elt = document.createElementNS(SVG_NS, svgType);
        this.element = document.createElementNS(SVG_NS, 'svg');
        this.element.appendChild(elt);
        this.afterCreateElement();
    }

    override update(config: MarkerConfig): void {
        super.update(config);

        const svgElement = this.svgElement;

        this.needsUpdateSize = true;

        // set content
        switch (this.type) {
            case MarkerType.square:
                this.definition = {
                    x: 0,
                    y: 0,
                    width: this.config.square,
                    height: this.config.square,
                };
                break;

            case MarkerType.rect:
                if (Array.isArray(this.config.rect)) {
                    this.definition = {
                        x: 0,
                        y: 0,
                        width: this.config.rect[0],
                        height: this.config.rect[1],
                    };
                } else {
                    this.definition = {
                        x: 0,
                        y: 0,
                        width: this.config.rect.width,
                        height: this.config.rect.height,
                    };
                }
                break;

            case MarkerType.circle:
                this.definition = {
                    cx: this.config.circle,
                    cy: this.config.circle,
                    r: this.config.circle,
                };
                break;

            case MarkerType.ellipse:
                if (Array.isArray(this.config.ellipse)) {
                    this.definition = {
                        cx: this.config.ellipse[0],
                        cy: this.config.ellipse[1],
                        rx: this.config.ellipse[0],
                        ry: this.config.ellipse[1],
                    };
                } else {
                    this.definition = {
                        cx: this.config.ellipse.rx,
                        cy: this.config.ellipse.ry,
                        rx: this.config.ellipse.rx,
                        ry: this.config.ellipse.ry,
                    };
                }
                break;

            case MarkerType.path:
                this.definition = {
                    d: this.config.path,
                };
                break;

            // no default
        }

        Object.entries(this.definition).forEach(([prop, value]) => {
            svgElement.setAttributeNS(null, prop, value as string);
        });

        // set style
        if (this.config.svgStyle) {
            Object.entries(this.config.svgStyle).forEach(([prop, value]) => {
                svgElement.setAttributeNS(null, utils.dasherize(prop), value);
            });
        } else {
            svgElement.setAttributeNS(null, 'fill', 'rgba(0,0,0,0.5)');
        }
    }
}
