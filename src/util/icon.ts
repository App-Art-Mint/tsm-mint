/**
 * Default selector-to-icon map
 */
export const icons: Record<string, string> = {
	'a[href^="mailto:"]': 'far fa-envelope',
	'a[href^="tel:"]': 'fas fa-phone-flip',
	'a[href^="sms:"]': 'far fa-message',
	'a[href^="https://maps"]': 'fas fa-map-location-dot',
	'a[href^="http"]': 'fas fa-up-right-from-square',
};

const externalLinkIcon = 'fa-up-right-from-square';

/**
 * Appends an icon to each match when the element does not already contain one
 * @param icon - space-separated icon classes
 * @param selector - elements that should receive the icon
 */
export function appendIcon (icon: string, selector: string): void {
	const items = document.querySelectorAll<HTMLElement>(selector);
	items.forEach((item) => {
		const iconElement = document.createElement('i');
		iconElement.classList.add(...icon.split(' '));
		if (!item.querySelector('i')) {
			item.appendChild(iconElement);
		}
		if (iconElement.classList.contains(externalLinkIcon)) {
			item.setAttribute('target', '_blank');
		}
	});
}

/**
 * Merges icon overrides onto the defaults and appends the active ones.
 * Pass `false` for a selector to skip that default.
 * @param iconOverrides - selectors to add, replace, or disable
 */
export function updateIcons (iconOverrides?: Record<string, string | false>): void {
	const merged: Record<string, string | false> = {
		...icons,
		...iconOverrides,
	};
	const activeIcons = Object.fromEntries(
		Object.entries(merged).filter((entry): entry is [string, string] => entry[1] !== false)
	);

	Object.keys(activeIcons).forEach((selector) => {
		appendIcon(activeIcons[selector], selector);
	});
}

/**
 * Removes the first icon from each match
 * @param selector - elements whose icon should be removed
 */
export function removeIcon (selector: string): void {
	const items = document.querySelectorAll<HTMLElement>(selector);
	items.forEach((item) => {
		item.querySelector('i')?.remove();
	});
}
