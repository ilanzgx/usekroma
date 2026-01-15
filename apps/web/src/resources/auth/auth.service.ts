"use server";

import { cookies } from "next/headers";
import { User } from "./auth.types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value ?? null;
}

export async function getGoogleAuthUrl(): Promise<string> {
  return `${BASE_URL}/auth/google`;
}

export async function getProfile(): Promise<User | null> {
  const token = await getToken();

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

export async function validateToken(): Promise<boolean> {
  const user = await getProfile();
  return user !== null;
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}
