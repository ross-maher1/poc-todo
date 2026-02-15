/**
 * App constants and configuration.
 *
 * Define all constants, enums, and configuration values here.
 * Avoid hardcoding values in components.
 *
 * Example:
 *
 * export const CATEGORIES = ["work", "personal", "urgent"] as const;
 * export type Category = (typeof CATEGORIES)[number];
 *
 * export const STATUS_LABELS: Record<string, string> = {
 *   pending: "Pending",
 *   complete: "Complete",
 * };
 */

export const APP_NAME = "Todo";

export const STORAGE_KEYS = {
  settings: "poc_todo_settings",
} as const;
