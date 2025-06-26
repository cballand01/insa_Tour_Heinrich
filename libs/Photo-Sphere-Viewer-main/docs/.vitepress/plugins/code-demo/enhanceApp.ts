import type { App } from '@vue/runtime-core';
import CodeDemo from './CodeDemo.vue';

export default function enhanceApp(app: App) {
    app.component('CodeDemo', CodeDemo);
}
