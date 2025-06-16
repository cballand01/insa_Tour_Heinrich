import type { PanoData, PanoDataProvider } from '@photo-sphere-viewer/core';

export type Resolution = {
    id: string;
    label: string;
    panorama: any;
    panoData?: PanoData | PanoDataProvider;
};

export type ResolutionPluginConfig = {
    /**
     * list of available resolutions
     */
    resolutions: Resolution[];
    /**
     * the default resolution if no panorama is configured on the viewer
     */
    defaultResolution?: string;
    /**
     * show the resolution id as a badge on the settings button
     * @default true
     */
    showBadge?: boolean;
};
