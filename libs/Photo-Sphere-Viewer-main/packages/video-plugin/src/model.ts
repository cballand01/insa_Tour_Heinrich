import { ExtendedPosition } from '@photo-sphere-viewer/core';

export type VideoKeypoint = {
    position: ExtendedPosition;
    time: number;
};

export type VideoPluginConfig = {
    /**
     * displays a progressbar on top of the navbar
     * @default true
     */
    progressbar?: boolean;
    /**
     * displays a big "play" button in the center of the viewer
     * @default true
     */
    bigbutton?: boolean;
    /**
     * defines autorotate timed keypoints
     */
    keypoints?: VideoKeypoint[];
};
