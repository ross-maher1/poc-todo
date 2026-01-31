/**
 * localStorage persistence layer.
 *
 * Each feature should have its own storage module with load/save functions.
 * Always handle SSR (typeof window === "undefined") and errors gracefully.
 */

import { Item } from "../types";
import { STORAGE_KEYS } from "../constants";

export function loadItems(): Item[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.items);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("loadItems error", error);
    return [];
  }
}

export function saveItems(items: Item[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.items, JSON.stringify(items));
  } catch (error) {
    console.error("saveItems error", error);
  }
}

export function deleteItem(id: string): boolean {
  try {
    const items = loadItems();
    const filtered = items.filter((item) => item.id !== id);
    saveItems(filtered);
    return true;
  } catch (error) {
    console.error("deleteItem error", error);
    return false;
  }
}
