import { throttleEvent } from '@/util/event';

/**
 * Scroll to the top of the page
 */
export function scrollTo(to: number | 'top' | 'bottom'): void {
	switch (to) {
		case 'top':
			to = 0;
			break;
		case 'bottom':
			to = document.body.scrollHeight;
			break;
	}
	window.scrollTo(0, to);
}

/**
 * Show visible elements
 */
export function showElements(): void {
	requestAnimationFrame(() => {
		const elements = document.querySelectorAll('.mint-fall-in:not(.mint-show)'),
			elementsToShow: Element[] = [];
		for (const element of elements) {
			if (element.getBoundingClientRect().top < 0) {
				element.classList.add('mint-show');
			} else if (element.getBoundingClientRect().top < window.innerHeight * 3 / 4) {
				elementsToShow.push(element);
			}
		}
		for (let i = 0; i < elementsToShow.length; i++) {
			setTimeout(() => {
				elementsToShow[i].classList.add('mint-show');
			}, i * 100);
		}
	});
}

/**
 * Show visible elements on scroll
 */
export function showElementsOnScroll(): void {
	window.addEventListener('scroll', throttleEvent(showElements, 200));
}
