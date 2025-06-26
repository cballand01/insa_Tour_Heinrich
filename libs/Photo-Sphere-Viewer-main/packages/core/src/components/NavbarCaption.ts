import { AbstractButton } from '../buttons/AbstractButton';
import { DescriptionButton } from '../buttons/DescriptionButton';
import type { Navbar } from './Navbar';

export class NavbarCaption extends AbstractButton {
    static override readonly id = 'caption';

    private contentWidth = 0;

    private readonly contentElt: HTMLElement;

    constructor(navbar: Navbar) {
        super(navbar, {
            className: 'psv-caption',
            hoverScale: false,
            collapsable: false,
            tabbable: true,
        });

        this.state.width = 0;

        this.contentElt = document.createElement('div');
        this.contentElt.className = 'psv-caption-content';
        this.container.appendChild(this.contentElt);

        this.setCaption(this.viewer.config.caption);
    }

    override hide() {
        this.contentElt.style.display = 'none';
        this.state.visible = false;
    }

    override show() {
        this.contentElt.style.display = '';
        this.state.visible = true;
    }

    onClick(): void {
        // nothing
    }

    /**
     * Changes the caption
     */
    setCaption(html: string | null) {
        this.show();
        this.contentElt.innerHTML = html ?? '';

        if (this.contentElt.innerHTML) {
            this.contentWidth = this.contentElt.offsetWidth;
        } else {
            this.contentWidth = 0;
        }

        this.autoSize();
    }

    /**
     * Toggles content and icon depending on available space
     */
    override autoSize() {
        this.toggle(this.container.offsetWidth >= this.contentWidth);
        this.__refreshButton();
    }

    private __refreshButton() {
        (this.viewer.navbar.getButton(DescriptionButton.id, false) as DescriptionButton)?.autoSize(true);
    }
}
