"use client";

import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDocumentsMutate } from "@/hooks/use-documents-mutate";
import { useEdgeStore } from "@/lib/edgestore";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

interface CoverProps {
  onModalChange: (value: boolean) => void;
  url?: string;
  preview?: boolean;
}

export const Cover = ({ onModalChange, url, preview }: CoverProps) => {
  const { edgestore } = useEdgeStore();
  const params = useParams();
  const { update } = useDocumentsMutate();

  const onReplace = async () => {
    await update({
      id: parseInt(params.documentId as string),
      cover_image: url ? url : "",
    });
    onModalChange(true);
  };

  const onRemove = async () => {
    if (url) {
      await edgestore.publicFiles.delete({
        url,
      });
    }
    await update({
      id: parseInt(params.documentId as string),
      cover_image: "",
    });
  };

  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        !url && "h-[12vh]",
        url && "bg-muted"
      )}
    >
      {!!url && <Image src={url} fill alt="Cover" className="object-cover" />}
      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            onClick={onReplace}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Change cover
          </Button>
          <Button
            onClick={onRemove}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className="w-full h-[12vh]" />;
};
