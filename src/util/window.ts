/**
 * Returns the width of the window, including fractional pixels
 * @returns the width of the window
 */
export function windowWidth () : number {
	const decimal: number = document.body.getBoundingClientRect().width % 1;
	return window.innerWidth + decimal;
}

/**
 * Returns the height of the window, including fractional pixels
 * @returns the height of the window
 */
export function windowHeight () : number {
	const decimal: number = document.body.getBoundingClientRect().height % 1;
	return window.innerHeight + decimal;
}
