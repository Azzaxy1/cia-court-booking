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
import { PiCourtBasketballDuotone } from "react-icons/pi";
import { MdHome } from "react-icons/md";
import { IoCart } from "react-icons/io5";
import { FaMoneyBillWave } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import Image from "next/image";
import { images } from "@/assets";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: MdHome,
    },
    {
      title: "Lapangan",
      url: "/admin/lapangan",
      icon: PiCourtBasketballDuotone,
    },
    {
      title: "Pemesanan",
      url: "/admin/pemesanan",
      icon: IoCart,
    },
    {
      title: "Pemasukan",
      url: "/admin/pemasukan",
      icon: FaMoneyBillWave,
    },
    {
      title: "Keluar",
      url: "/admin/login",
      icon: BiLogOut,
    },
  ],
};

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
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
