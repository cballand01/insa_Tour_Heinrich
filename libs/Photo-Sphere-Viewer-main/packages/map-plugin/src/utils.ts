import { Point, SYSTEM } from '@photo-sphere-viewer/core';
import { MapHotspotStyle } from './model';

export function loadImage(src: string): HTMLImageElement {
    const image = document.createElement('img');

    if (!src.includes('<svg')) {
        image.src = src;
    } else {
        // the SVG must have it's own size, use the viewBox if not defined
        if (!/<svg[^>]*width="/.test(src) && src.includes('viewBox')) {
            const [, , , width, height] = /viewBox="([0-9-]+) ([0-9-]+) ([0-9]+) ([0-9]+)"/.exec(src);
            src = src.replace('<svg', `<svg width="${width}px" height="${height}px"`);
        }

        const src64 = `data:image/svg+xml;base64,${window.btoa(src)}`;
        image.src = src64;
    }

    return image;
}

export function getImageHtml(src: string): string {
    if (!src) {
        return '';
    } else if (!src.includes('<svg')) {
        return `<img src="${src}">`;
    } else {
        return src;
    }
}

export function getStyle(defaultStyle: MapHotspotStyle, style: MapHotspotStyle, isHover: boolean) {
    return {
        image: isHover
            ? style.hoverImage ?? style.image ?? defaultStyle.hoverImage ?? defaultStyle.image
            : style.image ?? defaultStyle.image,
        size: isHover
            ? style.hoverSize ?? style.size ?? defaultStyle.hoverSize ?? defaultStyle.size
            : style.size ?? defaultStyle.size,
        color: isHover
            ? style.hoverColor ?? style.color ?? defaultStyle.hoverColor ?? defaultStyle.color
            : style.color ?? defaultStyle.color,
        borderColor: isHover
            ? style.hoverBorderColor ?? style.borderColor ?? defaultStyle.hoverBorderColor ?? defaultStyle.borderColor
            : style.borderColor ?? defaultStyle.borderColor,
        borderSize: isHover
            ? style.hoverBorderSize ?? style.borderSize ?? defaultStyle.hoverBorderSize ?? defaultStyle.borderSize
            : style.borderSize ?? defaultStyle.borderSize,
    };
}

export function unprojectPoint(pt: Point, yaw: number, zoom: number): Point {
    return {
        x: (Math.cos(yaw) * pt.x - Math.sin(yaw) * pt.y) / zoom,
        y: (Math.sin(yaw) * pt.x + Math.cos(yaw) * pt.y) / zoom,
    };
}

export function projectPoint(pt: Point, yaw: number, zoom: number): Point {
    return {
        x: (Math.cos(-yaw) * pt.x - Math.sin(-yaw) * pt.y) * zoom,
        y: (Math.sin(-yaw) * pt.x + Math.cos(-yaw) * pt.y) * zoom,
    };
}

export type ImageSource = HTMLImageElement | HTMLCanvasElement;

/**
 * Setup the canvas drop shadow
 */
export function canvasShadow(
    context: CanvasRenderingContext2D,
    offsetX: number,
    offsetY: number,
    blur: number,
    color = 'black',
) {
    context.shadowOffsetX = offsetX * SYSTEM.pixelRatio;
    context.shadowOffsetY = offsetY * SYSTEM.pixelRatio;
    context.shadowBlur = blur * SYSTEM.pixelRatio;
    context.shadowColor = color;
}

/**
 * Draw an image centered
 */
export function drawImageCentered(context: CanvasRenderingContext2D, image: ImageSource, size: number) {
    const w = image.width;
    const h = image.height;

    drawImageHighDpi(
        context,
        image,
        -size / 2,
        -((h / w) * size) / 2,
        size,
        (h / w) * size,
    );
}

/**
 * Standard "drawImage" using devicePixelRatio
 */
export function drawImageHighDpi(
    context: CanvasRenderingContext2D,
    image: ImageSource,
    x: number,
    y: number,
    w: number,
    h: number,
) {
    context.drawImage(
        image,
        0, 0,
        image.width, image.height,
        x * SYSTEM.pixelRatio, y * SYSTEM.pixelRatio,
        w * SYSTEM.pixelRatio, h * SYSTEM.pixelRatio,
    );
}

/**
 * Adds the "a" to your "rgb"
 */
export function rgbToRgba(rgb: string, alpha: number): string {
    return `rgba(${rgb.slice(4, -1)},${alpha})`;
}
