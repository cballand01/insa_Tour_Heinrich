import { TypedEvent } from '@photo-sphere-viewer/core';
import type { ResolutionPlugin } from './ResolutionPlugin';

/**
 * @event Triggered when the resolution is changed
 */
export class ResolutionChangedEvent extends TypedEvent<ResolutionPlugin> {
    static override readonly type = 'resolution-changed';
    override type: 'resolution-changed';

    /** @internal */
    constructor(public readonly resolutionId: string) {
        super(ResolutionChangedEvent.type);
    }
}

export type ResolutionPluginEvents = ResolutionChangedEvent;
