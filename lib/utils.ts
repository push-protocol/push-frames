import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function extractDynamicArgs(str: string) {
  const regex = /\$\{([^}]+)\}/g;
  const matches = [];
  let match;

  while ((match = regex.exec(str)) !== null) {
    matches.push(`[${match[1]}]`);
  }

  return matches;
}
