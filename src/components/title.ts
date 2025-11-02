import { clamp } from "@/util/math";

export const titleNums = [1, 2, 3, 4, 5, 6] as const;
export type TitleNum = typeof titleNums[number];

export const titleNumMin = titleNums[0] as TitleNum;
export const titleNumMax = titleNums[titleNums.length - 1] as TitleNum;

export function titleNum(num?: number): TitleNum {
	return clamp(num, titleNumMin, titleNumMax) as TitleNum;
}
