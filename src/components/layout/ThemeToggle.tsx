"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div className={cn("flex items-center gap-1 rounded-lg bg-muted p-1", className)}>
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "rounded-md p-1.5 text-muted-foreground transition-all",
          theme === "light" && "bg-background text-foreground shadow-sm"
        )}
        title="Light mode"
      >
        <Sun className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "rounded-md p-1.5 text-muted-foreground transition-all",
          theme === "dark" && "bg-background text-foreground shadow-sm"
        )}
        title="Dark mode"
      >
        <Moon className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={cn(
          "rounded-md p-1.5 text-muted-foreground transition-all",
          theme === "system" && "bg-background text-foreground shadow-sm"
        )}
        title="System theme"
      >
        <Monitor className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
