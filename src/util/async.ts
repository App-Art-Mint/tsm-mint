export function wait(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export async function waitAtLeast<T>(ms: number, promise: Promise<T>): Promise<T> {
	const [result] = await Promise.all([promise, wait(ms)]);
	return result;
}
