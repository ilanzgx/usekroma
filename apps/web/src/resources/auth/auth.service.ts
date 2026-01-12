import { api } from "@/lib/api/client";
import { User } from "./auth.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getProfile() {
  const response = await api.get<User>("/users/me");
  return response.data;
}

export async function loginWithGoogle() {
  window.location.href = `${API_BASE_URL}/auth/google`;
}

export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch {}
  window.location.href = "/login";
}
