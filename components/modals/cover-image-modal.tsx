"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { useDocumentsMutate } from "@/hooks/use-documents-mutate";
import { useParams } from "next/navigation";

interface CoverImageModalProps {
  open: boolean;
  coverUrl: string;
  onModalChange: (value: boolean) => void;
}

export const CoverImageModal = ({
  open,
  coverUrl,
  onModalChange,
}: CoverImageModalProps) => {
  const { edgestore } = useEdgeStore();
  const params = useParams();
  const { update } = useDocumentsMutate();

  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onCLose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    onModalChange(false);
  };

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);

      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: coverUrl,
        },
      });
      await update({
        id: parseInt(params.documentId as string),
        cover_image: res.url,
      });
      onCLose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onModalChange(false)}>
      <DialogContent>
        <DialogTitle className="hidden"></DialogTitle>
        <DialogDescription className="hidden"></DialogDescription>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  );
};
