"use server";

import { revalidatePath } from "next/cache";

import { getAdminDb } from "@/lib/firebase-admin";

import { BB_FIRESTORE, StudioBooking, startOfDay, withMinutesSinceMidnight } from "./shared";
import { verifyBolBolAdmin } from "./server";

type AdminAuth = {
  phone: string;
  pin: string;
};

type ActionState = {
  ok?: boolean;
  error?: string;
};

export type CreateBookingInput = {
  auth: AdminAuth;
  bookingDateIso: string;
  startMinutes: number;
  endMinutes: number;
  name: string;
  phone: string;
  note: string;
  packageName: string;
};

export type CreateBookingResult = ActionState & {
  booking?: StudioBooking;
};

export async function createBolBolBooking(input: CreateBookingInput): Promise<CreateBookingResult> {
  const isAdmin = await verifyBolBolAdmin(input.auth.phone, input.auth.pin);
  if (!isAdmin) {
    return { error: "Admin access diperlukan untuk menambah booking." };
  }

  if (!input.bookingDateIso) {
    return { error: "Tanggal booking wajib diisi." };
  }

  if (input.endMinutes <= input.startMinutes) {
    return { error: "Jam selesai harus lebih besar dari jam mulai." };
  }

  const selectedDate = startOfDay(new Date(input.bookingDateIso));
  if (Number.isNaN(selectedDate.getTime())) {
    return { error: "Tanggal booking tidak valid." };
  }

  const start = withMinutesSinceMidnight(selectedDate, input.startMinutes);
  const end = withMinutesSinceMidnight(selectedDate, input.endMinutes);

  const payload = {
    start,
    end,
    name: input.name.trim(),
    phone: input.phone.trim(),
    note: input.note.trim(),
    booking_timestamp: selectedDate,
    package: input.packageName.trim(),
  };

  try {
    const db = getAdminDb();
    const ref = await db.collection(BB_FIRESTORE.BOOKINGS_COLLECTION).add(payload);

    revalidatePath("/bol-bol-studio");

    return {
      ok: true,
      booking: {
        id: ref.id,
        startMs: start.getTime(),
        endMs: end.getTime(),
        bookingTimestampMs: selectedDate.getTime(),
        name: payload.name || "Tanpa nama",
        phone: payload.phone,
        note: payload.note,
        package: payload.package,
      },
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Gagal menambah booking.",
    };
  }
}

export async function deleteBolBolBooking(input: {
  auth: AdminAuth;
  bookingId: string;
}): Promise<ActionState> {
  const isAdmin = await verifyBolBolAdmin(input.auth.phone, input.auth.pin);
  if (!isAdmin) {
    return { error: "Admin access diperlukan untuk menghapus booking." };
  }

  if (!input.bookingId.trim()) {
    return { error: "ID booking tidak valid." };
  }

  try {
    const db = getAdminDb();
    await db.collection(BB_FIRESTORE.BOOKINGS_COLLECTION).doc(input.bookingId.trim()).delete();

    revalidatePath("/bol-bol-studio");

    return { ok: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Gagal menghapus booking.",
    };
  }
}
