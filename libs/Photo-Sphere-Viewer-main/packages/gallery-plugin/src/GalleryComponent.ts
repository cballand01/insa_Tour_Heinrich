import type { Viewer } from '@photo-sphere-viewer/core';
import { AbstractComponent, CONSTANTS, events, utils } from '@photo-sphere-viewer/core';
import { MathUtils } from 'three';
import { ACTIVE_CLASS, GALLERY_ITEM_DATA, GALLERY_ITEM_DATA_KEY, ITEMS_TEMPLATE } from './constants';
import { GalleryButton } from './GalleryButton';
import type { GalleryPlugin } from './GalleryPlugin';
import arrowIcon from './icons/arrow.svg';
import blankIcon from './icons/blank.svg';
import { GalleryItem } from './model';
import { clickRepeater } from './utils';

export class GalleryComponent extends AbstractComponent {
    protected override readonly state = {
        visible: true,
        mousedown: false,
        initMouse: null as number,
        mouse: null as number,
        itemMargin: null as number,
        breakpoint: null as number,
        scrollLeft: 0,
        scrollTop: 0,
        isAboveBreakpoint: null as boolean,
    };

    private readonly observer: IntersectionObserver;
    private readonly items: HTMLElement;
    private readonly arrowLeft?: HTMLElement;
    private readonly arrowRight?: HTMLElement;

    get isAboveBreakpoint() {
        return this.items.offsetWidth > this.state.breakpoint;
    }

    get config() {
        return this.plugin.config;
    }

    constructor(
        private readonly plugin: GalleryPlugin,
        viewer: Viewer,
    ) {
        super(viewer, {
            className: `psv-gallery ${CONSTANTS.CAPTURE_EVENTS_CLASS}`,
        });

        this.container.innerHTML = blankIcon;
        this.container.querySelector('svg').style.display = 'none';

        const closeBtn = document.createElement('div');
        closeBtn.className = 'psv-panel-close-button';
        closeBtn.innerHTML = CONSTANTS.ICONS.close;
        this.container.appendChild(closeBtn);

        closeBtn.addEventListener('click', () => this.plugin.hide());

        this.items = document.createElement('div');
        this.items.className = 'psv-gallery-container';
        this.container.appendChild(this.items);

        if (this.config.navigationArrows) {
            this.arrowLeft = document.createElement('div');
            this.arrowLeft.className = 'psv-gallery-arrow';
            this.arrowLeft.innerHTML = arrowIcon;
            this.container.appendChild(this.arrowLeft);

            this.arrowRight = document.createElement('div');
            this.arrowRight.className = 'psv-gallery-arrow';
            this.arrowRight.innerHTML = arrowIcon;
            this.container.appendChild(this.arrowRight);

            clickRepeater(this.arrowLeft, () => this.__scroll(-1));
            clickRepeater(this.arrowRight, () => this.__scroll(1));
        }

        this.state.itemMargin = parseInt(utils.getStyleProperty(this.items, 'padding-left'), 10);
        this.state.breakpoint = parseInt(utils.getStyleProperty(this.container, '--psv-gallery-breakpoint'), 10);

        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.intersectionRatio > 0) {
                        const element = entry.target as HTMLElement;
                        element.style.backgroundImage = `url("${element.dataset.src}")`;
                        delete element.dataset.src;
                        this.observer.unobserve(entry.target);
                    }
                });
            },
            {
                root: this.viewer.container,
            },
        );

        this.viewer.addEventListener(events.SizeUpdatedEvent.type, this);
        this.container.addEventListener('transitionend', this);
        this.container.addEventListener('keydown', this);
        this.items.addEventListener('wheel', this);
        this.items.addEventListener('scroll', this);
        this.items.addEventListener('mousedown', this);
        this.items.addEventListener('mousemove', this);
        this.items.addEventListener('click', this);
        window.addEventListener('mouseup', this);

        this.hide();
    }

    override destroy() {
        window.removeEventListener('mouseup', this);

        this.viewer.removeEventListener(events.SizeUpdatedEvent.type, this);

        this.observer.disconnect();

        super.destroy();
    }

    /**
     * @internal
     */
    handleEvent(e: Event) {
        switch (e.type) {
            case 'transitionend':
                if (this.isVisible() && e.target === this.container) {
                    this.__focusActiveOrFirst();
                }
                break;

            case 'keydown':
                if (this.isVisible()) {
                    switch ((e as KeyboardEvent).key) {
                        case CONSTANTS.KEY_CODES.Escape:
                            this.plugin.hide();
                            break;
                        case CONSTANTS.KEY_CODES.Enter:
                            this.__click(e);
                            break;
                    }
                }
                break;

            case 'wheel': {
                const evt = e as WheelEvent;
                this.__scroll(evt.deltaY > 0 ? 1 : -1);
                e.preventDefault();
                break;
            }

            case 'scroll':
            case events.SizeUpdatedEvent.type:
                this.__updateArrows();
                break;

            case 'mousedown':
                this.state.mousedown = true;
                if (this.isAboveBreakpoint) {
                    this.state.initMouse = (e as MouseEvent).clientX;
                } else {
                    this.state.initMouse = (e as MouseEvent).clientY;
                }
                this.state.mouse = this.state.initMouse;
                break;

            case 'mousemove':
                if (this.state.mousedown) {
                    if (this.isAboveBreakpoint) {
                        const delta = this.state.mouse - (e as MouseEvent).clientX;
                        this.items.scrollLeft += delta;
                        this.state.scrollLeft = this.items.scrollLeft;
                        this.state.mouse = (e as MouseEvent).clientX;
                    } else {
                        const delta = this.state.mouse - (e as MouseEvent).clientY;
                        this.items.scrollTop += delta;
                        this.state.scrollTop = this.items.scrollTop;
                        this.state.mouse = (e as MouseEvent).clientY;
                    }
                }
                break;

            case 'mouseup':
                this.state.mousedown = false;
                this.state.mouse = null;
                e.preventDefault();
                break;

            case 'click': {
                // prevent click on drag
                const currentMouse = this.isAboveBreakpoint ? (e as MouseEvent).clientX : (e as MouseEvent).clientY;
                if (Math.abs(this.state.initMouse - currentMouse) < 10) {
                    this.__click(e);
                }
                break;
            }
        }
    }

    override show() {
        this.container.classList.add('psv-gallery--open');
        this.state.visible = true;
    }

    override hide() {
        this.container.classList.remove('psv-gallery--open');
        this.state.visible = false;

        if (utils.hasParent(document.activeElement as HTMLElement, this.container)) {
            this.viewer.navbar.focusButton(GalleryButton.id);
        }
    }

    setItems(items: GalleryItem[]) {
        this.items.innerHTML = ITEMS_TEMPLATE(items, this.plugin.config.thumbnailSize);

        if (this.observer) {
            this.observer.disconnect();

            this.items.querySelectorAll('[data-src]').forEach((child) => {
                this.observer.observe(child);
            });
        }

        this.__updateArrows();
    }

    setActive(id: GalleryItem['id']) {
        const currentActive = this.items.querySelector('.' + ACTIVE_CLASS);
        currentActive?.classList.remove(ACTIVE_CLASS);

        if (id) {
            const nextActive = this.items.querySelector(`[data-${GALLERY_ITEM_DATA_KEY}="${id}"]`) as HTMLElement;
            if (nextActive) {
                nextActive.classList.add(ACTIVE_CLASS);
                this.items.scrollLeft = nextActive.offsetLeft + nextActive.clientWidth / 2 - this.items.clientWidth / 2;
            }
        }
    }

    /**
     * Handle clicks on items
     */
    private __click(e: Event) {
        const item = utils.getMatchingTarget(e, `.psv-gallery-item`);
        if (!item) {
            return;
        }

        const id = item.dataset[GALLERY_ITEM_DATA];

        this.plugin.applyItem(id);

        this.setActive(id);

        if (this.config.hideOnClick || !this.isAboveBreakpoint) {
            this.hide();
        }
    }

    private __focusActiveOrFirst() {
        const el = this.items.querySelector<HTMLElement>('.' + ACTIVE_CLASS) ?? this.items.firstElementChild as HTMLElement;
        el?.focus();
    }

    /**
     * Applies scroll
     */
    private __scroll(direction: 1 | -1) {
        if (this.isAboveBreakpoint) {
            const maxScroll = this.items.scrollWidth - this.items.offsetWidth;
            const scrollAmount = this.plugin.config.thumbnailSize.width + (this.state.itemMargin ?? 0);

            this.state.scrollLeft = MathUtils.clamp(this.state.scrollLeft + direction * scrollAmount, 0, maxScroll);
            if (direction === -1 && this.state.scrollLeft < scrollAmount * 0.8) {
                this.state.scrollLeft = 0;
            }
            if (direction === 1 && this.state.scrollLeft > maxScroll - scrollAmount * 0.8) {
                this.state.scrollLeft = maxScroll;
            }

            this.items.scroll({
                left: this.state.scrollLeft,
                behavior: 'smooth',
            });
        } else {
            const maxScroll = this.items.scrollHeight - this.items.offsetHeight;
            const scrollAmount = this.items.querySelector<HTMLElement>(':first-child').offsetHeight * 2 + (this.state.itemMargin ?? 0);

            this.state.scrollTop = MathUtils.clamp(this.state.scrollTop + direction * scrollAmount, 0, maxScroll);
            if (direction === -1 && this.state.scrollTop < scrollAmount * 0.8) {
                this.state.scrollTop = 0;
            }
            if (direction === 1 && this.state.scrollTop > maxScroll - scrollAmount * 0.8) {
                this.state.scrollTop = maxScroll;
            }

            this.items.scroll({
                top: this.state.scrollTop,
                behavior: 'smooth',
            });
        }
    }

    /**
     * Updates the arrows visibility and indicator size
     */
    private __updateArrows() {
        if (!this.config.navigationArrows) {
            return;
        }

        // switch between vertical and horizontal
        if (this.state.isAboveBreakpoint !== this.isAboveBreakpoint) {
            utils.toggleClass(this.arrowLeft, 'psv-gallery-arrow--left', this.isAboveBreakpoint);
            utils.toggleClass(this.arrowLeft, 'psv-gallery-arrow--top', !this.isAboveBreakpoint);
            utils.toggleClass(this.arrowRight, 'psv-gallery-arrow--right', this.isAboveBreakpoint);
            utils.toggleClass(this.arrowRight, 'psv-gallery-arrow--bottom', !this.isAboveBreakpoint);

            this.state.isAboveBreakpoint = this.isAboveBreakpoint;
        }

        const toggle = (el: HTMLElement, show: boolean) => {
            if (show) {
                el.style.opacity = '1';
                el.style.pointerEvents = 'auto';
            } else {
                el.style.opacity = '0';
                el.style.pointerEvents = 'none';
            }
        };

        if (this.isAboveBreakpoint) {
            const maxScroll = this.items.scrollWidth - this.items.offsetWidth;

            toggle(this.arrowLeft, this.items.scrollLeft > 50);
            toggle(this.arrowRight, this.items.scrollLeft < maxScroll - 50);
        } else {
            const maxScroll = this.items.scrollHeight - this.items.offsetHeight;

            toggle(this.arrowLeft, this.items.scrollTop > 50);
            toggle(this.arrowRight, this.items.scrollTop < maxScroll - 50);
        }
    }
}
