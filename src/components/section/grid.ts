import type { GridNum } from '@appartmint/tsm-types/components/section/grid';
import { clamp } from '@/util/math';

export type { GridNum };

export const gridNums = [1, 2, 3, 4] as const satisfies readonly GridNum[];
export const gridNumMin = gridNums[0];
export const gridNumMax = gridNums[gridNums.length - 1];

export function gridNum(num?: number): GridNum {
	return clamp(num, gridNumMin, gridNumMax) as GridNum;
}
