import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "../nav-main";
import Image from "next/image";
import { images } from "@/assets";
import { navAdmin } from "@/constants/navmenu";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} collapsible="icon" className="bg-sidebar-primary">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="w-full mx-auto flex items-center justify-center">
            <Image src={images.LogoWhite} alt="logo" width={50} height={50} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navAdmin} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
