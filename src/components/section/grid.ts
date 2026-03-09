import { clamp } from '@/util/math';

export const gridNums = [1, 2, 3, 4] as const;
export type GridNum = typeof gridNums[number];

export const gridNumMin = gridNums[0] as GridNum;
export const gridNumMax = gridNums[gridNums.length - 1];

export function gridNum(num?: number): GridNum {
	return clamp(num, gridNumMin, gridNumMax) as GridNum;
}
