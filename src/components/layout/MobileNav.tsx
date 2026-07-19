"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, GraduationCap, Users,
  CalendarCheck, Bell, CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Students", href: "/dashboard/students", icon: GraduationCap },
  { title: "Attendance", href: "/dashboard/attendance", icon: CalendarCheck },
  { title: "Fees", href: "/dashboard/fees", icon: CreditCard },
  { title: "Notices", href: "/dashboard/notices", icon: Bell },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 flex items-center justify-around h-16 bg-card/90 backdrop-blur-md border-t border-border bottom-nav">
      {mobileNavItems.map(({ title, href, icon: Icon }) => {
        const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className={cn("h-5 w-5 transition-transform", isActive && "scale-110")} />
            <span className="text-[10px] font-medium">{title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
