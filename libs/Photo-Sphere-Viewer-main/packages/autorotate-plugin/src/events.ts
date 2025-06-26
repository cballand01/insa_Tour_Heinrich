import { TypedEvent } from '@photo-sphere-viewer/core';
import type { AutorotatePlugin } from './AutorotatePlugin';

/**
 * @event Triggered when the automatic rotation is enabled/disabled
 */
export class AutorotateEvent extends TypedEvent<AutorotatePlugin> {
    static override readonly type = 'autorotate';
    override type: 'autorotate';

    /** @internal */
    constructor(public readonly autorotateEnabled: boolean) {
        super(AutorotateEvent.type);
    }
}

export type AutorotatePluginEvents = AutorotateEvent;
