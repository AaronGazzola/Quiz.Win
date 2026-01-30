"use client";

import { useEffect } from "react";
import { MainNav } from "@/components/navigation/main-nav";
import { useCurrentUser } from "@/app/layout.hooks";
import { useThemeStore } from "@/app/layout.stores";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const { isLoading } = useCurrentUser();
  const { isDark } = useThemeStore();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav isLoading={isLoading} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
