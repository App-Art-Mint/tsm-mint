export const boxPositions = [
	'top',
	'right',
	'bottom',
	'left',
] as const;

export type BoxPosition = (typeof boxPositions)[number];
