import type { App } from '@vue/runtime-core';
import Gallery from './Gallery.vue';
import GalleryItem from './GalleryItem.vue';

export default function enhanceApp(app: App) {
    app.component('Gallery', Gallery);
    app.component('GalleryItem', GalleryItem);
}
