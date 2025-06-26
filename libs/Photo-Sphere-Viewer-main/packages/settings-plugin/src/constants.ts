import { utils, ViewerConfig } from '@photo-sphere-viewer/core';
import check from './icons/check.svg';
import chevron from './icons/chevron.svg';
import switchOff from './icons/switch-off.svg';
import switchOn from './icons/switch-on.svg';
import { OptionsSetting, Setting, ToggleSetting } from './model';

export const LOCAL_STORAGE_KEY = 'psvSettings';
export const ID_PANEL = 'settings';
export const SETTING_DATA = 'settingId';
export const OPTION_DATA = 'optionId';
export const ID_BACK = '__back';
export const ID_ENTER = '__enter';
export const SETTING_DATA_KEY = utils.dasherize(SETTING_DATA);
export const OPTION_DATA_KEY = utils.dasherize(OPTION_DATA);

/**
 * Setting item template, by type
 */
export const SETTINGS_TEMPLATE_: Record<Setting['type'], any> = {
    options: (setting: OptionsSetting, lang: ViewerConfig['lang']) => {
        const current = setting.current();
        const option = setting.options().find(opt => opt.id === current);
        return `
<span class="psv-settings-item-label">${lang[setting.label] ?? setting.label}</span>
<span class="psv-settings-item-value">${option?.label ?? current}</span>
<span class="psv-settings-item-icon">${chevron}</span>
`;
    },
    toggle: (setting: ToggleSetting, lang: ViewerConfig['lang']) => `
<span class="psv-settings-item-label">${lang[setting.label] ?? setting.label}</span>
<span class="psv-settings-item-value">${setting.active() ? switchOn : switchOff}</span>
`,
};

/**
 * Settings list template
 */
export const SETTINGS_TEMPLATE = (settings: Setting[], lang: ViewerConfig['lang']) => `
<ul class="psv-settings-list">
${settings.map(setting => `
    <li class="psv-settings-item" tabindex="0"
        data-${SETTING_DATA_KEY}="${setting.id}" data-${OPTION_DATA_KEY}="${ID_ENTER}">
        ${SETTINGS_TEMPLATE_[setting.type](setting, lang)}
    </li>
`).join('')}
</ul>
`;

/**
 * Settings options template
 */
export const SETTING_OPTIONS_TEMPLATE = (setting: OptionsSetting, lang: ViewerConfig['lang']) => {
    const current = setting.current();

    return `
<ul class="psv-settings-list">
    <li class="psv-settings-item psv-settings-item--header" tabindex="0"
        data-${SETTING_DATA_KEY}="${setting.id}" data-${OPTION_DATA_KEY}="${ID_BACK}">
        <span class="psv-settings-item-icon">${chevron}</span>
        <span class="psv-settings-item-label">${lang[setting.label] ?? setting.label}</span>
    </li>
${setting.options().map(option => `
    <li class="psv-settings-item" tabindex="0"
        data-${SETTING_DATA_KEY}="${setting.id}" data-${OPTION_DATA_KEY}="${option.id}">
        <span class="psv-settings-item-icon">${option.id === current ? check : ''}</span>
        <span class="psv-settings-item-value">${lang[option.label] ?? option.label}</span>
    </li>
`).join('')}
</ul>
`;
};
