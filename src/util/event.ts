import { delay } from '@/types/time';

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(func: T, wait: number = delay.default) : (...args: Parameters<T>) => void {
	let timer: number;
	return function (...args: Parameters<T>) : void {
		if (timer) {
			clearTimeout(timer);
		}
		timer = window.setTimeout(() => {
			func(...args);
		}, wait);
	}
}

export function debounceEvent<T extends (e: Event) => ReturnType<T>>(func: T, wait: number = delay.default) : EventListener {
    return debounce(func, wait) as EventListener;
}

export function throttle<T extends (...args: never[]) => unknown> (
	func: T,
	wait: number = delay.default,
	options?: Record<string, boolean>,
) : (...args: Parameters<T>) => ReturnType<T> | undefined {
	let result: ReturnType<T> | undefined;
	let timeout = 0;
	let previous = 0;
	let pendingCall: (() => ReturnType<T>) | null = null;

	const later = (): void => {
		previous = options?.leading === false ? 0 : new Date().getTime();
		timeout = 0;
		if (pendingCall) {
			result = pendingCall();
		}
		if (!timeout) {
			pendingCall = null;
		}
	};

	return function (this: ThisParameterType<T>, ...throttleArgs: Parameters<T>): ReturnType<T> | undefined {
		const now = new Date().getTime();
		if (!previous && options?.leading === false) {
			previous = now;
		}
		const remaining = wait - now + previous;
		pendingCall = () => func.apply(this, throttleArgs) as ReturnType<T>;

		if (remaining <= 0 || remaining > wait) {
			if (timeout) {
				clearTimeout(timeout);
				timeout = 0;
			}
			previous = now;
			result = pendingCall();
			if (!timeout) {
				pendingCall = null;
			}
		} else if (!timeout && options?.trailing !== false) {
			timeout = window.setTimeout(later, remaining);
		}
		return result;
	};
}

export function throttleEvent (
	func: (e: Event) => unknown,
	wait: number = delay.default,
	options?: Record<string, boolean>,
) : EventListener {
	return throttle(func, wait, options);
}
