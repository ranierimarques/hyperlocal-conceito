export const tw = (strings: TemplateStringsArray, ...values: any[]): string =>
  String.raw({ raw: strings }, ...values);

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
