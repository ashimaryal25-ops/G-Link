import type { EventStatus, TaskStatus } from "./types";

export const storageKey = "g-link-app-mvp-data";
export const sessionKey = "g-link-demo-session";
export const taskStatuses: TaskStatus[] = ["todo", "in progress", "blocked", "done", "cancelled"];
export const eventStatuses: EventStatus[] = ["draft", "planned", "active", "completed", "cancelled"];

export function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function money(value: number) {
  return new Intl.NumberFormat("en-US", { currency: "USD", style: "currency" }).format(value);
}

export function safeNumber(value: number | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function nameOf(records: Array<{ id: string; name?: string; title?: string }>, id: string) {
  const record = records.find((item) => item.id === id);
  return record?.name ?? record?.title ?? "Unknown";
}
