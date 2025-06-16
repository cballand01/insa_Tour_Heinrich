import { AbstractButton, ButtonConstructor } from '../buttons/AbstractButton';
import { CustomButton } from '../buttons/CustomButton';
import { DescriptionButton } from '../buttons/DescriptionButton';
import { DownloadButton } from '../buttons/DownloadButton';
import { FullscreenButton } from '../buttons/FullscreenButton';
import { MenuButton } from '../buttons/MenuButton';
import { MoveDownButton } from '../buttons/MoveDownButton';
import { MoveLeftButton } from '../buttons/MoveLeftButton';
import { MoveRightButton } from '../buttons/MoveRightButton';
import { MoveUpButton } from '../buttons/MoveUpButton';
import { ZoomInButton } from '../buttons/ZoomInButton';
import { ZoomOutButton } from '../buttons/ZoomOutButton';
import { ZoomRangeButton } from '../buttons/ZoomRangeButton';
import { DEFAULTS } from '../data/config';
import { CAPTURE_EVENTS_CLASS } from '../data/constants';
import { ParsedViewerConfig } from '../model';
import { PSVError } from '../PSVError';
import { logWarn } from '../utils';
import type { Viewer } from '../Viewer';
import { AbstractComponent } from './AbstractComponent';
import { NavbarCaption } from './NavbarCaption';

/**
 * List of available buttons
 */
const AVAILABLE_BUTTONS: Record<string, ButtonConstructor> = {};

/**
 * List of available buttons
 */
const AVAILABLE_GROUPS: Record<string, ButtonConstructor[]> = {};

/**
 * Register a new button available for all viewers
 * @param button
 * @param [defaultPosition]  If provided the default configuration of the navbar will be modified.
 * Possible values are :
 *    - `start`
 *    - `end`
 *    - `[id]:left`
 *    - `[id]:right`
 * @throws {@link PSVError} if the button constructor has no "id"
 */
export function registerButton(button: ButtonConstructor, defaultPosition?: string) {
    if (!button.id) {
        throw new PSVError('Button id is required');
    }

    AVAILABLE_BUTTONS[button.id] = button;

    if (button.groupId) {
        (AVAILABLE_GROUPS[button.groupId] = AVAILABLE_GROUPS[button.groupId] || []).push(button);
    }

    if (defaultPosition) {
        const navbar = DEFAULTS.navbar as string[];
        switch (defaultPosition) {
            case 'start':
                navbar.unshift(button.id);
                break;
            case 'end':
                navbar.push(button.id);
                break;
            default: {
                const [id, pos] = defaultPosition.split(':');
                const idx = navbar.indexOf(id);
                if (!id || !pos || idx === -1) {
                    throw new PSVError(`Invalid defaultPosition ${defaultPosition}`);
                }
                navbar.splice(idx + (pos === 'right' ? 1 : 0), 0, button.id);
            }
        }
    }
}

[
    ZoomOutButton,
    ZoomRangeButton,
    ZoomInButton,
    DescriptionButton,
    NavbarCaption,
    DownloadButton,
    FullscreenButton,
    MoveLeftButton,
    MoveRightButton,
    MoveUpButton,
    MoveDownButton,
].forEach(btn => registerButton(btn));

/**
 * Navigation bar component
 */
export class Navbar extends AbstractComponent {
    /**
     * @internal
     */
    collapsed: AbstractButton[] = [];

    /**
     * @internal
     */
    constructor(viewer: Viewer) {
        super(viewer, {
            className: `psv-navbar ${CAPTURE_EVENTS_CLASS}`,
        });

        this.state.visible = false;
    }

    /**
     * Shows the navbar
     */
    override show() {
        this.viewer.container.classList.add('psv--has-navbar');
        this.container.classList.add('psv-navbar--open');
        this.state.visible = true;
    }

    /**
     * Hides the navbar
     */
    override hide() {
        this.viewer.container.classList.remove('psv--has-navbar');
        this.container.classList.remove('psv-navbar--open');
        this.state.visible = false;
    }

    /**
     * Change the buttons visible on the navbar
     */
    setButtons(buttons: ParsedViewerConfig['navbar']) {
        this.children.slice().forEach(item => item.destroy());
        this.children.length = 0;

        // force description button if caption is present (used on narrow screens)
        if (buttons.indexOf(NavbarCaption.id) !== -1 && buttons.indexOf(DescriptionButton.id) === -1) {
            buttons.splice(buttons.indexOf(NavbarCaption.id), 0, DescriptionButton.id);
        }

        buttons.forEach((button) => {
            if (typeof button === 'object') {
                new CustomButton(this, button);
            } else if (AVAILABLE_BUTTONS[button]) {
                // @ts-ignore
                new AVAILABLE_BUTTONS[button](this);
            } else if (AVAILABLE_GROUPS[button]) {
                AVAILABLE_GROUPS[button].forEach((buttonCtor) => {
                    // @ts-ignore
                    new buttonCtor(this);
                });
            } else {
                logWarn(`Unknown button ${button}`);
            }
        });

        new MenuButton(this);

        this.children.forEach((item) => {
            if (item instanceof AbstractButton) {
                item.checkSupported();
            }
        });

        this.autoSize();
    }

    /**
     * Changes the navbar caption
     */
    setCaption(html: string | null) {
        this.children.some((item) => {
            if (item instanceof NavbarCaption) {
                item.setCaption(html);
                return true;
            } else {
                return false;
            }
        });
    }

    /**
     * Returns a button by its identifier
     */
    getButton(id: string, warnNotFound = true): AbstractButton {
        const button = this.children.find((item) => {
            return item instanceof AbstractButton && item.id === id;
        });

        if (!button && warnNotFound) {
            logWarn(`button "${id}" not found in the navbar`);
        }

        return button as AbstractButton;
    }

    /**
     * Try to focus a button, will focus the first button if the requested button does not exist.
     */
    focusButton(id: string) {
        if (this.isVisible()) {
            (this.getButton(id, false)?.container || this.container.firstElementChild as HTMLElement)?.focus();
        }
    }

    /**
     * Automatically collapses buttons
     * @internal
     */
    autoSize() {
        this.children.forEach((child) => {
            if (child instanceof AbstractButton) {
                child.autoSize();
            }
        });

        const availableWidth = this.container.offsetWidth;

        let totalWidth = 0;
        const collapsableButtons: AbstractButton[] = [];

        this.children.forEach((item) => {
            if (item.isVisible() && item instanceof AbstractButton) {
                totalWidth += item.width;
                if (item.collapsable) {
                    collapsableButtons.push(item);
                }
            }
        });

        if (totalWidth === 0) {
            return;
        }

        if (availableWidth < totalWidth && collapsableButtons.length > 0) {
            collapsableButtons.forEach(item => item.collapse());
            this.collapsed = collapsableButtons;

            this.getButton(MenuButton.id).show(false);
        } else if (availableWidth >= totalWidth && this.collapsed.length > 0) {
            this.collapsed.forEach(item => item.uncollapse());
            this.collapsed = [];

            this.getButton(MenuButton.id).hide(false);
        }

        this.getButton(NavbarCaption.id, false)?.autoSize();
    }
}
