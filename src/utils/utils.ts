import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toSeoFriendly(str: string): string {
  return str
    .toLowerCase()                    // minuscole
    .normalize("NFD")                 // separa lettere e accenti
    .replaceAll(/[\u0300-\u036f]/g, "") // rimuove accenti
    .replaceAll(/[^a-z0-9 ]/g, "")      // rimuove caratteri non alfanumerici
    .trim()                           // rimuove spazi iniziali/finali
    .replaceAll(/\s+/g, "_");            // sostituisce spazi con underscore
}