import { events, type Viewer } from '@photo-sphere-viewer/core';
import { Scene } from 'three';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { MARKER_DATA } from './constants';
import { MarkerCSS3D } from './markers/MarkerCSS3D';

/**
 * @internal
 */
export class CSS3DContainer {
    element: HTMLElement;

    private readonly renderer: CSS3DRenderer;
    private readonly scene: Scene;
    private readonly intersectionObserver: IntersectionObserver;

    constructor(
        private viewer: Viewer,
    ) {
        this.element = document.createElement('div');
        this.element.className = 'psv-markers-css3d-container';

        this.renderer = new CSS3DRenderer({ element: this.element });
        this.scene = new Scene();

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const marker = (entry.target as any)[MARKER_DATA] as MarkerCSS3D;
                if (marker.config.visible) {
                    marker.viewportIntersection = entry.isIntersecting;
                }
            });
        }, {
            root: this.element,
        });

        viewer.addEventListener(events.ReadyEvent.type, this, { once: true });
        viewer.addEventListener(events.SizeUpdatedEvent.type, this);
        viewer.addEventListener(events.RenderEvent.type, this);
    }

    handleEvent(e: Event) {
        switch (e.type) {
            case events.ReadyEvent.type:
            case events.SizeUpdatedEvent.type:
                this.updateSize();
                break;
            case events.RenderEvent.type:
                this.render();
                break;
        }
    }

    destroy(): void {
        this.viewer.removeEventListener(events.ReadyEvent.type, this);
        this.viewer.removeEventListener(events.SizeUpdatedEvent.type, this);
        this.viewer.removeEventListener(events.RenderEvent.type, this);

        this.intersectionObserver.disconnect();
    }

    private updateSize() {
        const size = this.viewer.getSize();
        this.renderer.setSize(size.width, size.height);
    }

    private render() {
        this.renderer.render(this.scene, this.viewer.renderer.camera);
    }

    addObject(marker: MarkerCSS3D) {
        this.scene.add(marker.threeElement);
        this.intersectionObserver.observe(marker.domElement);
    }

    removeObject(marker: MarkerCSS3D) {
        this.scene.remove(marker.threeElement);
        this.intersectionObserver.unobserve(marker.domElement);
    }
}
