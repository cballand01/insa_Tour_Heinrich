<template>
    <v-tabs-window-item :value="title">
        <slot></slot>
    </v-tabs-window-item>
</template>

<script setup lang="ts">
import { onMounted, reactive, inject } from 'vue';

const { title } = defineProps<{
    title: string;
}>();

const tabs = inject('tabs') as ReturnType<typeof reactive<string[]>>;

onMounted(() => {
    tabs.push(title);
});
</script>
