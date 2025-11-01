import { clamp } from "@/util/math";

export const headerNumMin = 1 as const;
export const headerNumMax = 6 as const;

export function headerNum(num?: number): number {
	return clamp(num, headerNumMin, headerNumMax);
}
