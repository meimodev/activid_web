const ID_LOCALE = "id-ID";

export function padTime(value: number): string {
  return value.toString().padStart(2, "0");
}

export function formatTime(date: Date): string {
  return `${padTime(date.getHours())}:${padTime(date.getMinutes())}`;
}

export function formatDateInputValue(date: Date): string {
  return `${date.getFullYear()}-${padTime(date.getMonth() + 1)}-${padTime(date.getDate())}`;
}

export function parseDateInputValue(value: string): Date | null {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return null;
  }
  return new Date(year, month - 1, day);
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function setDateOfMonth(date: Date, day: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), day);
}

export function daysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function dayOfWeek(date: Date): number {
  return date.getDay();
}

export function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function formatMonth(date: Date): string {
  return new Intl.DateTimeFormat(ID_LOCALE, { month: "long" }).format(date);
}

export function formatYear(date: Date): string {
  return String(date.getFullYear());
}

export function formatLongDate(date: Date): string {
  return new Intl.DateTimeFormat(ID_LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function fromMinutes(minutes: number, baseDate = new Date()): Date {
  const next = new Date(baseDate);
  next.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return next;
}

export function withStartOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}
