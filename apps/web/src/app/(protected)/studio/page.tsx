"use client";

import { getProfile, logout, User } from "@/resources/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudioHeader from "./_components/header";
import StudioSidebar from "./_components/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ToolsSection from "./_components/tools-section";
import EditorSection from "./_components/editor-section";

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
            <main className="h-full overflow-auto p-6 pb-24">
              <ToolsSection />
              <EditorSection />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
