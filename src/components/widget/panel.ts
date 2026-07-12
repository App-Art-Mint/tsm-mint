import { breakpoints } from '@/types/breakpoints';
import { sides } from '@/types/side';
import { delay } from '@/types/time';
import { AttachesEvents } from '@/abstract/attaches-events';
import { windowWidth } from '@/util/window';
import { throttleEvent } from '@/util/event';
import { controls, getFocusables } from '@/util/selectors';

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

		const toggleButtons = this.el.panel?.querySelectorAll(controls(this.settings.wrapperId))!;
		toggleButtons.forEach(toggleButton => {
			this.attachEvent(toggleButton as HTMLElement, 'click', throttleEvent(this.eToggle.bind(this), delay.slower, { trailing: false }));
		});
    }

    addClasses () : void {
		this.el.panel?.classList.add('mint-panel');
		this.el.wrapper?.classList.add('mint-panel-wrap');
		this.el.toggleButton?.classList.add('mint-panel-toggle');

		if (this.settings.from) {
			this.el.panel?.classList.remove('mint-top', 'mint-right', 'mint-bottom', 'mint-left');
			this.el.panel?.classList.add(`mint-${this.settings.from.toLowerCase()}`);
		}

        if (this.settings.tray) {
            this.el.panel?.classList.add('mint-tray');
        }
    }

    setPanel (open = false) : void {
        const ariaExpanded: string = open ? 'true' : 'false',
            ariaLabel: string = open ? `close ${this.settings.title}` : `open ${this.settings.title}`;

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
                this.el.wrapper?.classList.add('mint-open');
            });
        } else {
            if (this.el.html) {
                this.el.html.style.overflow = 'auto';
            }            
            
            requestAnimationFrame(() => {
                this.el.wrapper?.classList.remove('mint-open');
            });
        }
    }

    togglePanel () : void {
        this.setPanel(this.el.toggleButton?.getAttribute('aria-expanded')?.toLowerCase() === 'false');
    }

	closeOtherPanels () : void {
		const openPanelSelector = `.mint-panel-toggle[aria-expanded="true"]:not([aria-controls="${this.settings.wrapperId}"])`;
		const toggleBtn = document.querySelector(openPanelSelector);
		if (toggleBtn) {
            (toggleBtn as HTMLButtonElement).click();
        }
	}

    eHandleResize () : void {
		const isMobile = windowWidth() <= breakpoints.sm;
		let closeMenu = true;
		if (this.el.panel?.classList.contains('mint-tray')) {
			closeMenu = false;
		} else if (!this.el.panel?.classList.contains('mint-expand')) {
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

    eWrapTab (e: KeyboardEvent) : void {
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
        if (this.el.wrapper?.classList.contains('mint-open') === false ) {
            this.el.wrapper.style.display = 'none';
        }
    }
}
