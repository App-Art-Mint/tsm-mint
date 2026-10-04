import type { Breakpoint, BreakpointKey } from '@appartmint/tsm-types/breakpoints';

export type { Breakpoint, BreakpointKey };

export const breakpoints = {
	xs: 480,
	sm: 768,
	md: 1024,
	lg: 1200,
	xl: 1440,
} as const satisfies Record<BreakpointKey, Breakpoint>;
