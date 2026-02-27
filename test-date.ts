import { parse, format } from "date-fns";
import { id } from "date-fns/locale";

const dates = [
  "24 Januari 2026",
  "Sabtu, 31 Januari, 2026",
  "Senin, 30 Desember 2024",
  "Senin, 21 Januari 2026",
  "Sabtu, 10 Oktober 2026"
];

function formatDate(dateStr: string) {
  const cleanStr = dateStr.replace(/,/g, '').replace(/\s+/g, ' ').trim();
  // e.g. "Sabtu 31 Januari 2026" or "24 Januari 2026"
  const parts = cleanStr.split(' ');
  let dateObj: Date;
  if (parts.length === 3) {
    dateObj = parse(cleanStr, "d MMMM yyyy", new Date(), { locale: id });
  } else if (parts.length === 4) {
    dateObj = parse(cleanStr, "EEEE d MMMM yyyy", new Date(), { locale: id });
  } else {
    return dateStr;
  }
  
  if (isNaN(dateObj.getTime())) return dateStr;
  
  return format(dateObj, "EEEE d MMMM yyyy", { locale: id });
}

dates.forEach(d => console.log(d, "->", formatDate(d)));
