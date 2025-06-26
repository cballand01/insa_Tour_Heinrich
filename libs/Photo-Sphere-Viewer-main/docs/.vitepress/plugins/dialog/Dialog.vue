<template>
    <v-dialog v-model="showDialog" width="auto" scrollable class="vp-doc">
        <v-card :title="title">
            <v-card-text>
                <slot></slot>
            </v-card-text>

            <v-card-actions>
                <v-btn @click="showDialog = false" variant="tonal">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-btn @click="showDialog = true" variant="tonal">{{ button }}</v-btn>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
    title: string;
    button: string;
}>();

const showDialog = ref(false);
</script>
