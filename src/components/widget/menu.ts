import { AttachesEvents } from '@/abstract/attaches-events';
import { delay } from '@/types/time';
import { hideElement, showElement } from '@/util/display';
import { throttleEvent } from '@/util/event';
import { controls, focusable, subMenu, subMenuButtons } from '@/util/selectors';

export class Menu extends AttachesEvents {

    settings: Record<string, unknown> = {};

    el: Record<string, HTMLElement | null> = {};

    constructor (settings?: Record<string, unknown>) {
        super();
        this.settings = {...this.settings, ...settings};

		if (!this.settings.wrapperId) {
			throw new Error('Wrapper ID is required');
		}

        this.attachElements();
        this.attachEvents();

		requestAnimationFrame(() => {
			this.closeAllMenus();
		});
    }

    attachElements () : void {
        this.el.wrapper = document.getElementById(this.settings.wrapperId as string);
    }

    attachEvents () : void {
		this.attachEvent(window, 'scroll', throttleEvent(this.eHandleScroll.bind(this), delay.default, { trailing: false }));

        const focusables = this.el.wrapper?.querySelectorAll(focusable) as NodeListOf<HTMLElement> | null;
        focusables?.forEach((focusable) => {
			this.attachEvent(focusable, 'keydown', throttleEvent(this.eHandleKeypress.bind(this)));
        });

        const menuButtons = this.el.wrapper?.querySelectorAll(controls()) as NodeListOf<HTMLElement> | null;
        menuButtons?.forEach((menuButton) => {
            this.attachEvent(menuButton, 'click', throttleEvent(this.eToggleMenu.bind(this), delay.slower, { trailing: false }));
        });
    }

    setMenu (button?: HTMLElement | null,
             open = false) : void {
        const ariaExpanded: string = open ? 'true' : 'false',
            menu: HTMLElement | null = button?.nextElementSibling as HTMLElement | null;
        if (button && menu) {
            button.setAttribute('aria-expanded', ariaExpanded);
            if (open) {
                showElement(menu);
            } else {
                hideElement(menu);
                this.closeSubMenus(button);
            }
        }
    }

    toggleMenu (button?: HTMLElement | null) : void {
        this.setMenu(button, button?.getAttribute('aria-expanded')?.toLowerCase() !== 'true');
    }

    closeSubMenus (button?: HTMLElement | null) : void {
        const menu: HTMLElement | null | undefined = button?.nextElementSibling as HTMLElement,
            subMenus: NodeListOf<HTMLElement> = menu.querySelectorAll(subMenuButtons);
        subMenus.forEach((child: HTMLElement) => {
            // setMenu calls this function, so ignore subsub menus
            if (child.parentElement?.parentElement === menu) {
                this.setMenu(child);
            }
        });
    }

    closeSiblingMenus (button?: HTMLElement | null) : void {
        const menu: HTMLElement | null | undefined = button?.parentElement,
            siblingMenus: NodeListOf<HTMLElement> | undefined = menu?.parentElement?.querySelectorAll(subMenuButtons);
        siblingMenus?.forEach((child: HTMLElement) => {
            if (child !== button) {
                this.setMenu(child);
            }
        });
    }

    closeAllMenus () : void {
        const menuButtons: NodeListOf<HTMLElement> | undefined = this.el.wrapper?.querySelectorAll(subMenuButtons);
        menuButtons?.forEach((menuButton: HTMLElement) => {
            this.setMenu(menuButton);
        });
    }

    openClosestMenu () : void {
        const activeButton = document.activeElement as HTMLElement | null;
        const showing = activeButton?.getAttribute('aria-expanded')?.toLowerCase() === 'true';

        let activeMenu = activeButton?.nextElementSibling as HTMLElement | null;
        if (activeButton?.getAttribute('aria-controls') === this.settings.wrapperId) {
            activeMenu = this.el.wrapper;
        }

        if (activeButton?.getAttribute('aria-controls') && activeMenu && !showing) {
            activeButton.click();
            const firstFocusable: HTMLElement | null = activeMenu.querySelector(focusable);
            firstFocusable?.focus();
        }
    }

    closeClosestMenu () : void {
        const activeElement = document.activeElement as HTMLElement | null;
        const activeMenu = activeElement?.closest(subMenu) as HTMLElement | null;
        let activeButton = activeMenu?.previousElementSibling as HTMLElement | null | undefined;
        if (activeElement?.getAttribute('aria-controls') && activeElement.getAttribute('aria-expanded')?.toLowerCase() === 'true') {
            activeButton = activeElement;
        }

        if (activeButton?.getAttribute('aria-expanded')?.toLowerCase() === 'true') {
            activeButton.click();
            activeButton.focus();
        }
    }

    toggleClosestMenu () : void {
        if (document.activeElement?.getAttribute('aria-expanded')?.toLowerCase() === 'true') {
            this.closeClosestMenu();
        } else {
            this.openClosestMenu();
        }
    }

    eHandleScroll () : void {
        this.closeAllMenus();
    }

    eHandleButtonKeypress (e: KeyboardEvent) : void {
        const target = e.target as HTMLElement | null,
            subMenu = target?.closest('li');
        switch (e.key.toLowerCase()) {
            case 'escape':
                if (subMenu?.classList.contains('mint-open')) {
                    this.setMenu(subMenu);
                }
                break;
            case 'arrowleft':
                this.closeClosestMenu();
                break;
            case 'arrowright':
                this.openClosestMenu();
                break;
            case 'enter':
            case 'space':
                target?.click();
                break;
        }
    }

    eHandleLinkKeypress (e: KeyboardEvent) : void {
        const target = e.target as HTMLElement | null;
        switch (e.key.toLowerCase()) {
            case 'escape':
            case 'arrowleft':
                this.closeClosestMenu();
                break;
            case 'arrowright':
                this.openClosestMenu();
                break;
            case 'enter':
            case 'space':
                target?.click();
                break;
        }
    }

    eHandleKeypress (e: Event) : void {
        if (!(e instanceof KeyboardEvent)) {
            return;
        }

        if (e.key.toLowerCase() !== 'tab') {
            e.preventDefault();
        }
        const target = e.target as HTMLElement | null;
        switch (target?.tagName.toLowerCase()) {
            case 'a':
                this.eHandleLinkKeypress(e);
                break;
            case 'button':
                this.eHandleButtonKeypress(e);
                break;
        }
    }

    eToggleMenu (e: Event) : void {
        if (!(e instanceof MouseEvent)) {
            return;
        }

        const target = e.target as HTMLElement | null;
        this.closeSiblingMenus(target);
        this.toggleMenu(target);
    }
};
