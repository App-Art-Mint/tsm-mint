import { clamp } from "@/util/math";

export const titleNumMin = 1 as const;
export const titleNumMax = 6 as const;

export function titleNum(num?: number): number {
	return clamp(num, titleNumMin, titleNumMax);
}
