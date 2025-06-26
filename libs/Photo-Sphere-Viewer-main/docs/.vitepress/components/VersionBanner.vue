<template>
    <v-snackbar v-model="open" timeout="-1" max-width="none">
        <span style="padding-right: 2em">
            🎉 A new version has been released since you last visited this page: <strong>{{ latestVersion }}</strong>
        </span>

        <template v-slot:actions>
            <v-btn size="small" variant="elevated" color="primary" @click="changelog()">Changelog</v-btn>
            <v-btn size="small" variant="text" icon="mdi-close-circle" aria-label="Close" @click="close()"></v-btn>
        </template>
    </v-snackbar>
</template>

<script setup lang="ts">
import { useRouter } from 'vitepress';
import { ref, watch } from 'vue';
import { usePsvDocData } from '../theme/data';

const router = useRouter();
const latestVersion = usePsvDocData().latestVersion;
const open = ref(false);

onVersion(latestVersion.value);
watch(latestVersion, onVersion);

function onVersion(version: string) {
    if (version) {
        if (!localStorage.version) {
            localStorage.version = version;
        } else if (version !== localStorage.version) {
            delete localStorage.releasesCache;
            delete localStorage.announcementsCache;
            open.value = true;
        }
    }
}

function changelog() {
    close();
    router.go('/guide/changelog');
}

function close() {
    localStorage.version = latestVersion.value;
    open.value = false;
}
</script>
