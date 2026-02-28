import { parseInvitationDateTime } from "@/lib/date-time";

const dates = [
  "24 Januari 2026",
  "Sabtu, 31 Januari, 2026",
  "Senin, 30 Desember 2024",
  "Senin, 21 Januari 2026",
  "Sabtu, 10 Oktober 2026"
];

function formatDate(dateStr: string) {
  const dt = parseInvitationDateTime(dateStr);
  if (!dt) return dateStr;
  return dt.setLocale("id").toFormat("cccc d LLLL yyyy");
}

dates.forEach(d => console.log(d, "->", formatDate(d)));
