"use client";

import { createContext, useContext } from "react";
import type { User } from "@/resources/user";

interface UserContextValue {
  user: User | null;
}

const UserContext = createContext<UserContextValue>({ user: null });

export function UserProvider({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
