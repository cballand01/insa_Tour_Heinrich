import { TypedEvent } from '@photo-sphere-viewer/core';
import type { SettingsPlugin } from './SettingsPlugin';

/**
 * @event Triggered when a setting's value changes
 */
export class SettingChangedEvent extends TypedEvent<SettingsPlugin> {
    static override readonly type = 'setting-changed';
    override type: 'setting-changed';

    /** @internal */
    constructor(
        public readonly settingId: string,
        public readonly settingValue: boolean | string,
    ) {
        super(SettingChangedEvent.type);
    }
}

export type SettingsPluginEvents = SettingChangedEvent;
