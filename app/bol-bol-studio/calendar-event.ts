import "server-only";

import { createHash } from "node:crypto";
import { DateTime } from "luxon";

/** One physical studio, one zone. A customer booking from Jakarta must not shift the slot. */
export const STUDIO_TIME_ZONE = "Asia/Makassar";

// ponytail: packages with duration 0/missing still get a visible block; the
// admin corrects the real length when confirming.
export const FALLBACK_DURATION_MINUTES = 15;

export const MAX_DAYS_AHEAD = 90;

/** Tolerates a customer clock that is a few minutes behind. */
const PAST_SKEW_MS = 5 * 60 * 1000;

export type SlotRejection = "invalid" | "past" | "too-far" | "closed";

export type CalendarEventInput = {
  startMs: number;
  durationMinutes: number;
  name: string;
  phone: string;
  instagram?: string;
  packageName: string;
  packageCapacity?: number;
  backgroundName?: string;
  note?: string;
  confirmed: boolean;
};

/** Digits only, so `0895-0316` and `+62 895 0316` hash to the same request. */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.replace(/^(?:62|0)/, "");
}

/**
 * Slot + caller identify the request, so re-confirming the same slot upserts
 * the same calendar entry instead of stacking duplicates. Hex digest is already
 * inside Google's `[a-v0-9]{5,1024}` event-id alphabet.
 */
export function eventIdFor(startMs: number, phone: string): string {
  return createHash("sha1").update(`${startMs}|${normalizePhone(phone)}`).digest("hex");
}

export function resolveDurationMinutes(rawDuration: unknown): number {
  const duration = Number(rawDuration);
  return Number.isFinite(duration) && duration > 0 ? duration : FALLBACK_DURATION_MINUTES;
}

export function validateSlot({
  startMs,
  durationMinutes,
  openMinutes,
  closeMinutes,
  nowMs,
}: {
  startMs: number;
  durationMinutes: number;
  openMinutes: number;
  closeMinutes: number;
  nowMs: number;
}): SlotRejection | null {
  if (!Number.isFinite(startMs) || !Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    return "invalid";
  }
  if (startMs < nowMs - PAST_SKEW_MS) return "past";
  if (startMs > nowMs + MAX_DAYS_AHEAD * 24 * 60 * 60 * 1000) return "too-far";

  const start = DateTime.fromMillis(startMs, { zone: STUDIO_TIME_ZONE });
  const startMinutes = start.hour * 60 + start.minute;
  if (startMinutes < openMinutes) return "closed";
  if (startMinutes + durationMinutes > closeMinutes) return "closed";

  return null;
}

/** Google Calendar `events` resource. No `attendees`: a service account cannot invite without domain-wide delegation. */
export function buildCalendarEvent(input: CalendarEventInput) {
  const start = DateTime.fromMillis(input.startMs, { zone: STUDIO_TIME_ZONE });
  const end = start.plus({ minutes: input.durationMinutes });

  const summary = input.confirmed
    ? `${input.name} — ${input.packageName}`
    : `[BELUM DIKONFIRMASI] ${input.name} — ${input.packageName}`;

  const description = [
    `Nama: ${input.name}`,
    `Telepon: ${input.phone}`,
    input.instagram ? `Instagram: ${input.instagram}` : null,
    `Paket: ${input.packageName}`,
    typeof input.packageCapacity === "number" ? `Kapasitas: ${input.packageCapacity} orang` : null,
    input.backgroundName ? `Latar: ${input.backgroundName}` : null,
    input.note ? `Catatan: ${input.note}` : null,
    input.confirmed ? null : "Belum dikonfirmasi admin — dibuat dari form booking.",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    id: eventIdFor(input.startMs, input.phone),
    summary,
    description,
    status: input.confirmed ? "confirmed" : "tentative",
    // 10 = Basil (green) for confirmed, 5 = Banana (yellow) for tentative.
    colorId: input.confirmed ? "10" : "5",
    start: { dateTime: start.toISO({ suppressMilliseconds: true }), timeZone: STUDIO_TIME_ZONE },
    end: { dateTime: end.toISO({ suppressMilliseconds: true }), timeZone: STUDIO_TIME_ZONE },
  };
}
