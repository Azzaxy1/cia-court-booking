import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;
    const pathname = req.nextUrl.pathname;

    console.log("Role:", role);
    console.log("Token:", req.nextauth.token);
    console.log("Pathname:", pathname);

    if (
      pathname.startsWith("/admin") &&
      role !== "owner" &&
      role !== "cashier"
    ) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    if (pathname.startsWith("/profile") && role !== "customer") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // ← penting: biar gak auto redirect ke /api/auth/signin
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
