<template>
    <v-btn @click="open" style="float: right;" color="primary">
        <v-icon icon="mdi-information" start/> API Documentation
    </v-btn>
</template>

<script setup lang="ts">
const { page } = defineProps<{
    page: string;
}>();

function open() {
    window.open(`/api/${page}`, '_blank');
}
</script>
