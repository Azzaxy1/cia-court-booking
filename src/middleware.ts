import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;
    const pathname = req.nextUrl.pathname;

    if (
      pathname.startsWith("/admin") &&
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
    "/admin/lapangan",
    "/admin/dashboard",
    "/admin/pemasukan",
    "/profile",
  ],
};
