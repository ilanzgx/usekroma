import { api } from "@/lib/api/client";
import { User } from "./auth.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const authService = {
  getMe: async (): Promise<User> => {
    const { data } = await api.get<User>("/auth/me");
    return data;
  },

  loginWithGoogle: () => {
    window.location.href = `${API_URL}/v1/auth/google`;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    window.location.href = "/login";
  },
};
