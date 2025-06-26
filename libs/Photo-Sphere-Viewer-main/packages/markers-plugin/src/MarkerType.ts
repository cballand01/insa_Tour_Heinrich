import { PSVError } from '@photo-sphere-viewer/core';
import { MarkerConfig } from './model';

export enum MarkerType {
    image = 'image',
    html = 'html',
    element = 'element',
    imageLayer = 'imageLayer',
    videoLayer = 'videoLayer',
    elementLayer = 'elementLayer',
    polygon = 'polygon',
    polygonPixels = 'polygonPixels',
    polyline = 'polyline',
    polylinePixels = 'polylinePixels',
    square = 'square',
    rect = 'rect',
    circle = 'circle',
    ellipse = 'ellipse',
    path = 'path',
}

/**
 * Determines the type of a marker by the available properties
 * @throws {@link PSVError} when the marker's type cannot be found
 */
export function getMarkerType(config: MarkerConfig, allowNone = false): MarkerType {
    const found: MarkerType[] = [];

    Object.keys(MarkerType).forEach((type) => {
        if ((config as any)[type]) {
            found.push(type as MarkerType);
        }
    });

    if (found.length === 0 && !allowNone) {
        throw new PSVError(`missing marker content, either ${Object.keys(MarkerType).join(', ')}`);
    } else if (found.length > 1) {
        throw new PSVError(`multiple marker content, either ${Object.keys(MarkerType).join(', ')}`);
    }

    return found[0];
}
