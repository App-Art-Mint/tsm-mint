import { type Side, sides } from '@/types/side';
import { delay } from '@/types/time';

export interface TransitionProps {
	duration?: number,
	from?: Side,
}

export function showElement (el?: HTMLElement | null, {
	duration = delay.default,
	from = sides[0],
}: TransitionProps = {}) : void {
	if (!el) {
		return;
	}

	const vertical = from === 'top' || from === 'bottom';

	el.style.display = '';
	requestAnimationFrame(() => {
		const { scrollHeight, scrollWidth } = el;

		if (vertical) {
			el.style.height = `${scrollHeight.toString()}px`;
		} else {
			el.style.width = `${scrollWidth.toString()}px`;
		}
		
		setTimeout(() => {
			if (vertical) {
				el.style.height = 'auto';
			} else {
				el.style.width = 'auto';
			}
		}, duration);
	});
}

export function hideElement (el?: HTMLElement | null, {
	duration = delay.default,
	from = sides[0],
}: TransitionProps = {}) : void {
	if (!el) {
		return;
	}

	const vertical = from === 'top' || from === 'bottom';
	const { scrollHeight, scrollWidth, style: { transition } } = el;

	el.style.transition = '';
	requestAnimationFrame(() => {
		if (vertical) {
			el.style.height = `${scrollHeight.toString()}px`;
		} else {
			el.style.width = `${scrollWidth.toString()}px`;
		}
		
		el.style.transition = transition;
		requestAnimationFrame(() => {
			if (vertical) {
				el.style.height = '0';
			} else {
				el.style.width = '0';
			}
		});
	});
	setTimeout(() => {
		el.style.display = 'none';
	}, duration);
}
