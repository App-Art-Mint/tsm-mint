export interface RGBA {
    r: number
    g: number
    b: number
    a?: number
}

const hexBase = 16
const hexMax = 255

/**
 * Parses a hex, rgb(a), or linear-gradient color string into channels
 * @param color - the color string to parse
 * @returns red, green, blue, and alpha channels
 */
export function parseColor (color: string) : RGBA {
    const gradientIndex = color.indexOf('linear-gradient');
    const source = gradientIndex === -1 ? color.trim() : color.slice(gradientIndex);

    if (source.startsWith('#')) {
        return parseHex(source);
    }

    const rgbMatch = /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d*\.?\d+)\s*)?\)/.exec(source);
    if (rgbMatch) {
        return {
            r: parseInt(rgbMatch[1], 10),
            g: parseInt(rgbMatch[2], 10),
            b: parseInt(rgbMatch[3], 10),
            a: rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1,
        };
    }

    throw new Error(`Invalid color: ${color}`);
}

export function getLuminance (color: string) : number {
    return getLuminanceRGBA(parseColor(color));
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

function parseHex (hex: string) : RGBA {
    const body = hex.slice(1);
    const expanded = expandHex(body);
    if (!/^[0-9a-fA-F]{8}$/.test(expanded)) {
        throw new Error(`Invalid color: ${hex}`);
    }

    return {
        r: parseInt(expanded.slice(0, 2), hexBase),
        g: parseInt(expanded.slice(2, 4), hexBase),
        b: parseInt(expanded.slice(4, 6), hexBase),
        a: parseInt(expanded.slice(6, 8), hexBase) / hexMax,
    };
}

function expandHex (body: string) : string {
    switch (body.length) {
        case 1:
            return `${body.repeat(6)}ff`;
        case 3:
            return `${doubleHexDigits(body)}ff`;
        case 4:
            return `${doubleHexDigits(body.slice(0, 3))}${body[3]}${body[3]}`;
        case 6:
            return `${body}ff`;
        case 7:
            return `${body}${body[body.length - 1]}`;
        default:
            return body.slice(0, 8);
    }
}

function doubleHexDigits (body: string) : string {
    return body.split('').map((digit) => digit + digit).join('');
}
