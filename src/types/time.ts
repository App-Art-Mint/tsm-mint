export const delayBase = 0 as const;
export const delayStep = 100 as const;
export const delay = {
	instant: delayBase + delayStep * 0,
	fastest: delayBase + delayStep * 1,
	faster: delayBase + delayStep * 2,
	default: delayBase + delayStep * 3,
	slower: delayBase + delayStep * 4,
	slowest: delayBase + delayStep * 5
} as const;
