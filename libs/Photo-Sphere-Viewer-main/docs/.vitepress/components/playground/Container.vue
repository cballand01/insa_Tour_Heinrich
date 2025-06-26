<template>
    <v-card variant="tonal" style="margin-bottom: 20px;">
        <v-card-title>{{ title }}</v-card-title>
        <v-card-text style="margin-bottom: -20px;">
            <slot></slot>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
defineProps<{
    title: string;
}>();
</script>
