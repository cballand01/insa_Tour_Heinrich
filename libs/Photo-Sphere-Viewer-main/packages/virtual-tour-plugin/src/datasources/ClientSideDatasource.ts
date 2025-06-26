import { PSVError, utils } from '@photo-sphere-viewer/core';
import { VirtualTourNode } from '../model';
import { AbstractDatasource } from './AbstractDataSource';

export class ClientSideDatasource extends AbstractDatasource {
    async loadNode(nodeId: string) {
        if (this.nodes[nodeId]) {
            return this.nodes[nodeId];
        } else {
            throw new PSVError(`Node ${nodeId} not found`);
        }
    }

    setNodes(rawNodes: VirtualTourNode[]) {
        if (!rawNodes?.length) {
            throw new PSVError('No nodes provided');
        }

        const nodes: Record<string, VirtualTourNode> = {};
        const linkedNodes: Record<string, boolean> = {};

        rawNodes.forEach((node) => {
            this.checkNode(node);

            if (nodes[node.id]) {
                throw new PSVError(`Duplicate node ${node.id}`);
            }

            nodes[node.id] = node;
        });

        rawNodes.forEach((node) => {
            this.__checkLinks(node, nodes);

            node.links.forEach((link) => {
                linkedNodes[link.nodeId] = true;
            });
        });

        rawNodes.forEach((node) => {
            if (!linkedNodes[node.id]) {
                utils.logWarn(`Node ${node.id} is never linked to`);
            }
        });

        this.nodes = nodes;
    }

    updateNode(rawNode: Partial<VirtualTourNode> & { id: VirtualTourNode['id'] }) {
        if (!rawNode.id) {
            throw new PSVError('No id given for node');
        }

        const node = this.nodes[rawNode.id];
        if (!node) {
            throw new PSVError(`Node ${rawNode.id} does not exist`);
        }

        Object.assign(node, rawNode);

        this.checkNode(node);

        this.__checkLinks(node, this.nodes);

        return node;
    }

    private __checkLinks(node: VirtualTourNode, nodes: Record<string, VirtualTourNode>) {
        node.links.forEach((link) => {
            if (!nodes[link.nodeId]) {
                throw new PSVError(`Target node ${link.nodeId} of node ${node.id} does not exists`);
            }

            link.gps = link.gps || nodes[link.nodeId].gps;

            this.checkLink(node, link);
        });
    }
}
