/**
 * Returns a copy of the list with the items in random order
 * @param list - the list to shuffle
 * @returns the shuffled list
 */
export function shuffleCopy<T> (list: T[]): T[] {
	const copy = [...list];
	for (let index = copy.length - 1; index > 0; index--) {
		const swapIndex = Math.floor(Math.random() * (index + 1));
		const current = copy[index];
		const swap = copy[swapIndex];
		if (current !== undefined && swap !== undefined) {
			copy[index] = swap;
			copy[swapIndex] = current;
		}
	}
	return copy;
}

/**
 * Filters the array in place and returns it
 * @param list - the array to filter, which is modified in place
 * @param test - return true to keep the element
 * @returns the original array with only the elements that passed the test
 */
export function filterList<T> (list: T[], test: (item: T) => boolean): T[] {
	let writeIndex = 0;
	for (const item of list.slice()) {
		if (test(item)) {
			list[writeIndex++] = item;
		}
	}
	list.length = writeIndex;
	return list;
}

/**
 * Returns a copy of the list with duplicate items removed
 * @param list - the list to unique
 * @returns the unique list
 */
export function unique<T> (list: T[]): T[] {
	return [...new Set(list)];
}
