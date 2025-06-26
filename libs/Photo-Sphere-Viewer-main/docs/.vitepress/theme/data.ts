import { inject, Ref } from 'vue';

export type PsvDocData = {
    latestVersion: Ref<string>;
};

export const DataSymbol = Symbol();

export function usePsvDocData(): PsvDocData {
    const router = inject(DataSymbol);
    if (!router) {
        throw new Error('usePsvDocData() is called without provider.');
    }
    return router as PsvDocData;
}
