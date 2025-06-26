import { TypedEvent } from '@photo-sphere-viewer/core';
import type { GalleryPlugin } from './GalleryPlugin';

/**
 * @event Triggered when the gallery shown
 */
export class ShowGalleryEvent extends TypedEvent<GalleryPlugin> {
    static override readonly type = 'show-gallery';
    override type: 'show-gallery';

    /** @internal */
    constructor(public readonly fullscreen: boolean) {
        super(ShowGalleryEvent.type);
    }
}

/**
 * @event Triggered when the gallery hidden
 */
export class HideGalleryEvent extends TypedEvent<GalleryPlugin> {
    static override readonly type = 'hide-gallery';
    override type: 'hide-gallery';

    /** @internal */
    constructor() {
        super(HideGalleryEvent.type);
    }
}

export type GalleryPluginEvents = ShowGalleryEvent | HideGalleryEvent;
