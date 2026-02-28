import type { InvitationTime } from "@/types/invitation";
import {
  formatInvitationDateLong as formatInvitationDateLongLuxon,
  formatInvitationMonthYear as formatInvitationMonthYearLuxon,
  formatInvitationTime as formatInvitationTimeLuxon,
  parseInvitationDateTime,
  toJsDate as toJsDateLuxon,
} from "@/lib/date-time";

/**
 * Normalizes and formats an Indonesian date string to "EEEE d MMMM yyyy".
 * Examples:
 * "24 Januari 2026" -> "Sabtu 24 Januari 2026"
 * "Sabtu, 31 Januari, 2026" -> "Sabtu 31 Januari 2026"
 */
export function formatIndonesianDate(dateStr: string): string {
  if (!dateStr) return dateStr;

  const dt = parseInvitationDateTime(dateStr);
  if (!dt) return dateStr;

  return dt.setLocale("id").toFormat("cccc d LLLL yyyy");
}

export function formatInvitationDateLong(value: unknown): string {
  return formatInvitationDateLongLuxon(value);
}

export function formatInvitationMonthYear(value: unknown): string {
  return formatInvitationMonthYearLuxon(value);
}

export function formatInvitationTime(value: InvitationTime | null | undefined | unknown): string {
  return formatInvitationTimeLuxon(value);
}

export function toJsDate(value: unknown): Date {
  return toJsDateLuxon(value);
}
