"use server";

import { cookies } from "next/headers";
import { User } from "@/resources/user/user.types";
import { verifySessionToken } from "@/lib/jwt";

const rawApiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:18080/v1";
const API_URL = rawApiUrl.endsWith("/v1") ? rawApiUrl : `${rawApiUrl.replace(/\/+$/, "")}/v1`;

/**
 * getToken
 * get token from cookie
 * @export
 * @return {*}  {(Promise<string | null>)}
 */
export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value ?? null;
}

/**
 * getGoogleAuthUrl
 * get google auth url
 * @export
 * @return {*}  {Promise<string>}
 */
export async function getGoogleAuthUrl(): Promise<string> {
  return `${API_URL}/auth/google`;
}

/**
 * GetProfile
 * get user profile from API using token
 * @export
 * @return {*}  {(Promise<User | null>)}
 */
export async function getProfile(customToken?: string): Promise<User | null> {
  const token = customToken ?? (await getToken());

  if (!token) {
    return null;
  }

  const session = await verifySessionToken(token);
  if (!session) {
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/users/me`, {
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

/**
 * validateToken
 * validate token from cookie or argument using local cryptographic verification
 * @export
 * @return {*}  {Promise<boolean>}
 */
export async function validateToken(customToken?: string): Promise<boolean> {
  const token = customToken ?? (await getToken());
  if (!token) return false;
  const session = await verifySessionToken(token);
  return session !== null;
}

/**
 * logout
 * logout user and delete token from cookie
 * @export
 * @return {*}  {Promise<void>}
 */
export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}
