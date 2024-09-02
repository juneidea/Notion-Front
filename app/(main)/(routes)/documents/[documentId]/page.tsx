"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { CoverImageModal } from "@/components/modals/cover-image-modal";
import { Toolbar } from "@/components/toolbar";
import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchQuery } from "@/hooks/use-search-query";
import { useDocumentsMutate } from "@/hooks/use-documents-mutate";

interface DocumentIdPageProps {
  params: {
    documentId: string;
  };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const Editor = useMemo(
    // @ts-ignore
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );
  const { documents } = useSearchQuery(params.documentId);
  const { update } = useDocumentsMutate();
  const byIdDocument = documents.data;

  const [openCoverImage, setOpenCoverImage] = useState(false);

  const onChange = (content: string) => {
    update({ id: parseInt(params.documentId as string), content });
  };

  if (!byIdDocument) {
    return (
      <div data-testid="skeletons">
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="pb-40">
      <Cover
        url={byIdDocument[0].cover_image}
        onModalChange={setOpenCoverImage}
      />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar
          initialData={byIdDocument[0]}
          setOpenCoverImage={setOpenCoverImage}
        />
        {/* @ts-ignore */}
        <Editor onChange={onChange} initialContent={byIdDocument[0].content} />
      </div>
      <CoverImageModal
        open={openCoverImage}
        coverUrl={byIdDocument[0].cover_image || ""}
        onModalChange={setOpenCoverImage}
      />
    </div>
  );
};

export default DocumentIdPage;
