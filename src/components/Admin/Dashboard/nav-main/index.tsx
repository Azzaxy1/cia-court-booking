"use client";

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
    url?: string;
    icon?: React.ElementType;
    onClick?: () => void;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            {item.title === "Keluar" ? (
              <SidebarMenuButton
                onClick={() => {
                  if (item.onClick) item.onClick();
                }}
                className="text-white text-sm sm:text-base 2xl:text-lg w-full flex items-center gap-2"
              >
                {item.icon && <item.icon />} {item.title}
              </SidebarMenuButton>
            ) : (
              <Link
                href={item.url || "#"}
                className={`flex items-center text-white gap-2 w-full ${
                  pathname === item.url
                    ? "bg-[#159aac] rounded-sm"
                    : "text-gray-500"
                }`}
              >
                <SidebarMenuButton className="text-white text-sm sm:text-base 2xl:text-lg w-full">
                  {item.icon && <item.icon />} {item.title}
                </SidebarMenuButton>
              </Link>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
