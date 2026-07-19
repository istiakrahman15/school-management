"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, GraduationCap, Users, BookOpen,
  CalendarCheck, ClipboardList, CreditCard, Bell,
  Library, Bus, Building2, BarChart3, Settings,
  ChevronLeft, ChevronRight, School, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, GraduationCap, Users, BookOpen,
  CalendarCheck, ClipboardList, CreditCard, Bell,
  Library, Bus, Building2, BarChart3, Settings,
};

interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { title: "Students", href: "/dashboard/students", icon: "GraduationCap" },
  { title: "Teachers", href: "/dashboard/teachers", icon: "Users" },
  { title: "Classes", href: "/dashboard/classes", icon: "BookOpen" },
  { title: "Attendance", href: "/dashboard/attendance", icon: "CalendarCheck" },
  { title: "Exams", href: "/dashboard/exams", icon: "ClipboardList" },
  { title: "Fees", href: "/dashboard/fees", icon: "CreditCard" },
  { title: "Notices", href: "/dashboard/notices", icon: "Bell" },
  { title: "Library", href: "/dashboard/library", icon: "Library" },
  { title: "Transport", href: "/dashboard/transport", icon: "Bus" },
  { title: "Hostel", href: "/dashboard/hostel", icon: "Building2" },
  { title: "Reports", href: "/dashboard/reports", icon: "BarChart3" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-4 border-b border-sidebar-border",
        collapsed && "justify-center px-2"
      )}>
        <div className="h-9 w-9 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0 shadow-lg">
          <School className="h-5 w-5 text-white" />
        </div>
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              <p className="font-display font-bold text-sm text-foreground leading-none">{APP_NAME}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Admin Panel</p>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Mobile close */}
        {onMobileClose && (
          <button onClick={onMobileClose} className="ml-auto p-1 rounded-md hover:bg-muted text-muted-foreground lg:hidden">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <Icon className={cn(
                "h-4.5 w-4.5 flex-shrink-0 relative z-10",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )} />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="relative z-10 flex-1"
                  >
                    {item.title}
                  </motion.span>
                )}
              </AnimatePresence>
              {item.badge && !collapsed && (
                <span className="ml-auto text-xs bg-primary text-white rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom - Settings + Collapse */}
      <div className="border-t border-sidebar-border p-2 space-y-0.5">
        <Link
          href="/dashboard/settings"
          onClick={onMobileClose}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
            collapsed && "justify-center px-2"
          )}
        >
          <Settings className="h-4.5 w-4.5 flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>

        {/* Collapse toggle - desktop only */}
        <button
          onClick={onToggle}
          className={cn(
            "hidden lg:flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
            collapsed && "justify-center px-2"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="hidden lg:flex flex-col h-full bg-card border-r border-sidebar-border overflow-hidden flex-shrink-0"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-[260px] flex flex-col bg-card border-r border-sidebar-border shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
