"use client";

import { Menu, Bell, Search, LogOut, User, Settings } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar, Button, Badge } from "@/components/ui";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";

interface NavbarProps {
  onMenuClick: () => void;
  user?: {
    name: string;
    email: string;
    role: string;
    image?: string;
  };
  pageTitle?: string;
}

export function Navbar({ onMenuClick, user, pageTitle }: NavbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const roleColors: Record<string, string> = {
    admin: "info",
    teacher: "success",
    student: "warning",
    parent: "secondary",
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-card/80 backdrop-blur-sm px-4 lg:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Page title */}
      {pageTitle && (
        <div className="hidden md:block">
          <h1 className="font-display text-base font-semibold text-foreground">{pageTitle}</h1>
        </div>
      )}

      {/* Search */}
      <div className="flex-1 max-w-sm ml-auto mr-0 lg:ml-0 lg:mr-auto">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full h-8 rounded-lg bg-muted border-0 pl-8 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-10 z-50 w-80 rounded-xl border border-border bg-card shadow-lg overflow-hidden">
                <div className="p-4 border-b border-border">
                  <p className="font-semibold text-sm">Notifications</p>
                </div>
                <div className="divide-y divide-border max-h-64 overflow-y-auto">
                  {[
                    { msg: "Exam schedule for Class 10 published", time: "5m ago" },
                    { msg: "3 students have pending fees", time: "1h ago" },
                    { msg: "New teacher added: Mr. Rahman", time: "2h ago" },
                  ].map((n, i) => (
                    <div key={i} className="px-4 py-3 hover:bg-muted cursor-pointer">
                      <p className="text-sm text-foreground">{n.msg}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-muted transition-colors"
            >
              <Avatar
                src={user.image}
                fallback={getInitials(user.name)}
                size="sm"
                alt={user.name}
              />
              <div className="hidden md:block text-left">
                <p className="text-xs font-medium text-foreground leading-none">{user.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5 capitalize">{user.role}</p>
              </div>
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 top-11 z-50 w-52 rounded-xl border border-border bg-card shadow-lg overflow-hidden">
                  <div className="p-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Avatar src={user.image} fallback={getInitials(user.name)} size="md" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                        <Badge variant={roleColors[user.role] as "info" | "success" | "warning" | "secondary"} className="text-xs mt-0.5 capitalize">
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-1">
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <User className="h-3.5 w-3.5" />
                      Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <Settings className="h-3.5 w-3.5" />
                      Settings
                    </Link>
                    <div className="h-px bg-border my-1" />
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
