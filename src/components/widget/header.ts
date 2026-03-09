import { Panel } from './panel';
import { Menu } from './menu';

export class Header {

	settings: Record<string, any> = {
		id: 'mint-menu',
		wrapperId: 'mint-wrapper',
		title: 'menu',
		fixed: true
	};

	el: Record<string, HTMLElement | null> = {};

	panel?: Panel;
	menu?: Menu;

	constructor(settings?: Record<string, any>) {
		this.settings = { ...this.settings, ...settings };

		this.panel = new Panel(this.settings);
		this.menu = new Menu(this.settings);

		this.attachElements();
		this.addClasses();
	}

	detachEvents(): void {
		this.panel?.detachEvents();
		this.menu?.detachEvents();
	}

	attachElements(): void {
		this.el.body = document.querySelector('body');
	}

	addClasses(): void {
		if (this.settings.fixed) {
			this.el.body?.classList.add('mint-fixed');
		}
	}
}
