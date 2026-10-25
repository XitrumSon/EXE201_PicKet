export type BillFormError = "titleRequired" | "titleTooLong" | "invalidAmount" | "invalidDate";
type BillFields = { title: string; amount: string; dueDate: string };
type BillPayload = { title: string; amount: number; dueAt: string };

/** Form dates are local calendar days, not UTC dates. */
export function billDateInput(instant: string): string {
  const date = new Date(instant);
  if (!Number.isFinite(date.getTime())) return "";
  return `${String(date.getFullYear()).padStart(4, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function initialBillDueDate(now = new Date()): string {
  const next = new Date(now);
  next.setDate(next.getDate() + 7);
  return billDateInput(next.toISOString());
}

export function parseBillForm(input: BillFields): { value: BillPayload } | { error: BillFormError } {
  const title = input.title.trim();
  if (!title) return { error: "titleRequired" };
  if (title.length > 160) return { error: "titleTooLong" };
  const amount = Number(input.amount);
  if (!/^\d+$/.test(input.amount) || !Number.isSafeInteger(amount) || amount <= 0) return { error: "invalidAmount" };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.dueDate)) return { error: "invalidDate" };
  const date = new Date(`${input.dueDate}T12:00:00`);
  // Date normalizes invalid days (e.g. 31 February); compare the calendar fields.
  if (!Number.isFinite(date.getTime()) || billDateInput(date.toISOString()) !== input.dueDate) return { error: "invalidDate" };
  return { value: { title, amount, dueAt: date.toISOString() } };
}
