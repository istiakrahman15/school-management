"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { usePathname } from "next/navigation";

// Page title map
const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/students": "Student Management",
  "/dashboard/teachers": "Teacher Management",
  "/dashboard/classes": "Class Management",
  "/dashboard/attendance": "Attendance",
  "/dashboard/exams": "Exams & Results",
  "/dashboard/fees": "Fee Management",
  "/dashboard/notices": "Notice Board",
  "/dashboard/library": "Library",
  "/dashboard/transport": "Transport",
  "/dashboard/hostel": "Hostel",
  "/dashboard/reports": "Reports",
  "/dashboard/settings": "Settings",
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  const pageTitle = Object.entries(pageTitles).find(([path]) =>
    pathname === path || pathname.startsWith(path + "/")
  )?.[1] ?? "Dashboard";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Navbar
          onMenuClick={() => setMobileOpen(true)}
          pageTitle={pageTitle}
          user={session?.user ? {
            name: session.user.name ?? "User",
            email: session.user.email ?? "",
            role: session.user.role ?? "admin",
            image: session.user.image ?? undefined,
          } : undefined}
        />

        <main className="flex-1 overflow-y-auto pb-20 lg:pb-6">
          <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
