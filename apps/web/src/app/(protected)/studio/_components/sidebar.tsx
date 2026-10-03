"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ImageIcon, LayoutGridIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function StudioSidebar() {
  const pathname = usePathname();

  const isToolsActive =
    pathname === "/studio" ||
    (pathname.startsWith("/studio/") &&
      pathname !== "/studio/images" &&
      pathname !== "/studio/settings");
  const isImagesActive = pathname === "/studio/images";
  const isSettingsActive = pathname === "/studio/settings";

  return (
    <Sidebar collapsible="none" className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Área de Trabalho</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isToolsActive}>
                  <Link href="/studio">
                    <LayoutGridIcon />
                    <span>Ferramentas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isImagesActive}>
                  <Link href="/studio/images">
                    <ImageIcon />
                    <span>Imagens</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Configurações</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isSettingsActive}>
                  <Link href="/studio/settings">
                    <SettingsIcon />
                    <span>Preferências</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
