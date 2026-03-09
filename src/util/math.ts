/**
 * Return a number between min and max
 * @param num - the number to clamp
 * @param min - the minimum value
 * @param max - the maximum value
 * @returns a number between min and max
 */
export function clamp(num: number | null | undefined, min: number, max: number): number {
	return Math.max(min, Math.min(num ?? min, max));
}

/**
 * Get a random integer between min and max
 * @param max Maximum value to return
 * @param min Minimum value to return (default is 0)
 * @returns a random integer between min and max
 */
export function randomInt (max: number, min = 0): number {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min);
}
