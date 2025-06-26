import { PSVError, Point, Position, utils, type Viewer } from '@photo-sphere-viewer/core';
import { Object3D } from 'three';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { type MarkersPlugin } from '../MarkersPlugin';
import { MARKER_DATA } from '../constants';
import { MarkerConfig } from '../model';
import { AbstractDomMarker } from './AbstractDomMarker';
import { Marker } from './Marker';

/**
 * @internal
 */
export class MarkerCSS3D extends AbstractDomMarker {
    private object: CSS3DObject;

    /**
     * @internal
     */
    viewportIntersection = false;

    override get threeElement() {
        return this.object;
    }

    constructor(viewer: Viewer, plugin: MarkersPlugin, config: MarkerConfig) {
        super(viewer, plugin, config);
    }

    override isCss3d(): boolean {
        return true;
    }

    override createElement(): void {
        this.element = document.createElement('div');

        this.object = new CSS3DObject(this.element);
        this.object.userData = { [MARKER_DATA]: this };

        // overwrite the visible property to be tied to the Marker instance
        // and do it without context bleed
        Object.defineProperty(this.object, 'visible', {
            enumerable: true,
            get: function (this: Object3D) {
                return (this.userData[MARKER_DATA] as Marker).config.visible;
            },
            set: function (this: Object3D, visible: boolean) {
                (this.userData[MARKER_DATA] as Marker).config.visible = visible;
            },
        });

        this.afterCreateElement();
    }

    override destroy(): void {
        delete this.object.userData[MARKER_DATA];
        delete this.object;

        super.destroy();
    }

    override render({
        viewerPosition,
        zoomLevel,
    }: {
        viewerPosition: Position;
        zoomLevel: number;
    }): Point {
        const element = this.domElement;

        this.state.size = {
            width: (element as HTMLElement).offsetWidth,
            height: (element as HTMLElement).offsetHeight,
        };

        const isVisible = this.state.positions3D[0].dot(this.viewer.state.direction) > 0 && this.viewportIntersection;

        if (isVisible) {
            const position = this.viewer.dataHelper.sphericalCoordsToViewerCoords(this.state.position);

            this.config.elementLayer.updateMarker?.({
                marker: this,
                position,
                viewerPosition,
                zoomLevel,
                viewerSize: this.viewer.state.size,
            });

            return position;
        } else {
            return null;
        }
    }

    override update(config: MarkerConfig): void {
        super.update(config);

        if (!utils.isExtendedPosition(this.config.position)) {
            throw new PSVError(`missing marker ${this.id} position`);
        }

        // convert texture coordinates to spherical coordinates
        try {
            this.state.position = this.viewer.dataHelper.cleanPosition(this.config.position);
        } catch (e) {
            throw new PSVError(`invalid marker ${this.id} position`, e);
        }

        // compute x/y/z position
        this.state.positions3D = [this.viewer.dataHelper.sphericalCoordsToVector3(this.state.position)];

        const object = this.threeElement;
        const element = this.domElement;

        element.classList.add('psv-marker--css3d');

        element.childNodes.forEach(n => n.remove());
        element.appendChild(this.config.elementLayer);
        this.config.elementLayer.style.display = 'block';

        object.position.copy(this.state.positions3D[0]).multiplyScalar(100);
        object.lookAt(0, this.state.positions3D[0].y * 100, 0);
        object.rotateY(-this.config.rotation.yaw);
        object.rotateX(-this.config.rotation.pitch);
        object.rotateZ(-this.config.rotation.roll);
    }
}
