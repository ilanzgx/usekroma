"use client";

import { getProfile, logout, User } from "@/resources/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudioHeader from "./_components/header";
import StudioSidebar from "./_components/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function StudioPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    getProfile().then((response) => {
      // console.log(response);
      setUser(response);
    });
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <StudioHeader />
      <SidebarProvider defaultOpen>
        <div className="flex flex-1 overflow-hidden">
          <StudioSidebar />
          <SidebarInset className="h-full">
            <main className="h-full overflow-auto p-6">
              <h1 className="text-3xl font-bold mb-6">Studio</h1>
              {user && (
                <div className="space-y-2">
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="size-20 rounded-full"
                  />
                  <p>ID: {user.id}</p>
                  <p>Name: {user.name}</p>
                  <p>Email: {user.email}</p>
                  <p>
                    Created: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="mt-4 rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
