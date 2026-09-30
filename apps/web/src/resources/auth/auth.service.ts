"use server";

import { cookies } from "next/headers";
import { User } from "@/resources/user/user.types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
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
export async function getProfile(): Promise<User | null> {
  const token = await getToken();

  if (!token) {
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
 * validate token from cookie
 * @export
 * @return {*}  {Promise<boolean>}
 */
export async function validateToken(): Promise<boolean> {
  const user = await getProfile();
  return user !== null;
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
