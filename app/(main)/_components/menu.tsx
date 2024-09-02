"use client";

import { useRouter } from "next/navigation";
import { useDocumentsMutate } from "@/hooks/use-documents-mutate";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/app/store";

interface MenuProps {
  documentId: number;
}

export const Menu = ({ documentId }: MenuProps) => {
  const router = useRouter();
  const { user } = useAuthStore();

  const { archive } = useDocumentsMutate();

  const onArchive = () => {
    archive(documentId);
    router.push("/documents");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost" data-testid="menu trigger">
          <MoreHorizontal className="h-4 w-4"></MoreHorizontal>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60"
        align="end"
        alignOffset={8}
        forceMount
      >
        <DropdownMenuItem onClick={onArchive}>
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="text-xs text-muted-foreground p-2">
          Last edited by: {user.username}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-10 w-10" data-testid="menu skeleton" />;
};
