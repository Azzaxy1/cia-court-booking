"use client";

import React from "react";
import { useEffect, useState } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    Aos.init({
      duration: 800,
      once: true,
    });
  }, []);

  const hideNavbarFooter = ["/login", "/register", "/admin"].some((path) =>
    pathname.startsWith(path)
  );

  if (!mounted) {
    return null;
  }

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {!hideNavbarFooter && <Navbar />}
        {children}
        {!hideNavbarFooter && <Footer />}
        <Toaster position="top-right" />
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default ClientProvider;
