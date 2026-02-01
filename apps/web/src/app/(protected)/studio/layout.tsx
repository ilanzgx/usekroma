import StudioHeader from "./_components/header";
import StudioSidebar from "./_components/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
  );
}
