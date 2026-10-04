import { AttachesEvents } from '@/abstract/attaches-events';
import { breakpoints } from '@/types/breakpoints';
import { sides } from '@/types/side';
import { delay } from '@/types/time';
import { throttleEvent } from '@/util/event';
import { className, controls, expanded, getFocusables, prefix } from '@/util/selectors';
import { windowWidth } from '@/util/window';

const panelClass = prefix('panel');
const panelWrapClass = prefix('panel-wrap');
const panelToggleClass = prefix('panel-toggle');
const openClass = prefix('open');
const trayClass = prefix('tray');
const expandClass = prefix('expand');
const sideClasses = sides.map((side) => prefix(side));

export class Panel extends AttachesEvents {

    settings: Record<string, unknown> = {
		title: 'panel',
        from: sides[0],
        fixed: true
    };

    el: Record<string, HTMLElement | null> = {};

    constructor (settings?: Record<string, unknown>) {
        super();
        this.settings = {...this.settings, ...settings};

		if (!this.settings.id || !this.settings.wrapperId) {
			throw new Error('Panel ID and wrapper ID are required');
		}

        this.attachElements();
        this.attachEvents();
        this.addClasses();

		requestAnimationFrame(() => {
			this.setPanel();
		});
    }

    attachElements () : void {
        this.el.html = document.querySelector('html');
		this.el.main = document.querySelector('main');
        this.el.panel = document.getElementById(this.settings.id as string);
        this.el.wrapper = document.getElementById(this.settings.wrapperId as string);
        this.el.toggleButton = this.el.panel?.querySelector(controls(this.settings.wrapperId as string)) ?? null;
    }

    attachEvents () : void {
		this.attachEvent(window, 'resize', throttleEvent(this.eHandleResize.bind(this), delay.default));
		this.attachEvent(this.el.main, 'click', throttleEvent(this.eClose.bind(this), delay.default, { trailing: false }));
        this.attachEvent(this.el.wrapper, 'transitionend', this.eTransitionEnd.bind(this));

        const focusables = getFocusables(this.el.panel);
        focusables.forEach(focusable => {
            this.attachEvent(focusable, 'keydown', throttleEvent(this.eWrapTab.bind(this)));
        });

		const wrapperId = this.settings.wrapperId;
		if (typeof wrapperId !== 'string') {
			return;
		}

		const toggleButtons = this.el.panel?.querySelectorAll(controls(wrapperId));
		toggleButtons?.forEach(toggleButton => {
			this.attachEvent(toggleButton as HTMLElement, 'click', throttleEvent(this.eToggle.bind(this), delay.slower, { trailing: false }));
		});
    }

    addClasses () : void {
		this.el.panel?.classList.add(panelClass);
		this.el.wrapper?.classList.add(panelWrapClass);
		this.el.toggleButton?.classList.add(panelToggleClass);

		const from = this.settings.from;
		if (typeof from === 'string') {
			this.el.panel?.classList.remove(...sideClasses);
			this.el.panel?.classList.add(prefix(from.toLowerCase()));
		}

        if (this.settings.tray) {
            this.el.panel?.classList.add(trayClass);
        }
    }

    setPanel (open = false) : void {
		const title = typeof this.settings.title === 'string' ? this.settings.title : 'panel';
        const ariaExpanded: string = open ? 'true' : 'false',
            ariaLabel: string = open ? `close ${title}` : `open ${title}`;

        this.el.toggleButton?.setAttribute('aria-expanded', ariaExpanded);
        setTimeout(() => {
            this.el.toggleButton?.setAttribute('aria-label', ariaLabel);
        }, delay.faster);

        if (open) {
			this.closeOtherPanels();
			
            if (this.settings.fixed !== true) {
                window.scroll({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                });
            }

            setTimeout(() => {
                if (this.el.html) {
                    const isMobile = windowWidth() <= breakpoints.sm;
                    let overflow = 'auto';

                    if (this.settings.tray) {
                        if (isMobile) {
                            overflow = 'hidden';
                        }
                    } else {
                        overflow = 'hidden';
                    }
                    this.el.html.style.overflow = overflow;
                }
            }, this.settings.from === sides[3] ? delay.default : delay.instant);
            
            if (this.el.wrapper) {
                this.el.wrapper.style.display = 'flex';
            }

            requestAnimationFrame(() => {
                this.el.wrapper?.classList.add(openClass);
            });
        } else {
            if (this.el.html) {
                this.el.html.style.overflow = 'auto';
            }            
            
            requestAnimationFrame(() => {
                this.el.wrapper?.classList.remove(openClass);
            });
        }
    }

    togglePanel () : void {
        this.setPanel(this.el.toggleButton?.getAttribute('aria-expanded')?.toLowerCase() === 'false');
    }

	closeOtherPanels () : void {
		const wrapperId = typeof this.settings.wrapperId === 'string' ? this.settings.wrapperId : '';
		const openPanelSelector = `${className('panel-toggle')}${expanded(true)}:not([aria-controls="${wrapperId}"])`;
		const toggleBtn = document.querySelector(openPanelSelector);
		if (toggleBtn) {
            (toggleBtn as HTMLButtonElement).click();
        }
	}

    eHandleResize () : void {
		const isMobile = windowWidth() <= breakpoints.sm;
		let closeMenu = true;
		if (this.el.panel?.classList.contains(trayClass)) {
			closeMenu = false;
		} else if (!this.el.panel?.classList.contains(expandClass)) {
			closeMenu = false;
		}
		
		if (!isMobile && closeMenu) {
			this.setPanel(false);
		}

        const isOpen = this.el.toggleButton?.getAttribute('aria-expanded')?.toLowerCase() === 'true';
		let overflow = 'auto';
        
        if (isOpen) {
            if (this.settings.tray) {
                if (isMobile) {
                    overflow = 'hidden';
                }
            } else {
                overflow = 'hidden';
            }
        }

        if (this.el.html) {
            this.el.html.style.overflow = overflow;
        }
    }

    eWrapTab (e: Event) : void {
		if (!(e instanceof KeyboardEvent)) {
			return;
		}

		const focusables = getFocusables(this.el.panel);
		const lastFocusable = focusables[focusables.length - 1];
		const wrapTab = focusables.length > 1 && document.activeElement === lastFocusable;
		const isTab = e.key.toLowerCase() === 'tab' && !e.shiftKey;

        if (isTab && wrapTab) {
            this.el.toggleButton?.focus();
            if (document.activeElement === this.el.toggleButton) {
                e.preventDefault();
            }
        }
    }

    eToggle () : void {
        this.togglePanel();
    }

	eClose () : void {
		this.setPanel(false);
	}

    eTransitionEnd () : void {
        if (this.el.wrapper?.classList.contains(openClass) === false ) {
            this.el.wrapper.style.display = 'none';
        }
    }
}
