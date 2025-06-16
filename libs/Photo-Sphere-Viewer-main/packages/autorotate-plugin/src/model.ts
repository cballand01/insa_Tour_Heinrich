import { ExtendedPosition } from '@photo-sphere-viewer/core';

/**
 * Definition of keypoints for automatic rotation, can be a position object, a marker id or an configuration object
 */
export type AutorotateKeypoint =
    | ExtendedPosition
    | string
    | {
        position?: ExtendedPosition;
        /**
         * use the position and tooltip of a marker
         */
        markerId?: string;
        /**
         * pause the animation when reaching this point, will display the tooltip if available
         */
        pause?: number;
        /**
         * optional tooltip
         */
        tooltip?: string | { content: string; position?: string };
    };

export type AutorotatePluginConfig = {
    /**
     * Delay after which the automatic rotation will begin, in milliseconds
     * @default 2000
     */
    autostartDelay?: number;
    /**
     * Restarts the automatic rotation if the user is idle for `autostartDelay`.
     * @default true
     */
    autostartOnIdle?: boolean;
    /**
     * Speed of the automatic rotation. Can be a negative value to reverse the rotation.
     * @default '2rpm'
     */
    autorotateSpeed?: string | number;
    /**
     * Vertical angle at which the automatic rotation is performed.
     * @default viewer `defaultPitch`
     */
    autorotatePitch?: number | string;
    /**
     * Zoom level at which the automatic rotation is performed.
     * @default current zoom level
     */
    autorotateZoomLvl?: number;
    /**
     * List of positions to visit
     */
    keypoints?: AutorotateKeypoint[];
    /**
     * Start from the closest keypoint instead of the first keypoint
     * @default true
     */
    startFromClosest?: boolean;
};

export type UpdatableAutorotatePluginConfig = Omit<AutorotatePluginConfig, 'keypoints'>;
