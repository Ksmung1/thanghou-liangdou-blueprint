import { createHash } from "node:crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "investment-admin-access";

function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error("Missing required environment variable: ADMIN_PASSWORD");
  }

  return password;
}

function getAdminToken(): string {
  return createHash("sha256")
    .update(`investment-admin:${getAdminPassword()}`)
    .digest("hex");
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE_NAME)?.value === getAdminToken();
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  return password === getAdminPassword();
}

export async function createAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, getAdminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
