"use client";

import { useRouter } from "next/navigation";
import { useTrashMutate } from "@/hooks/use-trash-mutate";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface BannerProps {
  documentId: number;
}

export const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter();
  const { remove, restore } = useTrashMutate();

  const onRemove = () => {
    router.push("/documents");
    setTimeout(() => remove(documentId), 300);
  };

  return (
    <div
      className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center"
      data-testid="banner"
    >
      <p>This page is in the Trash</p>
      <Button
        size="sm"
        onClick={() => restore(documentId)}
        variant="outline"
        className="border-white bg-transparent hover:bg-primary/5 hover:text-white py-1 px-2 h-auto font-normal"
      >
        Restore Page
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          size="sm"
          variant="outline"
          className="border-white bg-transparent hover:bg-primary/5 hover:text-white py-1 px-2 h-auto font-normal"
        >
          Delete forever
        </Button>
      </ConfirmModal>
    </div>
  );
};
