import StudioHeader from "./_components/header";
import StudioSidebar from "./_components/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getProfile } from "@/resources/auth";
import { UserProvider } from "@/contexts/user-context";
import { redirect } from "next/navigation";

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getProfile();

  if (!user) {
    redirect("/login?error=session_expired");
  }

  return (
    <UserProvider user={user}>
      <div className="flex h-screen flex-col overflow-hidden">
        <StudioHeader />
        <SidebarProvider defaultOpen>
          <div className="flex flex-1 overflow-hidden">
            <StudioSidebar />
            <SidebarInset className="h-full">
              <main className="h-full overflow-auto p-6 pb-24">{children}</main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </UserProvider>
  );
}
