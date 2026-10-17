import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";

export function getAdminPassword(): string | null {
  return process.env.ADMIN_PASSWORD || null;
}

export function matchesAdminPassword(value: unknown): boolean {
  const expected = getAdminPassword();
  if (!expected || typeof value !== "string") return false;
  const hash = (password: string) => createHash("sha256").update(password).digest();
  return timingSafeEqual(hash(value), hash(expected));
}
