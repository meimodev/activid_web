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

export function formatInvitationDateLong(value: InvitationDateTime): string {
  const dt = new Date(value.date.year, value.date.month - 1, value.date.day);
  return format(dt, "EEEE d MMMM yyyy", { locale: id });
}

export function formatInvitationMonthYear(value: InvitationDateTime): string {
  const dt = new Date(value.date.year, value.date.month - 1, value.date.day);
  return format(dt, "MMMM yyyy", { locale: id });
}

export function formatInvitationTime(value: InvitationTime): string {
  return `${pad2(value.hour)}:${pad2(value.minute)}`;
}

export function toJsDate(value: InvitationDateTime): Date {
  return new Date(
    value.date.year,
    value.date.month - 1,
    value.date.day,
    value.time.hour,
    value.time.minute,
    0,
    0,
  );
}
