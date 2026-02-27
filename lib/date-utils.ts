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
