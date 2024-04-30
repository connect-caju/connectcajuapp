import { type ClassValue, clsx } from "clsx";

// @ts-expect-error TS(2307): Cannot find module 'tailwind-merge' or its corresp... Remove this comment to see the full error message
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
