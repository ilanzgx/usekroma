"use client";

import { getProfile, logout, User } from "@/resources/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StudioPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    getProfile().then(setUser);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div>
      <h1>Studio</h1>
      {user && (
        <div>
          <img src={user.avatarUrl} alt="" />
          <p>{user.id}</p>
          <p>{user.name}</p>
          <p>{user.email}</p>
          <p>{user.createdAt}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}
