<template>
    <v-theme-provider :theme="isDark ? 'dark' : 'light'">
        <slot></slot>
    </v-theme-provider>
</template>

<script setup lang="ts">
import { useData } from 'vitepress';

const { isDark } = useData();
</script>
