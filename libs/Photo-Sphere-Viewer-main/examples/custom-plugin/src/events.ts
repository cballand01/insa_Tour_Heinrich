import { TypedEvent } from '@photo-sphere-viewer/core';
import type { CustomPlugin } from './CustomPlugin';

/**
 * @event Triggered when something happens
 */
export class CustomPluginEvent extends TypedEvent<CustomPlugin> {
    static override readonly type = 'custom-event';
    override type: 'custom-event';

    constructor(public readonly value: boolean) {
        super(CustomPluginEvent.type);
    }
}

export type CustomPluginEvents = CustomPluginEvent;
