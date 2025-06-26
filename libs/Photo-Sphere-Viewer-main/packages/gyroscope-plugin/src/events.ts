import { TypedEvent } from '@photo-sphere-viewer/core';
import type { GyroscopePlugin } from './GyroscopePlugin';

/**
 * @event Triggered when the gyroscope control is enabled/disabled
 */
export class GyroscopeUpdatedEvent extends TypedEvent<GyroscopePlugin> {
    static override readonly type = 'gyroscope-updated';
    override type: 'gyroscope-updated';

    /** @internal */
    constructor(public readonly gyroscopeEnabled: boolean) {
        super(GyroscopeUpdatedEvent.type);
    }
}

export type GyroscopePluginEvents = GyroscopeUpdatedEvent;
