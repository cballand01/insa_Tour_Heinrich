<template>
    <v-card>
        <v-tabs v-model="currentTab" bg-color="primary">
            <v-tab v-for="tab in tabs" :value="tab">{{ tab }}</v-tab>
        </v-tabs>

        <v-card-text>
            <v-tabs-window v-model="currentTab">
                <slot></slot>
            </v-tabs-window>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { provide, reactive, ref, watch } from 'vue';

const currentTab = ref<string | null>(null);

const tabs = reactive<string[]>([]);

watch(tabs, () => {
    if (!currentTab.value) {
        currentTab.value = tabs[0];
    }
});

provide('tabs', tabs);
</script>
