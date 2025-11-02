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
		let elements = document.querySelectorAll('.mint-fall-in:not(.mint-show)'),
			elementsToShow: Element[] = [];
		for (let i = 0; i < elements.length; i++) {
			if (elements[i].getBoundingClientRect().top < 0) {
				elements[i].classList.add('mint-show');
			} else if (elements[i].getBoundingClientRect().top < window.innerHeight * 3 / 4) {
				elementsToShow.push(elements[i]);
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
