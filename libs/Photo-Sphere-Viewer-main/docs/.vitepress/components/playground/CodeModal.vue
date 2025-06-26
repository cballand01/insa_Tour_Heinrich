<template>
    <v-dialog v-model="showDialog" width="auto" scrollable class="vp-doc">
        <v-card title="Code">
            <v-card-text>
                <pre>{{ code }}</pre>
            </v-card-text>

            <v-card-actions>
                <v-btn @click="showDialog = false" variant="tonal">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { ViewerConfig } from '../../../../packages/core';
import { Config } from './TabConfiguration.vue';
import { PanoConfig } from './TabPanorama.vue';

let PSV_DEFAULTS: ViewerConfig;

const showDialog = ref(false);
const code = ref('');

function open(config: PanoConfig & Config) {
    const displayedConfig: ViewerConfig = {
        container: 'viewer',
        panorama: 'your-panorama.jpg',
    };

    [
        'caption',
        'description',
        'panoData',
        'sphereCorrection',
        'navbar',
        'defaultYaw',
        'defaultPitch',
        'defaultZoomLvl',
        'minFov',
        'maxFov',
        'mousewheel',
        'mousemove',
        'keyboard',
        'fisheye',
        'mousewheelCtrlKey',
        'touchmoveTwoFingers',
        'moveSpeed',
        'zoomSpeed',
        'moveInertia',
    ].forEach((key) => {
        switch (key) {
            case 'fisheye':
                if (config.fisheye) {
                    displayedConfig.fisheye = true;
                }
                break;

            case 'keyboard':
                if (!config.keyboard) {
                    displayedConfig.keyboard = false;
                }
                break;

            case 'caption':
            case 'description':
                if (config[key]) {
                    displayedConfig[key] = config[key];
                }
                break;

            case 'sphereCorrection': {
                const getSphereCorrection = () => {
                    return displayedConfig.sphereCorrection = displayedConfig.sphereCorrection || {};
                };
                if (config.sphereCorrection.pan !== '0deg') {
                    getSphereCorrection().pan = config.sphereCorrection.pan;
                }
                if (config.sphereCorrection.tilt !== '0deg') {
                    getSphereCorrection().tilt = config.sphereCorrection.tilt;
                }
                if (config.sphereCorrection.roll !== '0deg') {
                    getSphereCorrection().roll = config.sphereCorrection.roll;
                }
                break;
            }

            case 'navbar':
                if (config.navbar.length !== 5) {
                    displayedConfig.navbar = config.navbar;
                }
                break;

            default:
                if (config[key] !== PSV_DEFAULTS[key]) {
                    displayedConfig[key] = config[key];
                }
                break;
        }
    })

    code.value = `new Viewer(${JSON.stringify(displayedConfig, null, 2)});`;
    showDialog.value = true;
}

defineExpose({ open });

onMounted(async () => {
    const { DEFAULTS } = await import('@photo-sphere-viewer/core');
    PSV_DEFAULTS = DEFAULTS;
});
</script>
