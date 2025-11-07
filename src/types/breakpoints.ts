export const breakpoints = {
	xs: 480,
	sm: 768,
	md: 1024,
	lg: 1200,
	xl: 1440,
} as const;
type BP = typeof breakpoints;
export type BreakpointKey = keyof BP;
export type Breakpoint = BP[BreakpointKey];
