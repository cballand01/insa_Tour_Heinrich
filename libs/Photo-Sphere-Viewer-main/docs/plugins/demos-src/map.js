import { Viewer } from '@photo-sphere-viewer/core';
import { MapPlugin } from '@photo-sphere-viewer/map-plugin';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';

const baseUrl = 'https://photo-sphere-viewer-data.netlify.app/assets/';

new Viewer({
    container: 'viewer',
    panorama: baseUrl + 'sphere.jpg',
    caption: 'Parc national du Mercantour <b>&copy; Damien Sorel</b>',
    loadingImg: baseUrl + 'loader.gif',
    touchmoveTwoFingers: true,
    mousewheelCtrlKey: true,

    plugins: [
        [MapPlugin, {
            imageUrl: baseUrl + 'map.jpg',
            center: { x: 807, y: 607 },
            rotation: '135deg',
            defaultZoom: 40,
            hotspots: [
                {
                    x: 450,
                    y: 450,
                    id: 'green-lake',
                    color: 'green',
                    tooltip: 'Lac vert',
                },
                {
                    yaw: '-45deg',
                    distance: 80, // pixels
                },
            ],
        }],
        [MarkersPlugin, {
            markers: [
                {
                    id: 'mountain',
                    tooltip: 'A mountain',
                    position: { yaw: 0.11, pitch: 0.32 },
                    image: baseUrl + 'pictos/pin-blue.png',
                    size: { width: 32, height: 32 },
                    anchor: 'bottom center',
                    data: {
                        map: {
                            distance: 220,
                            size: 25,
                            image: baseUrl + 'pictos/pin-blue.png',
                        },
                    },
                },
            ],
        }],
    ],
});
