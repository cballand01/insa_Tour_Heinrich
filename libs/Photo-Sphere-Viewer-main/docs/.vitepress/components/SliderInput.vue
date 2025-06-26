<template>
    <v-field :label="label" variant="plain" active :disabled="disabled">
        <v-slider v-if="!range" v-model="model" :min="min" :max="max" :step="step" :ticks="ticks" />
        <v-range-slider v-if="range" v-model="model" :min="min" :max="max" :step="step" :ticks="ticks" />
    </v-field>
</template>

<script setup lang="ts">
defineProps<{
    label: string;
    range?: boolean;
    min?: number;
    max?: number;
    step?: number;
    ticks?: number[];
    disabled?: boolean;
}>();

const model = defineModel();
</script>

<style lang="scss" scoped>
.v-field {
    margin-top: 20px;
}
</style>
