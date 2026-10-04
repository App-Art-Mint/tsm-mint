import type { TitleNum } from '@appartmint/tsm-types/components/ui/text/title';
import { clamp } from '@/util/math';

export type { TitleNum };

export const titleNums = [1, 2, 3, 4, 5, 6] as const satisfies readonly TitleNum[];
export const titleNumMin = titleNums[0];
export const titleNumMax = titleNums[titleNums.length - 1];

export function titleNum(num?: number): TitleNum {
	return clamp(num, titleNumMin, titleNumMax) as TitleNum;
}
