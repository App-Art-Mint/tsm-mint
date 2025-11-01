import { clamp } from '@/util/math';

export const gridNumMin = 1 as const;
export const gridNumMax = 4 as const;

export function gridNum(num?: number): number {
	return clamp(num, gridNumMin, gridNumMax);
}
