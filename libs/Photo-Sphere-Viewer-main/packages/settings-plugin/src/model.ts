/**
 * Description of a setting
 */
export type BaseSetting = {
    /**
     * identifier of the setting
     */
    id: string;
    /**
     * label of the setting
     * If can be a key in the global `lang` config
     */
    label: string;
    /**
     * type of the setting
     */
    type: 'options' | 'toggle';
    /**
     * function which returns the value of the button badge
     */
    badge?(): string;
};

/**
 * Description of a 'options' setting
 */
export type OptionsSetting = BaseSetting & {
    type: 'options';
    /**
     * function which returns the current option id
     */
    current(): string;
    /**
     * function which the possible options
     */
    options(): SettingOption[];
    /**
     * function called with the id of the selected option
     */
    apply(optionId: string): void;
};

/**
 * Description of a 'toggle' setting
 */
export type ToggleSetting = BaseSetting & {
    type: 'toggle';
    /**
     * function which return whereas the setting is active or not
     */
    active(): boolean;
    /**
     * function called when the setting is toggled
     */
    toggle(): void;
};

/**
 * Option for an 'options' setting
 */
export type SettingOption = {
    /**
     * identifier of the option
     */
    id: string;
    /**
     * label of the option
     * If can be a key in the global `lang` config
     */
    label: string;
};

export type Setting = ToggleSetting | OptionsSetting;

export type SettingsPluginConfig = {
    /**
     * should the settings be saved accross sessions
     * @default false
     */
    persist?: boolean;
    /**
     * custom storage handler, defaults to LocalStorage
     * @default LocalStorage
     */
    storage?: {
        set(settingId: string, value: boolean | string): void;
        /**
         * return `undefined` or `null` if the option does not exist
         */
        get(settingId: string): boolean | string | Promise<boolean> | Promise<string>;
    };
};
