"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Calendar, Home, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDarkMode } from "@/contexts/dark-mode-context";

export function Navigation() {
  const pathname = usePathname();
  const { isDark, toggleDark } = useDarkMode();

  return (
    <nav className="border-b bg-white/80 dark:bg-zinc-950/90 backdrop-blur-sm sticky top-0 z-50 border-slate-200 dark:border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-xl font-bold text-slate-900 dark:text-zinc-50"
            >
              Lists
            </Link>
            <div className="flex space-x-4">
              <Link
                href="/"
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === "/"
                    ? "bg-slate-100 dark:bg-zinc-900 text-slate-900 dark:text-zinc-50"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-50 dark:hover:bg-zinc-900",
                )}
              >
                <Home className="w-4 h-4" />
                <span>All Lists</span>
              </Link>
              <Link
                href="/due"
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === "/due"
                    ? "bg-slate-100 dark:bg-zinc-900 text-slate-900 dark:text-zinc-50"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-50 dark:hover:bg-zinc-900",
                )}
              >
                <Calendar className="w-4 h-4" />
                <span>Due Dates</span>
              </Link>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDark}
            className="h-9 w-9 p-0 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-50 dark:hover:bg-zinc-900"
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
}
