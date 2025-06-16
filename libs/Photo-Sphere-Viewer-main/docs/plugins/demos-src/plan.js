import { Viewer } from '@photo-sphere-viewer/core';
import { PlanPlugin } from '@photo-sphere-viewer/plan-plugin';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import { TileLayer } from 'leaflet';

const baseUrl = 'https://photo-sphere-viewer-data.netlify.app/assets/';

new Viewer({
    container: 'viewer',
    panorama: baseUrl + 'sphere.jpg',
    caption: 'Parc national du Mercantour <b>&copy; Damien Sorel</b>',
    loadingImg: baseUrl + 'loader.gif',
    touchmoveTwoFingers: true,
    mousewheelCtrlKey: true,

    plugins: [
        [PlanPlugin, {
            defaultZoom: 14,
            coordinates: [6.78677, 44.58241],
            bearing: '120deg',
            layers: [
                {
                    name: 'OpenStreetMap',
                    urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                    attribution: '&copy; OpenStreetMap',
                },
                {
                    name: 'OpenTopoMap',
                    layer: new TileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                        subdomains: ['a', 'b', 'c'],
                        maxZoom: 17,
                    }),
                    attribution: '&copy; OpenTopoMap',
                },
            ],
            hotspots: [
                {
                    coordinates: [6.7783, 44.58506],
                    id: 'green-lake',
                    tooltip: 'Lac vert',
                    color: 'green',
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
                        plan: {
                            coordinates: [6.79077, 44.58041],
                            size: 25,
                            image: baseUrl + 'pictos/pin-blue.png',
                        },
                    },
                },
            ],
        }],
    ],
});
