"use client";

import React from "react";
import { AppSidebar } from "@/components/Admin/Dashboard/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Footer from "@/components/Admin/Footer";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const path = pathname.split("/").pop();

  const pageTitles: Record<string, string> = {
    dashboard: "Dashboard",
    lapangan: "Kelola Lapangan",
    jadwal: "Kelola Jadwal",
    pemesanan: "Kelola Pemesanan",
    pemasukan: "Kelola Pemasukan",
  };

  const currentPage = pageTitles[path ?? ""] || "Admin";

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Admin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentPage}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="flex flex-col gap-4 p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
      <Footer />
    </>
  );
};

export default AdminLayout;
