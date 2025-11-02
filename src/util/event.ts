import { durationDefault } from '@/types/time';

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(func: T, wait: number = durationDefault) : (...args: Parameters<T>) => void {
	let timer: number;
	return function (...args: Parameters<T>) : void {
		if (timer) {
			clearTimeout(timer);
		}
		timer = Number(setTimeout(func, wait, ...args));
	}
}

export function debounceEvent<T extends (e: Event) => ReturnType<T>>(func: T, wait: number = durationDefault) : EventListener {
    return debounce(func, wait) as EventListener;
}

export function throttle (
	func: Function,
	wait: number = durationDefault,
	options?: {[key: string]: boolean},
) : Function {
	let context: any, args: any, result: any,
		timeout: number, previous: number = 0,
		later: Function = function () {
			previous = options?.leading === false ? 0 : new Date().getTime();
			timeout = 0;
			result = func.apply(context, args);
			if (!timeout) {
				context = args = null;
			}
		},
		throttled: Function = function (this: any): any {
			let now: number = new Date().getTime();
			if (!previous && options?.leading === false) {
				previous = now;
			}
			let remaining: number = wait - now + previous;
			context = this;
			args = arguments;
			if (remaining <= 0 || remaining > wait) {
				if (timeout) {
					clearTimeout(timeout);
					timeout = 0;
				}
				previous = now;
				result = func.apply(context, args);
				if (!timeout) {
					context = args = null;
				}
			} else if (!timeout && options?.trailing !== false) {
				timeout = window.setTimeout(later, remaining);
			}
			return result;
		};

	return throttled;
}

export function throttleEvent (
	func: Function,
	wait: number = durationDefault,
	options?: {[key: string]: boolean},
) : EventListener {
	return throttle(func, wait, options) as EventListener;
}
