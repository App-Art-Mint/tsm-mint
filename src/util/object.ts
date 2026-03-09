/**
 * Returns true if the provided objects have the same keys
 */
export function objectSameKeys (obj1: any, obj2: any) : boolean {
	const keys: string[] = Object.keys(obj1);
	if (keys.length !== Object.keys(obj2).length) {
		return false;
	}
	let sameKeys = true;
	keys.forEach((key: string) => {
		if (obj1[key] !== obj2[key]) {
			sameKeys = false;
		}
	});
	return sameKeys;
}

/**
 * Returns true if the first object has at least the same
 * entries as the second object
 * @param superset - the object to check
 * @param subset - the object whose entries are required
 * @returns - true if the first object is a superset of the second
 */
export function objectIsSuperset (superset: any, subset: any) : boolean {
	let isSuperset = true;
	
	// Base case - if the objects are equal, it is a superset
	if (superset === subset) {
		return isSuperset;
	}

	// If the subset isn't an object or array, and doesn't
	// satisfy the base case, it isn't a superset
	try {
		if (Object.keys(subset).length === 0) {
			return !isSuperset;
		}
	}
	// If the subset is null or undefined, and doesn't satisfy
	// the base case, it isn't a superset
	// TODO: Check if other exceptions could occur
	catch {
		return !isSuperset;
	}

	// If the children of the subset are subsets of the
	// respective children of the superset, it is a superset
	Object.keys(subset).forEach((key: string) => {
		isSuperset = isSuperset && objectIsSuperset(superset[key], subset[key]);
	});
	return isSuperset;
}

/**
 * Removes object entries by key
 * @param object - the object to remove entries from
 * @param keys - the keys to remove
 */
export function removeKeys (object: any, keys: string[]) : any {
	return Object.keys(object).reduce((obj: any, key: string) => {
		if (!keys.includes(key)) {
			obj[key] = object[key];
		}
		return obj;
	}, {});
}

/**
 * Removes object entries by value
 */
export function objectRemoveValues (object: any, values: any[]) : any {
	return Object.keys(object).reduce((obj: any, key: string) => {
		if (!values.includes(object[key])) {
			obj[key] = object[key];
		}
		return obj;
	}, {});
}

/**
 * Sorts an object's entries alphabetically by key
 */
export function objectSortKeys (object: any, compareFn?: (a: string, b: string) => number) : any {
	return Object.keys(object).sort(compareFn).reduce((obj: any, key: string) => {
		obj[key] = object[key];
		return obj;
	}, {});
}

/**
 * Sorts an object's entries alphabetically by value
 */
export function objectSortValues (object: any, compareFn: (a: any, b: any) => number) : any {
	return Object.keys(object).sort((a: string, b: string) => compareFn(object[a], object[b])).reduce((obj: any, key: string) => {
		obj[key] = object[key];
		return obj;
	}, {});
}

/**
 * Filters an object by its keys
 * @param object - the object to filter
 * @param keys - the keys to keep
 * @returns - the filtered object
 */
export function objectFilterKeys (object: any, keys: string[]) : object {
	return keys.reduce((obj: any, key: string) => {
		obj[key] = object[key];
		return obj;
	}, {});
}

/**
 * Filters an object by its values
 * @param object - the object to filter
 * @param values - the values to keep
 * @returns - the filtered object
 */
export function objectFilterValues (object: any, values: any[]) : object {
	return Object.keys(object).reduce((obj: any, key: string) => {
		if (values.includes(object[key])) {
			obj[key] = object[key];
		}
		return obj;
	}, {});
}

/**
 * Update two sets of objects
 * @param original - the original object
 * @param update - the object to update the original with
 * @returns - the original objects with updated data from the update
 */
export function objectUpdateArray (original: any[], update?: any[], key = 'id') : any {
	
	// If there are no originals, push the updates
	if (!update?.length) {
		update?.forEach((object) => original.push(object));
	
	// If there are existing objects
	} else {

		// Create a dictionary of the updated objects
		const updateObjects = update.reduce<Record<string, object>>((objects, object) => ({
			...objects,
			[object?.[key] ?? '']: object
		}), {});

		// Remove any objects that aren't in the updated objects
		const missingObjects = original.filter((object) => !updateObjects[object?.[key] ?? '']);
		missingObjects?.forEach((object) => {
			const index = original.indexOf(object);
			if (typeof index == 'number' && index !== -1) {
				original.splice(index, 1);
			}
		});

		// Update the existing objects with updates
		original.forEach((object) => {
			if (updateObjects[object?.[key] ?? '']) {
				Object.assign(object, updateObjects[object?.[key] ?? '']);
			}
		});
	}

	// Push any new objects
	const newObjects = update?.filter((object) => !original.some((existingObject) => existingObject?.[key] === object?.[key]));
	newObjects?.forEach(newObject => original.push(newObject));
}

/**
 * Get an object's key by value
 */
export function objectGetKeyByValue(object: any, value: any): string | undefined {
	return Object.keys(object).find((key) => object[key] === value);
}

/**
 * Create a deep copy of an object
 */
export function objectDeepClone<T>(object: T): T {

	// Only clone objects
	if (typeof object !== 'object' || object === null) {
		return object;
	}

	// Track object references to avoid circular references
	const seen = new WeakMap();

	// Track clone tasks in a stack
	type CloneTask = [source: any, clone: any, key?: string | number];
	const stack: CloneTask[] = [[object, Array.isArray(object) ? [] : {}]];

	// Run clone tasks
	while (stack.length) {
		const [source, clone, key] = stack.pop()!;

		if (key !== undefined) {
			const value = source[key];

			// Bind functions
			if (typeof value === 'function') {
				clone[key] = value.bind(clone);
				continue;
			}

			// Primitives
			if (typeof value !== 'object' || value === null) {
				clone[key] = value;
				continue;
			}

			// Circular references
			if (seen.has(value)) {
				clone[key] = seen.get(value);
				continue;
			}

			// Object / Array
			clone[key] = Array.isArray(value) ? [] : {};
			seen.set(value, clone[key]);
			stack.push([value, clone[key]]);
		
		// No key, process full object
		} else {
			seen.set(source, clone);

			if (Array.isArray(source)) {
				source.forEach((_, index) => {
					stack.push([source, clone, index]);
				});
				continue;
			}

			Object.keys(source).forEach((key) => {
				stack.push([source, clone, key]);
			});
		}
	}

	return seen.get(object) as T;
}
