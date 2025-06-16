import type { Navbar } from '../components/Navbar';
import { ICONS, IDS } from '../data/constants';
import { HidePanelEvent, ShowPanelEvent } from '../events';
import { getClosest } from '../utils';
import { AbstractButton } from './AbstractButton';

const BUTTON_DATA = 'psvButton';

const MENU_TEMPLATE = (buttons: AbstractButton[], title: string) => `
<div class="psv-panel-menu psv-panel-menu--stripped">
  <h1 class="psv-panel-menu-title">${ICONS.menu} ${title}</h1>
  <ul class="psv-panel-menu-list">
    ${buttons
        .map(
            button => `
    <li data-psv-button="${button.id}" class="psv-panel-menu-item" tabindex="0">
      <span class="psv-panel-menu-item-icon">${button.content}</span>
      <span class="psv-panel-menu-item-label">${button.title}</span>
    </li>
    `,
        )
        .join('')}
  </ul>
</div>
`;

export class MenuButton extends AbstractButton {
    static override readonly id = 'menu';

    constructor(navbar: Navbar) {
        super(navbar, {
            className: 'psv-menu-button',
            hoverScale: true,
            collapsable: false,
            tabbable: true,
            icon: ICONS.menu,
        });

        this.viewer.addEventListener(ShowPanelEvent.type, this);
        this.viewer.addEventListener(HidePanelEvent.type, this);

        super.hide();
    }

    override destroy() {
        this.viewer.removeEventListener(ShowPanelEvent.type, this);
        this.viewer.removeEventListener(HidePanelEvent.type, this);

        super.destroy();
    }

    handleEvent(e: Event) {
        if (e instanceof ShowPanelEvent) {
            this.toggleActive(e.panelId === IDS.MENU);
        } else if (e instanceof HidePanelEvent) {
            this.toggleActive(false);
        }
    }

    onClick() {
        if (this.state.active) {
            this.__hideMenu();
        } else {
            this.__showMenu();
        }
    }

    override hide(refresh?: boolean) {
        super.hide(refresh);
        this.__hideMenu();
    }

    override show(refresh?: boolean) {
        super.show(refresh);

        if (this.state.active) {
            this.__showMenu();
        }
    }

    private __showMenu() {
        this.viewer.panel.show({
            id: IDS.MENU,
            content: MENU_TEMPLATE(this.viewer.navbar.collapsed, this.viewer.config.lang.menu),
            noMargin: true,
            clickHandler: (target) => {
                const li = target ? getClosest(target as HTMLElement, '.psv-panel-menu-item') : undefined;
                const buttonId = li ? li.dataset[BUTTON_DATA] : undefined;

                if (buttonId) {
                    this.viewer.navbar.getButton(buttonId).onClick();
                    this.__hideMenu();
                }
            },
        });
    }

    private __hideMenu() {
        this.viewer.panel.hide(IDS.MENU);
    }
}
