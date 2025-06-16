import { CssSize } from '@photo-sphere-viewer/core';
import type { Layer, Map } from 'leaflet';

/**
  * Definition of GPS coordinates (longitude, latitude, optional altitude)
  */
export type GpsPosition = [number, number, number?];

export type PlanHotspotStyle = {
    /**
     * Size of the hotspot
     * @default 15
     */
    size?: number;
    /**
     * SVG or image URL used for hotspot
     */
    image?: string;
    /**
     * Color of the hotspot when no image is provided
     * @default 'white'
     */
    color?: string;
    /**
     * Size of the border
     * @default 0
     */
    borderSize?: number;
    /**
     * Color of the border
     * @default null
     */
    borderColor?: string;
    /**
     * Size on mouse hover
     * @default null
     */
    hoverSize?: number;
    /**
     * SVG or image URL on mouse hover
     * @default null
     */
    hoverImage?: string;
    /**
     * Color on mouse hover
     * @default null
     */
    hoverColor?: string;
    /**
     * Size of the border on mouse hover
     * @default 4
     */
    hoverBorderSize?: number;
    /**
     * Color of the border on mouse hover
     * @default 'rgba(255, 255, 255, 0.8)'
     */
    hoverBorderColor?: string;
};

export type PlanHotspot = PlanHotspotStyle & {
    /**
     * GPS coordinates of the marker
     */
    coordinates: GpsPosition;

    /**
     * Unique identifier for the {@link SelectHotspot} event
     */
    id?: string;

    /**
     * Tooltip visible on the map
     */
    tooltip?: string | { content: string; className?: string };
};

export type PlanLayer = {
    urlTemplate?: string;
    layer?: Layer;
    name?: string;
    attribution?: string;
};

export type PlanPluginConfig = {
    /**
     * GPS position of the current panorama
     */
    coordinates?: GpsPosition;

    /**
     * Rotation offset to apply to the central pin
     * @default 0
     */
    bearing?: string | number;

    /**
     * Size of the map
     * @default '300px * 200px'
     */
    size?: CssSize;

    /**
     * Position of the map
     * @default 'bottom left'
     */
    position?: string | [string, string];

    /**
     * Displays the map when loading the first panorama
     * @default true
     */
    visibleOnLoad?: boolean;

    /**
     * SVG or image URL used for the central pin (must be square)
     */
    pinImage?: string;

    /**
     * Size of the central pin
     * @default 35
     */
    pinSize?: number;

    /**
     * Default style of hotspots
     */
    spotStyle?: PlanHotspotStyle;

    /**
     * Default zoom level
     * @default 15
     */
    defaultZoom?: number;

    /**
     * Define the available layers
     * @default OpenStreetMap
     */
    layers?: PlanLayer[];

    /**
     * Let you configure Leaflet from scratch
     */
    configureLeaflet?: (map: Map) => void;

    /**
     * Points of interest on the map
     */
    hotspots?: PlanHotspot[];

    /**
     * Always minimize the map when an hotspot/marker is clicked
     */
    minimizeOnHotspotClick?: boolean;

    /**
     * Configuration of map buttons
     */
    buttons?: {
        /** @default true */
        maximize?: boolean;
        /** @default true */
        close?: boolean;
        /** @default true */
        reset?: boolean;
    };
};

export type ParsedPlanPluginConfig = Omit<PlanPluginConfig, 'position' | 'bearing'> & {
    position: [string, string];
    bearing: number;
};

export type UpdatablePlanPluginConfig = Omit<
    PlanPluginConfig,
    | 'visibleOnLoad'
    | 'defaultZoom'
    | 'layers'
    | 'configureLeaflet'
    | 'buttons'
>;
