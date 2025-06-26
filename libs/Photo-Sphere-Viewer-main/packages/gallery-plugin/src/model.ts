import type { PanoramaOptions, Size } from '@photo-sphere-viewer/core';

export type GalleryItem = {
    /**
     * Unique identifier of the item
     */
    id: string | number;
    /**
     * Panorama of the item
     */
    panorama: any;
    /**
     * URL of the thumbnail
     */
    thumbnail?: string;
    /**
     * Text visible over the thumbnail
     */
    name?: string;
    /**
     * Any option supported by the `setPanorama()` method
     */
    options?: PanoramaOptions;
};

export type GalleryPluginConfig = {
    items?: GalleryItem[];
    /**
     * Displays arrows to navigate the gallery
     * @default true
     */
    navigationArrows?: boolean;
    /**
     * Displays the gallery when loading the first panorama
     * @default false
     */
    visibleOnLoad?: boolean;
    /**
     * Hides the gallery when the user clicks on an item
     * @default true
     */
    hideOnClick?: boolean;
    /**
     *  Size of thumbnails
     * @default 200x100
     */
    thumbnailSize?: Size;
};

export type UpdatableGalleryPluginConfig = Omit<GalleryPluginConfig, 'items' | 'navigationArrows' | 'visibleOnLoad'>;
