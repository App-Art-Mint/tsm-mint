export interface RGBA {
    r: number
    g: number
    b: number
    a?: number
}

const hexBase: number = 16

export function getLuminance (color: string) : number {
    const hexMatch = color.match(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/);
    if (hexMatch) {
        let hex = hexMatch[1];
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        const r = parseInt(hex.substring(0, 2), hexBase);
        const g = parseInt(hex.substring(2, 4), hexBase);
        const b = parseInt(hex.substring(4, 6), hexBase);
        return getLuminanceRGBA({ r, g, b });
    }

    const rgbMatch = color.match(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)?(?:,\s*(\d(?:\.\d*)?)\s*\))?/);
    if (rgbMatch) {
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);
        const a = rgbMatch[4] ? parseFloat(rgbMatch[4]) : undefined;
        return getLuminanceRGBA({ r, g, b, a });
    }

    throw new Error(`Invalid color: ${color}`);
}

export function getLuminanceRGBA ({r, g, b, a}: RGBA) : number {
    if (a === 0) {
        return 262;
    }
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
        return Math.round((r * 299 + g * 587 + b * 144) / 1000);
    }
    return -1;
}

