import type { Viewer } from '@photo-sphere-viewer/core';
import { AbstractConfigurablePlugin, events, PSVError, utils } from '@photo-sphere-viewer/core';
import type { MapPlugin } from '@photo-sphere-viewer/map-plugin';
import type { PlanPlugin } from '@photo-sphere-viewer/plan-plugin';
import { GalleryPluginEvents, HideGalleryEvent, ShowGalleryEvent } from './events';
import { GalleryButton } from './GalleryButton';
import { GalleryComponent } from './GalleryComponent';
import { GalleryItem, GalleryPluginConfig, UpdatableGalleryPluginConfig } from './model';

const getConfig = utils.getConfigParser<GalleryPluginConfig>({
    items: [],
    navigationArrows: true,
    visibleOnLoad: false,
    hideOnClick: true,
    thumbnailSize: {
        width: 200,
        height: 100,
    },
});

/**
 * Adds a gallery of multiple panoramas
 */
export class GalleryPlugin extends AbstractConfigurablePlugin<
    GalleryPluginConfig,
    GalleryPluginConfig,
    UpdatableGalleryPluginConfig,
    GalleryPluginEvents
> {
    static override readonly id = 'gallery';
    static override readonly VERSION = PKG_VERSION;
    static override readonly configParser = getConfig;
    static override readonly readonlyOptions: Array<keyof GalleryPluginConfig> = ['items', 'navigationArrows', 'visibleOnLoad'];

    private readonly gallery: GalleryComponent;

    private items: GalleryItem[] = [];
    private handler?: (id: GalleryItem['id']) => void;
    private currentId?: GalleryItem['id'];

    private map?: MapPlugin;
    private plan?: PlanPlugin;

    constructor(viewer: Viewer, config: GalleryPluginConfig) {
        super(viewer, config);

        this.gallery = new GalleryComponent(this, this.viewer);
    }

    /**
     * @internal
     */
    override init() {
        super.init();

        utils.checkStylesheet(this.viewer.container, 'gallery-plugin');

        this.map = this.viewer.getPlugin('map');
        this.plan = this.viewer.getPlugin('plan');

        this.viewer.addEventListener(events.PanoramaLoadedEvent.type, this);
        this.viewer.addEventListener(events.ShowPanelEvent.type, this);

        if (this.config.visibleOnLoad) {
            this.viewer.addEventListener(events.ReadyEvent.type, () => {
                if (this.items.length) {
                    this.show();
                }
            }, { once: true });
        }

        this.setItems(this.config.items);
        delete this.config.items;

        // buttons are initialized just after plugins
        setTimeout(() => this.__updateButton());
    }

    /**
     * @internal
     */
    override destroy() {
        this.viewer.removeEventListener(events.PanoramaLoadedEvent.type, this);
        this.viewer.removeEventListener(events.ShowPanelEvent.type, this);

        this.gallery.destroy();

        super.destroy();
    }

    override setOptions(options: Partial<UpdatableGalleryPluginConfig>) {
        super.setOptions(options);

        if (options.thumbnailSize) {
            this.gallery.setItems(this.items);
        }
    }

    /**
     * @internal
     */
    handleEvent(e: Event) {
        if (e instanceof events.PanoramaLoadedEvent) {
            const item = this.items.find(i => utils.deepEqual(i.panorama, e.data.panorama));
            this.currentId = item?.id;
            this.gallery.setActive(this.currentId);
        } else if (e instanceof events.ShowPanelEvent) {
            this.gallery.isVisible() && this.hide();
        }
    }

    /**
     * Shows the gallery
     */
    show() {
        this.map?.minimize();
        this.plan?.minimize();

        this.dispatchEvent(new ShowGalleryEvent(!this.gallery.isAboveBreakpoint));
        return this.gallery.show();
    }

    /**
     * Hides the carousem
     */
    hide() {
        this.dispatchEvent(new HideGalleryEvent());
        return this.gallery.hide();
    }

    /**
     * Hides or shows the gallery
     */
    toggle() {
        if (this.gallery.isVisible()) {
            this.hide();
        } else {
            this.show();
        }
    }

    isVisible() {
        return this.gallery.isVisible();
    }

    /**
     * Sets the list of items
     * @param items
     * @param [handler] function that will be called when an item is clicked instead of the default behavior
     * @throws {@link PSVError} if the configuration is invalid
     */
    setItems(items: GalleryItem[] | null, handler?: (id: GalleryItem['id']) => void) {
        if (!items) {
            items = [];
        } else {
            items.forEach((item, i) => {
                if (!item.id) {
                    throw new PSVError(`Item ${i} has no "id".`);
                }
                if (!item.panorama) {
                    throw new PSVError(`Item "${item.id}" has no "panorama".`);
                }
            });
        }

        this.handler = handler;
        this.items = items.map(item => ({
            ...item,
            id: `${item.id}`,
        }));

        this.gallery.setItems(this.items);

        if (this.currentId) {
            const item = this.items.find(i => i.id === this.currentId);
            this.currentId = item?.id;
            this.gallery.setActive(this.currentId);
        }

        if (!this.items.length) {
            this.gallery.hide();
        }

        this.__updateButton();
    }

    /**
     * @internal
     */
    applyItem(id: GalleryItem['id']) {
        if (id === this.currentId) {
            return;
        }

        if (this.handler) {
            this.handler(id);
        } else {
            const item = this.items.find(i => i.id === id);
            this.viewer.setPanorama(item.panorama, {
                caption: item.name,
                ...item.options,
            });
        }

        this.currentId = id;
    }

    private __updateButton() {
        this.viewer.navbar.getButton(GalleryButton.id, false)?.toggle(this.items.length > 0);
    }
}
