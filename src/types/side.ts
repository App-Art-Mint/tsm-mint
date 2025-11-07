export const sides = [
	'top',
	'right',
	'bottom',
	'left',
] as const;

export type Side = (typeof sides)[number];
