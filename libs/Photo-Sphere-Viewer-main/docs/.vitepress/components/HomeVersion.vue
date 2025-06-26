<template>
    <a class="version" href="/guide/changelog.html" v-if="version">{{ version }}</a>
</template>

<script setup lang="ts">
import { usePsvDocData } from '../theme/data';

const version = usePsvDocData().latestVersion;
</script>

<style lang="scss" scoped>
    .version {
        position: absolute;
        top: 0;
        right: 0;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        height: 30px;
        line-height: 30px;
        padding: 0 15px;
        border-radius: 15px;
        font-weight: 600;
        color: white;
        background-image: linear-gradient(120deg, #8BC34A, #03A9F4);
        background-repeat: repeat;
        background-size: 200%;
        transition: all 0.3s ease-in-out;

        &:hover {
            background-position-x: 100%;
            filter: drop-shadow(0px 0px 5px rgba(255, 255, 255, 0.42));
        }
    }
</style>