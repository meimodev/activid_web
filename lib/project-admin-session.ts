import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { getSessionSecret } from "@/lib/session-secret";

const COOKIE_NAME = "project_admin_session";
const TTL_SECONDS = 60 * 60 * 12;

export async function isProjectAdmin(): Promise<boolean> {
  const secret = getSessionSecret();
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!secret || !token) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), { algorithms: ["HS256"], audience: "project-admin" });
    return payload.role === "project-admin";
  } catch {
    return false;
  }
}

export async function setProjectAdminSession(): Promise<void> {
  const secret = getSessionSecret();
  if (!secret) throw new Error("Configure SESSION_SECRET with at least 32 characters.");
  const token = await new SignJWT({ role: "project-admin" })
    .setProtectedHeader({ alg: "HS256" }).setAudience("project-admin")
    .setIssuedAt().setExpirationTime(`${TTL_SECONDS}s`)
    .sign(new TextEncoder().encode(secret));
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/project", maxAge: TTL_SECONDS,
  });
}

export async function clearProjectAdminSession(): Promise<void> {
  (await cookies()).set(COOKIE_NAME, "", { path: "/project", maxAge: 0 });
}
