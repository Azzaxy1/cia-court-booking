"use client";

import React from "react";
import { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  const pathname = usePathname();

  useEffect(() => {
    Aos.init({
      duration: 800,
      once: true,
    });
  }, []);

  const hideNavbarFooter = [
    "/login",
    "/register",
    "/admin/login",
    "/admin/dashboard",
    "/admin/lapangan",
    "/admin/pemesanan",
    "/admin/pemasukan",
  ].includes(pathname);

  return (
    <QueryClientProvider client={queryClient}>
      {!hideNavbarFooter && <Navbar />}
      {children}
      {!hideNavbarFooter && <Footer />}
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
};

export default ClientProvider;
