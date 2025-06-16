<template>
    <v-file-input label="Panorama image" v-model="file" accept="image/*">
        <template #append>
            <v-btn variant="tonal" @click="loadDefaultFile">Use demo file</v-btn>
        </template>
    </v-file-input>

    <div v-if="error" class="custom-block danger">
        <p class="custom-block-title">This image cannot be loaded</p>
        <p>
            An undefined error occurred while loading the panorama. If your image is very big and you are using
            Firefox please try with Chrome, as Firefox has trouble loading large base64 images.
        </p>
    </div>

    <v-text-field label="Caption" v-model="config.caption" clearable :disabled="loading" />

    <v-textarea label="Description" v-model="config.description" clearable :rows="2" :disabled="loading" />

    <Container title="Pano data">
        <v-btn-toggle v-model="panoDataMode" :disabled="loading" style="margin-bottom: 20px;">
            <v-btn value="xmp">Use embedded XMP data</v-btn>
            <v-btn value="manual">Provide manual data</v-btn>
        </v-btn-toggle>

        <v-row class="no-v-gutters" v-if="panoDataMode === 'manual'">
            <v-col cols="4">
                <v-number-input label="Full width" v-model="config.panoData.fullWidth" :min="0" :disabled="loading" />
            </v-col>
            <v-col cols="4">
                <v-number-input label="Cropped width" v-model="config.panoData.croppedWidth" :min="0" :disabled="loading" />
            </v-col>
            <v-col cols="4">
                <v-number-input label="Cropped X" v-model="config.panoData.croppedX" :min="0" :disabled="loading" />
            </v-col>
            <v-col cols="4">
                <v-number-input label="Full height" v-model="config.panoData.fullHeight" :min="0" :disabled="loading" />
            </v-col>
            <v-col cols="4">
                <v-number-input label="Cropped height" v-model="config.panoData.croppedHeight" :min="0" :disabled="loading" />
            </v-col>
            <v-col cols="4">
                <v-number-input label="Cropped Y" v-model="config.panoData.croppedY" :min="0" :disabled="loading" />
            </v-col>
        </v-row>
    </Container>

    <Container title="Sphere correction">
        <v-row class="no-v-gutters">
            <v-col cols="4">
                <SliderInput label="Pan" v-model="config.sphereCorrection.pan" :min="-180" :max="180" :step="1"
                    :ticks="[-180, -90, 0, 90, 180]" :disabled="loading" />
            </v-col>
            <v-col cols="4">
                <SliderInput label="Tilt" v-model="config.sphereCorrection.tilt" :min="-90" :max="90" :step="1"
                    :ticks="[-90, -45, 0, 45, 90]" :disabled="loading" />
            </v-col>
            <v-col cols="4">
                <SliderInput label="Roll" v-model="config.sphereCorrection.roll" :min="-180" :max="180" :step="1"
                    :ticks="[-180, -90, 0, 90, 180]" :disabled="loading" />
            </v-col>
        </v-row>
    </Container>
</template>

<script setup lang="ts">
import { watchDebounced, watchIgnorable } from '@vueuse/core';
import { cloneDeep } from 'lodash-es';
import { onMounted, reactive, ref, watch } from 'vue';
import type { PanoData, SphereCorrection } from '../../../../packages/core';
import { SPHERE } from '../constants';
import SliderInput from '../SliderInput.vue';
import Container from './Container.vue';

export type PanoConfig = {
    caption: string;
    description: string;
    panoData: PanoData;
    sphereCorrection: SphereCorrection;
};

const { loading } = defineProps<{ loading: boolean }>();

const file = ref<File | null>(null);
const error = ref(false);

const config = reactive<PanoConfig>({
    caption: '',
    description: '',
    panoData: {
        fullWidth: 0,
        fullHeight: 0,
        croppedWidth: 0,
        croppedHeight: 0,
        croppedX: 0,
        croppedY: 0,
    },
    sphereCorrection: {
        pan: 0,
        tilt: 0,
        roll: 0,
    },
});
const panoDataMode = ref<'xmp' | 'manual'>('xmp');

let imageData: string | null;

const emit = defineEmits<{
    updateConfig: [config: PanoConfig],
    updateFile: [imageData: string | null],
}>();

const { ignoreUpdates: updateFileIgnore } = watchIgnorable(file, loadFile);

watch(() => config.panoData.fullWidth, (fullWidth) => {
    config.panoData.fullHeight = Math.round(fullWidth / 2);
});
watch(() => config.panoData.fullHeight, (fullHeight) => {
    config.panoData.fullWidth = Math.round(fullHeight * 2);
});

watchDebounced(
    [config, panoDataMode],
    emitConfig,
    { debounce: 300, maxWait: 9999, deep: true }
);

onMounted(() => {
    emitConfig();
});

function loadFile() {
    error.value = false;

    if (imageData === SPHERE) {
        config.caption = '';
    } else if (imageData) {
        URL.revokeObjectURL(imageData);
    }

    imageData = null;

    if (file.value) {
        const reader = new FileReader();

        reader.onload = (event) => {
            imageData = event.target!.result as string;

            const image = new Image();

            image.onload = () => {
                computePanoData(image.width, image.height);
                emitConfig();
                emit('updateFile', imageData);
            };

            image.onerror = () => {
                URL.revokeObjectURL(imageData!);
                imageData = null;
                error.value = true;
                computePanoData(0, 0);
                emit('updateFile', null);
            };

            image.src = imageData;
        };

        reader.readAsDataURL(file.value);
    } else {
        emit('updateFile', null);
    }
}

function loadDefaultFile() {
    error.value = false;
    updateFileIgnore(() => file.value = null);

    if (imageData && imageData !== SPHERE) {
        URL.revokeObjectURL(imageData);
    }

    imageData = SPHERE;
    config.caption = 'Parc national du Mercantour <b>&copy; Damien Sorel</b>';
    computePanoData(6000, 3000);

    emit('updateFile', imageData);
}

function computePanoData(width: number, height: number) {
    const fullWidth = Math.max(width, height * 2);
    const fullHeight = Math.round(fullWidth / 2);
    const croppedX = Math.round((fullWidth - width) / 2);
    const croppedY = Math.round((fullHeight - height) / 2);

    config.panoData.fullWidth = fullWidth;
    config.panoData.fullHeight = fullHeight;
    config.panoData.croppedWidth = width;
    config.panoData.croppedHeight = height;
    config.panoData.croppedX = croppedX;
    config.panoData.croppedY = croppedY;
    config.sphereCorrection.pan = 0;
    config.sphereCorrection.tilt = 0;
    config.sphereCorrection.roll = 0;
    panoDataMode.value = 'xmp';
}

function emitConfig() {
    const temp = cloneDeep(config) as PanoConfig;
    temp.sphereCorrection.pan = temp.sphereCorrection.pan + 'deg';
    temp.sphereCorrection.tilt = temp.sphereCorrection.tilt + 'deg';
    temp.sphereCorrection.roll = temp.sphereCorrection.roll + 'deg';
    if (panoDataMode.value === 'xmp') {
        // @ts-ignore
        temp.panoData = null;
    }
    emit('updateConfig', temp);
}
</script>
