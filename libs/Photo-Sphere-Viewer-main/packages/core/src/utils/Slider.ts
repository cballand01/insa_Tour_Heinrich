import { MathUtils } from 'three';

/**
 * Direction of a {@link Slider}
 */
export enum SliderDirection {
    VERTICAL = 'VERTICAL',
    HORIZONTAL = 'HORIZONTAL',
}

/**
 * Data transmitted to the {@link Slider} listener
 */
export type SliderUpdateData = {
    /**
     * slider progression for 0-1
     */
    readonly value: number;

    /**
     * the user clicked on the slider
     */
    readonly click: boolean;

    /**
     * the user moves the cursor above the slider, without click
     */
    readonly mouseover: boolean;

    /**
     * the user moves the cursor above the slider while maintaining click
     */
    readonly mousedown: boolean;

    /**
     * the cursor position on the page
     */
    readonly cursor: { clientX: number; clientY: number };
};

/**
 * Helper to make sliders elements
 */
export class Slider {
    private mousedown = false;
    private mouseover = false;

    get isVertical() {
        return this.direction === SliderDirection.VERTICAL;
    }

    get isHorizontal() {
        return this.direction === SliderDirection.HORIZONTAL;
    }

    constructor(
        /** main container of the sliding element */
        private readonly container: HTMLElement,
        /** direction of the slider */
        private readonly direction: SliderDirection,
        /** callback when the user interacts with the slider */
        private readonly listener: (data: SliderUpdateData) => void,
    ) {
        this.container.addEventListener('click', this);
        this.container.addEventListener('mousedown', this);
        this.container.addEventListener('mouseenter', this);
        this.container.addEventListener('mouseleave', this);
        this.container.addEventListener('touchstart', this);
        this.container.addEventListener('mousemove', this, true);
        this.container.addEventListener('touchmove', this, true);
        window.addEventListener('mouseup', this);
        window.addEventListener('touchend', this);
    }

    destroy() {
        window.removeEventListener('mouseup', this);
        window.removeEventListener('touchend', this);
    }

    /**
     * @internal
     */
    handleEvent(e: Event) {
        switch (e.type) {
            case 'click': e.stopPropagation(); break;
            case 'mousedown': this.__onMouseDown(e as MouseEvent); break;
            case 'mouseenter': this.__onMouseEnter(e as MouseEvent); break;
            case 'mouseleave': this.__onMouseLeave(e as MouseEvent); break;
            case 'touchstart': this.__onTouchStart(e as TouchEvent); break;
            case 'mousemove': this.__onMouseMove(e as MouseEvent); break;
            case 'touchmove': this.__onTouchMove(e as TouchEvent); break;
            case 'mouseup': this.__onMouseUp(e as MouseEvent); break;
            case 'touchend': this.__onTouchEnd(e as TouchEvent); break;
        }
    }

    private __onMouseDown(evt: MouseEvent) {
        this.mousedown = true;
        this.__update(evt.clientX, evt.clientY, true);
    }

    private __onMouseEnter(evt: MouseEvent) {
        this.mouseover = true;
        this.__update(evt.clientX, evt.clientY, true);
    }

    private __onTouchStart(evt: TouchEvent) {
        this.mouseover = true;
        this.mousedown = true;
        const touch = evt.changedTouches[0];
        this.__update(touch.clientX, touch.clientY, true);
    }

    private __onMouseMove(evt: MouseEvent) {
        if (this.mousedown || this.mouseover) {
            evt.stopPropagation();
            this.__update(evt.clientX, evt.clientY, true);
        }
    }

    private __onTouchMove(evt: TouchEvent) {
        if (this.mousedown || this.mouseover) {
            evt.stopPropagation();
            const touch = evt.changedTouches[0];
            this.__update(touch.clientX, touch.clientY, true);
        }
    }

    private __onMouseUp(evt: MouseEvent) {
        if (this.mousedown) {
            this.mousedown = false;
            this.__update(evt.clientX, evt.clientY, false);
        }
    }

    private __onMouseLeave(evt: MouseEvent) {
        if (this.mouseover) {
            this.mouseover = false;
            this.__update(evt.clientX, evt.clientY, true);
        }
    }

    private __onTouchEnd(evt: TouchEvent) {
        if (this.mousedown) {
            this.mouseover = false;
            this.mousedown = false;
            const touch = evt.changedTouches[0];
            this.__update(touch.clientX, touch.clientY, false);
        }
    }

    private __update(clientX: number, clientY: number, moving: boolean) {
        const boundingClientRect = this.container.getBoundingClientRect();

        let val: number;
        if (this.isVertical) {
            val = MathUtils.clamp((boundingClientRect.bottom - clientY) / boundingClientRect.height, 0, 1);
        } else {
            val = MathUtils.clamp((clientX - boundingClientRect.left) / boundingClientRect.width, 0, 1);
        }

        this.listener({
            value: val,
            click: !moving,
            mousedown: this.mousedown,
            mouseover: this.mouseover,
            cursor: { clientX, clientY },
        });
    }
}
