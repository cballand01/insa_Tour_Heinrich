import type { App } from '@vue/runtime-core';
import Dialog from './Dialog.vue';

export default function enhanceApp(app: App) {
    app.component('Dialog', Dialog);
}
