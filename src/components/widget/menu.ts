import { AttachesEvents } from '@/abstract/attaches-events';
import { delay } from '@/types/time';
import { hideElement, showElement } from '@/util/display';
import { throttleEvent } from '@/util/event';
import { controls, focusable, subMenu, subMenuButtons } from '@/util/selectors';

export class Menu extends AttachesEvents {

     settings: Record<string, any> = {};

    el: Record<string, HTMLElement | null> = {};

    constructor (settings?: Record<string, any>) {
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
        this.el.wrapper = document.getElementById(this.settings.wrapperId);
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
             open: boolean = false) : void {
        let ariaExpanded: string = open ? 'true' : 'false',
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
        let menu: HTMLElement | null | undefined = button?.nextElementSibling as HTMLElement,
            subMenus: NodeListOf<HTMLElement> = menu?.querySelectorAll(subMenuButtons) as NodeListOf<HTMLElement>;
        subMenus.forEach((child: HTMLElement) => {
            // setMenu calls this function, so ignore subsub menus
            if (child.parentElement?.parentElement === menu) {
                this.setMenu(child);
            }
        });
    }

    closeSiblingMenus (button?: HTMLElement | null) : void {
        let menu: HTMLElement | null | undefined = button?.parentElement as HTMLElement,
            siblingMenus: NodeListOf<HTMLElement> = menu?.parentElement?.querySelectorAll(subMenuButtons) as NodeListOf<HTMLElement>;
        siblingMenus.forEach((child: HTMLElement) => {
            if (child !== button) {
                this.setMenu(child);
            }
        });
    }

    closeAllMenus () : void {
        let menuButtons: NodeListOf<HTMLElement> | undefined = this.el.wrapper?.querySelectorAll(subMenuButtons);
        menuButtons?.forEach((menuButton: HTMLElement) => {
            this.setMenu(menuButton);
        });
    }

    openClosestMenu () : void {
        let activeButton = document.activeElement as HTMLElement | null,
            activeMenu = activeButton?.nextElementSibling as HTMLElement | null,
            showing = activeButton?.getAttribute('aria-expanded')?.toLowerCase() === 'true';
        if (activeButton?.getAttribute('aria-controls') === this.settings.wrapperId) {
            activeMenu = this.el.wrapper;
        }

        if (activeButton?.getAttribute('aria-controls') && activeMenu && !showing) {
            activeButton.click();
            let firstFocusable: HTMLElement | null = activeMenu.querySelector(focusable);
            firstFocusable?.focus();
        }
    }

    closeClosestMenu () : void {
        let activeElement = document.activeElement as HTMLElement | null,
            activeMenu = activeElement?.closest(subMenu) as HTMLElement | null,
            activeButton = activeMenu?.previousElementSibling as HTMLElement | null | undefined;
        if (activeElement?.getAttribute('aria-controls') && activeElement?.getAttribute('aria-expanded')?.toLowerCase() === 'true') {
            activeButton = activeElement;
        }

        if (activeButton?.getAttribute('aria-expanded')?.toLowerCase() === 'true') {
            activeButton?.click();
            activeButton?.focus();
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
        let target = e.target as HTMLElement | null,
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
        let target = e.target as HTMLElement | null;
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

    eHandleKeypress (e: KeyboardEvent) : void {
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

    eToggleMenu (e: MouseEvent) : void {
        let target = e.target as HTMLElement | null;
        this.closeSiblingMenus(target);
        this.toggleMenu(target);
    }
};
