"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Toolbar } from "@/components/toolbar";
import { usePreviewQuery } from "@/hooks/use-preview-query";
import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";

interface DocumentIdPageProps {
  params: {
    documentId: string;
  };
}

const PreviewIdPage = ({ params }: DocumentIdPageProps) => {
  const Editor = useMemo(
    // @ts-ignore
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );
  const { documents } = usePreviewQuery(params.documentId);
  const byIdDocument = documents.data;

  if (!byIdDocument) {
    return (
      <div>
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
  return byIdDocument[0].is_published ? (
    <div className="pb-40">
      <Cover
        preview
        url={byIdDocument[0].cover_image}
        onModalChange={() => {}}
      />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar
          preview
          initialData={byIdDocument[0]}
          setOpenCoverImage={() => {}}
        />
        <Editor
          /*// @ts-ignore */
          editable={false}
          onChange={() => {}}
          initialContent={byIdDocument[0].content}
        />
      </div>
    </div>
  ) : (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        height="192"
        width="300"
        alt="Empty"
        sizes="300px"
        priority
      />
      <h2 className="text-lg font-medium">Not a published note.</h2>
    </div>
  );
};

export default PreviewIdPage;
