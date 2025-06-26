import { Position, TypedEvent } from '@photo-sphere-viewer/core';
import { VirtualTourLink, VirtualTourNode } from './model';
import type { VirtualTourPlugin } from './VirtualTourPlugin';

/**
 * @event Triggered when the current node changes
 */
export class NodeChangedEvent extends TypedEvent<VirtualTourPlugin> {
    static override readonly type = 'node-changed';
    override type: 'node-changed';

    /** @internal */
    constructor(
        public readonly node: VirtualTourNode,
        public readonly data: {
            fromNode: VirtualTourNode;
            fromLink: VirtualTourLink;
            fromLinkPosition: Position;
        },
    ) {
        super(NodeChangedEvent.type);
    }
}

/**
 * @event Triggered when the user puts the cursor hover a marker
 */
export class EnterArrowEvent extends TypedEvent<VirtualTourPlugin> {
    static override readonly type = 'enter-arrow';
    override type: 'enter-arrow';

    /** @internal */
    constructor(
        public readonly link: VirtualTourLink,
        public readonly node: VirtualTourNode,
    ) {
        super(EnterArrowEvent.type);
    }
}

/**
 * @event Triggered when the user puts the cursor away from an arrow
 */
export class LeaveArrowEvent extends TypedEvent<VirtualTourPlugin> {
    static override readonly type = 'leave-arrow';
    override type: 'leave-arrow';

    /** @internal */
    constructor(
        public readonly link: VirtualTourLink,
        public readonly node: VirtualTourNode,
    ) {
        super(LeaveArrowEvent.type);
    }
}

export type VirtualTourEvents =
    | NodeChangedEvent
    | EnterArrowEvent
    | LeaveArrowEvent;
