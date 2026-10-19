import type { Side } from '@appartmint/tsm-types/side';

export const sides = [
	'top',
	'right',
	'bottom',
	'left',
] as const satisfies readonly Side[];
