import { DivIcon, LatLngLiteral } from 'leaflet';
import { GpsPosition, PlanHotspotStyle } from './model';

export function gpsToLeaflet(gps: GpsPosition): LatLngLiteral {
    return { lng: gps[0], lat: gps[1], alt: gps[2] };
}

export function createLeafletIcon(src: string, size: number, className: string): DivIcon {
    return new DivIcon({
        html: src && !src.includes('<svg') ? `<img src="${src}" style="width: 100%; height: 100%">` : src,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        className,
    });
}

export function getStyle(defaultStyle: PlanHotspotStyle, style: PlanHotspotStyle, isHover: boolean) {
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
            : style.borderColor ?? defaultStyle.borderColor ?? 'transparent',
        borderSize: isHover
            ? style.hoverBorderSize ?? defaultStyle.hoverBorderSize
            : style.borderSize ?? defaultStyle.borderSize,
    };
}
