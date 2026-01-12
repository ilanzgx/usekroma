"use client";
import { getProfile, logout, User } from "@/resources/auth";
import { useEffect, useState } from "react";

export default function StudioPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getProfile()
      .then(setUser)
      .catch(() => {
        // notificar que pode criar uma conta (toast)
      });
  }, []);

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
          <button onClick={() => logout()}>Logout</button>
        </div>
      )}
    </div>
  );
}
