export interface ElementEvents {
	el: HTMLElement | Window | null,
	handlers: EventListener[],
	events: string[]
}

export abstract class AttachesEvents {
	events: ElementEvents[] = [];

	attachEvent(element: HTMLElement | Window | null | undefined, event: string, handler: EventListener) : void {
		if (element) {
			const oldElement = this.events.find(e => e.el === element);
			if (oldElement) {
				oldElement.handlers.push(handler);
				oldElement.events.push(event);
			} else {
				this.events.push({
					el: element,
					handlers: [handler],
					events: [event]
				});
			}
			element.addEventListener(event, handler);
		}
	}

	detachEvents() {
		this.events.forEach(event => {
			event.handlers.forEach((handler: EventListener, index: number) => {
				event.el?.removeEventListener(event.events[index], handler);
			});
		});
		this.events = [];
	}
}
