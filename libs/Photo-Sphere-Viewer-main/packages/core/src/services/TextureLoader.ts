import { PSVError } from '../PSVError';
import type { Viewer } from '../Viewer';
import { Cache } from '../data/cache';
import { LoadProgressEvent } from '../events';
import { BlobLoader } from '../lib/BlobLoader';
import { ImageLoader } from '../lib/ImageLoader';
import { AbstractService } from './AbstractService';

/**
 * Image and texture loading system
 */
export class TextureLoader extends AbstractService {
    private readonly fileLoader: BlobLoader;
    private readonly imageLoader: ImageLoader;

    private abortCtrl: Record<string, AbortController> = {};

    /**
     * @internal
     */
    constructor(viewer: Viewer) {
        super(viewer);

        this.fileLoader = new BlobLoader();
        this.imageLoader = new ImageLoader();

        if (this.config.withCredentials) {
            this.fileLoader.setWithCredentials(true);
            this.imageLoader.setCrossOrigin('use-credentials');
        }
    }

    /**
     * @internal
     */
    override destroy() {
        this.abortLoading();
        super.destroy();
    }

    /**
     * Cancels current HTTP requests
     * @internal
     */
    abortLoading() {
        Object.values(this.abortCtrl).forEach(ctrl => ctrl.abort());
        this.abortCtrl = {};
    }

    /**
     * Loads a Blob with FileLoader
     */
    loadFile(url: string, onProgress?: (p: number) => void, cacheKey?: string): Promise<Blob> {
        const cached = Cache.get(url, cacheKey);

        if (cached) {
            if (cached instanceof Blob) {
                onProgress?.(100);
                return Promise.resolve(cached);
            } else {
                // unlikely case when the image has already been loaded with the ImageLoader
                Cache.remove(url, cacheKey);
            }
        }

        if (this.config.requestHeaders) {
            this.fileLoader.setRequestHeader(this.config.requestHeaders(url));
        }

        return new Promise((resolve, reject) => {
            let progress = 0;
            onProgress?.(progress);

            this.fileLoader.load(
                url,
                (result) => {
                    progress = 100;
                    onProgress?.(progress);
                    Cache.add(url, cacheKey, result);
                    resolve(result);
                },
                (e) => {
                    if (e.lengthComputable) {
                        const newProgress = (e.loaded / e.total) * 100;
                        if (newProgress > progress) {
                            progress = newProgress;
                            onProgress?.(progress);
                        }
                    }
                },
                (err) => {
                    reject(err);
                },
                this.__getAbortSignal(cacheKey),
            );
        });
    }

    /**
     * Loads an image with ImageLoader or with FileLoader if progress is tracked or if request headers are configured
     */
    loadImage(url: string, onProgress?: (p: number) => void, cacheKey?: string): Promise<HTMLImageElement> {
        const cached = Cache.get(url, cacheKey);

        if (cached) {
            onProgress?.(100);
            if (cached instanceof Blob) {
                // unlikely case when the image has already been loaded with the FileLoader
                return this.blobToImage(cached);
            } else {
                return Promise.resolve(cached);
            }
        }

        if (!onProgress && !this.config.requestHeaders) {
            return new Promise((resolve, reject) => {
                this.imageLoader.load(
                    url,
                    (result) => {
                        Cache.add(url, cacheKey, result);
                        resolve(result);
                    },
                    (err) => {
                        reject(err);
                    },
                    this.__getAbortSignal(cacheKey),
                );
            });
        } else {
            return this.loadFile(url, onProgress, cacheKey).then(blob => this.blobToImage(blob));
        }
    }

    /**
     * Converts a file loaded with {@link loadFile} into an image
     */
    blobToImage(blob: Blob): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = document.createElement('img');
            img.onload = () => {
                URL.revokeObjectURL(img.src);
                resolve(img);
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(blob);
        });
    }

    /**
     * Preload a panorama file without displaying it
     */
    preloadPanorama(panorama: any): Promise<unknown> {
        if (this.viewer.adapter.supportsPreload(panorama)) {
            return this.viewer.adapter.loadTexture(panorama, false);
        } else {
            return Promise.reject(new PSVError('Current adapter does not support preload'));
        }
    }

    /**
     * @internal
     */
    dispatchProgress(progress: number) {
        this.viewer.loader.setProgress(progress);
        this.viewer.dispatchEvent(new LoadProgressEvent(Math.round(progress)));
    }

    /**
     * Get an abort signal
     * the signal is shared accross all requests with the same cache key (for tiles adapters)
     */
    private __getAbortSignal(cacheKey: string): AbortSignal {
        if (cacheKey) {
            if (this.abortCtrl[cacheKey]?.signal.aborted) {
                delete this.abortCtrl[cacheKey];
            }
            if (!this.abortCtrl[cacheKey]) {
                this.abortCtrl[cacheKey] = new AbortController();
            }
            return this.abortCtrl[cacheKey].signal;
        }
        return null;
    }
}
