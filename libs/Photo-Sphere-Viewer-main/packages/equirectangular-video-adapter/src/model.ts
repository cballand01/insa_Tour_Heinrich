import type { PanoData } from '@photo-sphere-viewer/core';
import type { AbstractVideoAdapterConfig, AbstractVideoPanorama } from '../../shared/AbstractVideoAdapter';

/**
 * Configuration of an equirectangular video
 */
export type EquirectangularVideoPanorama = AbstractVideoPanorama & {
    data?: PanoData | ((image: HTMLVideoElement) => PanoData);
};

export type EquirectangularVideoAdapterConfig = AbstractVideoAdapterConfig & {
    /**
     * number of faces of the sphere geometry, higher values may decrease performances
     * @default 64
     */
    resolution?: number;
};
