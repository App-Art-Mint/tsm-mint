/**
 * The library name that will be added as a prefix
 */
export const lib = 'mint' as const;

/**
 * The prefix built from the library name
 */
export const pre = `${lib}-` as const;

/**
 * CSS-selector for disabled elements
 */
export const disabled = '[disabled]' as const;

/**
 * CSS-selector for elements with an aria-controls attribute
 */
export const hasControls = '[aria-controls]' as const;

/**
 * CSS-selector for elements with an aria-expanded attribute
 */
export const hasExpanded = '[aria-expanded]' as const;

/**
 * CSS-selector for elements with an href attribute
 */
export const hasLink = '[href]' as const;

/**
 * CSS-selector for elements with a routerLink attribute
 * @summary - the routerLink attribute is used in Angular
 */
export const hasRouterLink = '[routerLink]' as const;

/**
 * CSS-selector for elements with an id attribute
 */
export const hasId = '[id]' as const;

/**
 * CSS-selector for submenu buttons
 */
export const subMenuButtons = `button${hasControls}` as const;

/**
 * CSS-selector for submenus
 */
export const subMenu = `${subMenuButtons} + ul${hasId}` as const;

/**
 * CSS-selector for elements that aren't tabbable (i.e. tabindex is negative)
 */
export const notTabbable = '[tabindex^="-"]' as const;

/**
 * CSS-selector for elements that are tabbable (i.e. tabindex isn't negative)
 */
export const tabbable = `[tabindex]${not(notTabbable)}` as const;

/**
 * CSS-selector for elements that can receive focus
 */
export const focusable =
    `input${not(disabled)}${not(notTabbable)},
    select${not(disabled)}${not(notTabbable)},
    textarea${not(disabled)}${not(notTabbable)},
    button${not(disabled)}${not(notTabbable)},
    object${not(disabled)}${not(notTabbable)},
    a${hasLink}, a${hasRouterLink},
    area${hasLink}, ${tabbable}`.replace(/\s/g, '');

/**
 * Adds the library prefix to the beginning of the provided string
 * @param base - the string to be prefixed
 * @returns - the provided string prefixed with the library name
 */
export function prefix (base: string) : string {
    base = base.toLowerCase();
    return base.startsWith(pre) ? base : `${pre}${base}`;
}

/**
 * Adds two dashes to the beginning of the provided string
 * @param base - the string to be prefixed
 * @returns - the provided string prefixed with two dashes
 */
export function cssPrefix (base: string) : string {
    return `--${prefix(base.replace(/^-+/, ''))}`;
}

/**
 * Turns the provided string into a CSS variable call
 * @param base - the name of the CSS variable to call
 * @returns - the CSS variable call for the provided string
 */
export function cssVar (base: string) : string {
    return `var(${cssPrefix(base)})`;
}

/**
 * Negates the provided CSS selector
 * @param base - the CSS selector to negate
 * @returns - the negated CSS selector
 */
export function not (base: string) : string {
    return `:not(${base})`;
}

/**
 * Generates a class CSS selector
 * @param base - the name of the class to generate
 * @returns - the generated CSS selector
 */
export function className (base: string) : string {
    return `.${prefix(base)}`;
}

/**
 * Generates an id CSS selector
 * @param base - the name of the id to generate
 * @returns - the generated CSS selector
 */
export function id (base: string) : string {
    return `#${prefix(base)}`;
}

/**
 * Generates an aria-controls CSS selector
 * @param id - the id of the controlled element
 * @returns - the generated CSS selector
 */
export function controls (id?: string | null) : string {
    return id ? `[aria-controls="${prefix(id)}"]` : hasControls;
}

/**
 * Generates an aria-expanded CSS selector
 * @param bool - whether the element is expanded or not
 * @returns - the generated CSS selector
 */
export function expanded (bool?: boolean | null) : string {
    return typeof bool === 'boolean' ? `[aria-expanded="${bool}"]` : hasExpanded;
}

/**
 * Returns a NodeList of HTMLElements within the given element that are focusable
 * @param el - the element whose focusable children will be returned
 * @returns - the elements within the given element that are focusable
 */
export function getFocusables (el?: HTMLElement | null) : HTMLElement[] {
    let focusables: HTMLElement[];
    if (el) {
        focusables = Array.from(el.querySelectorAll<HTMLElement>(focusable));
    } else {
        focusables = Array.from(document.querySelectorAll<HTMLElement>(focusable));
    }
    return focusables.filter((el: HTMLElement) => isFocusable(el));
}

/**
 * Returns true if an element is focusable and false if not,
 * based on styles (i.e. a parent has display: none;)
 * NOTE: Still need to determine what other styles may make an element un-focusable
 * @param el - the element
 * @returns - true if the element is focusable; false if not
 */
export function isFocusable (el: HTMLElement) : boolean {
    let current: HTMLElement | null = el;

    do {
        const display = window
            .getComputedStyle(current)
            .getPropertyValue('display')
            .toLowerCase();

        if (display === 'none') {
            return false;
        }
        current = current.parentElement;
    } while (current);
    return true;
}
