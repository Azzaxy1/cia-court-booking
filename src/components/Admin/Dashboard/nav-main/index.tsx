"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ElementType;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <DropdownMenu key={item.title}>
            <SidebarMenuItem>
              <DropdownMenuTrigger asChild>
                <Link
                  href={item.url}
                  className={`flex items-center text-white gap-2 w-full ${
                    pathname === item.url
                      ? "bg-[#159aac] rounded-sm"
                      : "text-gray-500"
                  }`}
                >
                  <SidebarMenuButton className="text-white w-full">
                    {item.icon && <item.icon />} {item.title}
                  </SidebarMenuButton>
                </Link>
              </DropdownMenuTrigger>
            </SidebarMenuItem>
          </DropdownMenu>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
