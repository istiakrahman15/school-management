import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Route access control by role
const roleRoutes: Record<string, string[]> = {
  "/dashboard/teachers": ["admin"],
  "/dashboard/fees": ["admin"],
  "/dashboard/reports": ["admin"],
  "/dashboard/transport": ["admin"],
  "/dashboard/hostel": ["admin"],
  "/dashboard/students": ["admin", "teacher"],
  "/dashboard/classes": ["admin", "teacher"],
  "/dashboard/attendance": ["admin", "teacher"],
  "/dashboard/exams": ["admin", "teacher", "student"],
  "/dashboard/notices": ["admin", "teacher", "student", "parent"],
  "/dashboard/library": ["admin", "teacher", "student"],
};

export default auth((req: NextRequest & { auth: { user?: { role?: string } } | null }) => {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (pathname === "/login" || pathname === "/" || pathname.startsWith("/_next") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Check authentication
  if (!req.auth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const userRole = req.auth.user?.role;

  // Check role-based access for specific routes
  for (const [route, allowedRoles] of Object.entries(roleRoutes)) {
    if (pathname.startsWith(route)) {
      if (!userRole || !allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
