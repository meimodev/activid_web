import type { InvitationDate, InvitationDateTime, InvitationTime } from "@/types/invitation";
import { parse, format } from "date-fns";
import { id } from "date-fns/locale";

/**
 * Normalizes and formats an Indonesian date string to "EEEE d MMMM yyyy".
 * Examples:
 * "24 Januari 2026" -> "Sabtu 24 Januari 2026"
 * "Sabtu, 31 Januari, 2026" -> "Sabtu 31 Januari 2026"
 */
export function formatIndonesianDate(dateStr: string): string {
  if (!dateStr) return dateStr;
  
  const cleanStr = dateStr.replace(/,/g, '').replace(/\s+/g, ' ').trim();
  const parts = cleanStr.split(' ');
  
  let dateObj: Date;
  
  // Try to parse based on format: "d MMMM yyyy" or "EEEE d MMMM yyyy"
  if (parts.length === 3) {
    dateObj = parse(cleanStr, "d MMMM yyyy", new Date(), { locale: id });
  } else if (parts.length === 4) {
    dateObj = parse(cleanStr, "EEEE d MMMM yyyy", new Date(), { locale: id });
  } else {
    // If it doesn't match expected patterns, try to just return as is
    return dateStr;
  }
  
  // If parsing failed, return original
  if (isNaN(dateObj.getTime())) return dateStr;
  
  return format(dateObj, "EEEE d MMMM yyyy", { locale: id });
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function isInt(value: unknown): value is number {
  return Number.isInteger(value);
}

function isValidInvitationDate(value: InvitationDate): boolean {
  if (!value || typeof value !== "object") return false;
  if (!isInt(value.year) || value.year < 1900) return false;
  if (!isInt(value.month) || value.month < 1 || value.month > 12) return false;
  if (!isInt(value.day) || value.day < 1 || value.day > 31) return false;
  const dt = new Date(value.year, value.month - 1, value.day);
  return (
    dt.getFullYear() === value.year &&
    dt.getMonth() === value.month - 1 &&
    dt.getDate() === value.day
  );
}

function normalizeInvitationDateTime(value: unknown): InvitationDateTime | null {
  if (!value) return null;

  if (typeof value === "string") {
    const raw = value.trim();
    if (!raw) return null;

    const isoMatch = raw.match(
      /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{1,2}):(\d{1,2})(?::(\d{2}))?)?/,
    );
    if (isoMatch) {
      const year = Number(isoMatch[1]);
      const month = Number(isoMatch[2]);
      const day = Number(isoMatch[3]);
      const hour = isoMatch[4] ? Number(isoMatch[4]) : 0;
      const minute = isoMatch[5] ? Number(isoMatch[5]) : 0;
      const date: InvitationDate = { year, month, day };
      const time: InvitationTime = { hour, minute };
      if (!isValidInvitationDate(date)) return null;
      if (!isInt(time.hour) || time.hour < 0 || time.hour > 23) return null;
      if (!isInt(time.minute) || time.minute < 0 || time.minute > 59) return null;
      return { date, time };
    }

    const cleaned = raw.replace(/,/g, "").replace(/\s+/g, " ").trim();

    const parsedShort = parse(cleaned, "d MMMM yyyy", new Date(), { locale: id });
    const parsedLong = parse(cleaned, "EEEE d MMMM yyyy", new Date(), { locale: id });
    const parsed = !Number.isNaN(parsedShort.getTime()) ? parsedShort : parsedLong;

    if (Number.isNaN(parsed.getTime())) return null;

    const date: InvitationDate = {
      year: parsed.getFullYear(),
      month: parsed.getMonth() + 1,
      day: parsed.getDate(),
    };

    if (!isValidInvitationDate(date)) return null;
    return { date, time: { hour: 0, minute: 0 } };
  }

  if (typeof value !== "object") return null;

  const v = value as {
    date?: { year?: unknown; month?: unknown; day?: unknown };
    time?: { hour?: unknown; minute?: unknown };
    year?: unknown;
    month?: unknown;
    day?: unknown;
    hour?: unknown;
    minute?: unknown;
  };

  const nestedDate = v.date;
  const year = isInt(nestedDate?.year) ? nestedDate.year : isInt(v.year) ? v.year : null;
  const month = isInt(nestedDate?.month) ? nestedDate.month : isInt(v.month) ? v.month : null;
  const day = isInt(nestedDate?.day) ? nestedDate.day : isInt(v.day) ? v.day : null;
  if (!year || !month || !day) return null;

  const date: InvitationDate = { year, month, day };
  if (!isValidInvitationDate(date)) return null;

  const nestedTime = v.time;
  const hour = isInt(nestedTime?.hour) ? nestedTime.hour : isInt(v.hour) ? v.hour : 0;
  const minute = isInt(nestedTime?.minute)
    ? nestedTime.minute
    : isInt(v.minute)
      ? v.minute
      : 0;

  if (!isInt(hour) || hour < 0 || hour > 23) return null;
  if (!isInt(minute) || minute < 0 || minute > 59) return null;

  return { date, time: { hour, minute } };
}

export function formatInvitationDateLong(value: InvitationDateTime | null | undefined): string {
  const normalized = normalizeInvitationDateTime(value);
  if (!normalized) return typeof value === "string" ? value : "";
  const dt = new Date(
    normalized.date.year,
    normalized.date.month - 1,
    normalized.date.day,
  );
  return format(dt, "EEEE d MMMM yyyy", { locale: id });
}

export function formatInvitationMonthYear(value: InvitationDateTime | null | undefined): string {
  const normalized = normalizeInvitationDateTime(value);
  if (!normalized) return typeof value === "string" ? value : "";
  const dt = new Date(
    normalized.date.year,
    normalized.date.month - 1,
    normalized.date.day,
  );
  return format(dt, "MMMM yyyy", { locale: id });
}

export function formatInvitationTime(value: InvitationTime | null | undefined): string {
  if (!value || typeof value !== "object") return "00:00";
  const v = value as { hour?: unknown; minute?: unknown };
  const hour = isInt(v.hour) ? v.hour : 0;
  const minute = isInt(v.minute) ? v.minute : 0;
  return `${pad2(hour)}:${pad2(minute)}`;
}

export function toJsDate(value: InvitationDateTime | null | undefined): Date {
  const normalized = normalizeInvitationDateTime(value);
  if (!normalized) return new Date(0);
  return new Date(
    normalized.date.year,
    normalized.date.month - 1,
    normalized.date.day,
    normalized.time.hour,
    normalized.time.minute,
    0,
    0,
  );
}
