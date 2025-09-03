import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const role = req.nextauth.token?.role;
    const pathname = req.nextUrl.pathname;

    // Daftar path yang dikecualikan dari system protection
    // const excludedPaths = [
    //   '/api/system-protection', // API untuk cek status proteksi
    //   '/api/check-protection', // API internal untuk cek proteksi
    //   '/system-expired', // Halaman khusus untuk sistem expired
    //   '/favicon.ico',
    //   '/_next',
    //   '/api/auth' // NextAuth paths
    // ];

    // // Cek apakah path dikecualikan
    // const isExcluded = excludedPaths.some(path => pathname.startsWith(path));

    // // System Protection Check - hanya jika bukan path yang dikecualikan
    // if (!isExcluded) {
    //   try {
    //     // Fetch system protection status dari API internal
    //     const baseUrl = req.nextUrl.origin;
    //     const response = await fetch(`${baseUrl}/api/check-protection`, {
    //       method: 'GET',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //     });

    //     if (response.ok) {
    //       const protectionStatus = await response.json();

    //       if (protectionStatus.isExpired) {
    //         // Redirect ke halaman expired jika sistem expired
    //         if (pathname !== '/system-expired') {
    //           return NextResponse.redirect(new URL('/system-expired', req.url));
    //         }
    //       }
    //     } else {
    //       // Jika API gagal, untuk keamanan redirect ke expired
    //       if (pathname !== '/system-expired') {
    //         return NextResponse.redirect(new URL('/system-expired', req.url));
    //       }
    //     }
    //   } catch (error) {
    //     console.error('System protection check failed:', error);
    //     // Jika gagal cek proteksi, redirect ke halaman expired untuk keamanan
    //     if (pathname !== '/system-expired') {
    //       return NextResponse.redirect(new URL('/system-expired', req.url));
    //     }
    //   }
    // }

    // Role-based protection (existing logic)
    if (
      pathname.startsWith("/admin") &&
      pathname !== "/admin/login" &&
      role !== "OWNER" &&
      role !== "CASHIER"
    ) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    if (pathname.startsWith("/profile") && role !== "CUSTOMER") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)", // Apply to all routes except static files
  ],
};
