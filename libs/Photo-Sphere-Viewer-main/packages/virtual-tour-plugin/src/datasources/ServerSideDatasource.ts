import type { Viewer } from '@photo-sphere-viewer/core';
import { PSVError } from '@photo-sphere-viewer/core';
import { VirtualTourPluginConfig } from '../model';
import type { VirtualTourPlugin } from '../VirtualTourPlugin';
import { AbstractDatasource } from './AbstractDataSource';

export class ServerSideDatasource extends AbstractDatasource {
    private readonly nodeResolver: VirtualTourPluginConfig['getNode'];

    constructor(plugin: VirtualTourPlugin, viewer: Viewer) {
        super(plugin, viewer);

        if (!plugin.config.getNode) {
            throw new PSVError('Missing getNode() option.');
        }

        this.nodeResolver = plugin.config.getNode;
    }

    async loadNode(nodeId: string) {
        if (this.nodes[nodeId]) {
            return this.nodes[nodeId];
        } else {
            const node = await this.nodeResolver(nodeId);

            this.checkNode(node);

            node.links.forEach((link) => {
                this.checkLink(node, link);
            });

            this.nodes[nodeId] = node;

            return node;
        }
    }

    clearCache(): void {
        this.nodes = {};
    }
}
