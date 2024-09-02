"use client";

import { useState } from "react";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/spinner";
import { SearchCommand } from "@/components/search-command";
import { SettingsModal } from "@/components/modals/settings-modal";
import { Navigation } from "./_components/navigation";
import { useAuthStore } from "../store";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return redirect("/");
  }
  return (
    <div className="h-full flex dark:bg-[#1F1F1F]">
      <SettingsModal isOpen={isSettingsOpen} setIsOpen={setIsSettingsOpen} />
      <Navigation
        setIsSearchOpen={setIsSearchOpen}
        setIsSettingsOpen={setIsSettingsOpen}
      />
      <main className="flex-1 h-full overflow-y-auto">
        <SearchCommand isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
