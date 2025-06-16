import type { App } from '@vue/runtime-core';
import Tab from './Tab.vue';
import Tabs from './Tabs.vue';

export default function enhanceApp(app: App) {
    app.component('Tabs', Tabs);
    app.component('Tab', Tab);
}
