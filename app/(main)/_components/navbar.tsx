"use client";

import { useParams } from "next/navigation";
import { useSearchQuery } from "@/hooks/use-search-query";
import { MenuIcon } from "lucide-react";
import { Title } from "./title";
import { Banner } from "./banner";
import { Menu } from "./menu";
import { Publish } from "./publish";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

export const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
  const params = useParams();
  const { documents } = useSearchQuery(params.documentId as string);
  const byIdDocument = documents.data;

  if (!byIdDocument || !byIdDocument[0]) {
    return (
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center justify-between">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    );
  }

  return (
    <div data-testid="navbar">
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="h-6 w-6 text-muted-foreground"
            data-testid="menu icon"
          />
        )}
        <div className="flex items-center justify-between w-full">
          <Title initialData={byIdDocument[0]} />
          <div className="flex items-center gap-x-2">
            <Publish initialData={byIdDocument[0]} />
            <Menu documentId={byIdDocument[0].id} />
          </div>
        </div>
      </nav>
      {byIdDocument[0].is_archived && (
        <Banner documentId={byIdDocument[0].id} />
      )}
    </div>
  );
};
