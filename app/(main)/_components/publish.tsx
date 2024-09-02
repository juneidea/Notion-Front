"use client";

import { useState } from "react";
import { Check, Copy, Globe, GlobeIcon } from "lucide-react";
import { Document } from "@/lib/types";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useOrigin } from "@/hooks/use-origin";
import { useDocumentsMutate } from "@/hooks/use-documents-mutate";

interface PublishProbs {
  initialData: Document;
}

export const Publish = ({ initialData }: PublishProbs) => {
  const origin = useOrigin();
  const { update } = useDocumentsMutate();

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const url = `${origin}/preview/${initialData.id}`;

  const onPublish = async () => {
    setIsSubmitting(true);
    await update({ id: initialData.id, is_published: true });
    setIsSubmitting(false);
  };

  const onUnPublish = async () => {
    setIsSubmitting(true);
    await update({ id: initialData.id, is_published: false });
    setIsSubmitting(false);
  };

  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost" data-testid="publish trigger">
          Publish
          {initialData.is_published && (
            <GlobeIcon className="text-sky-500 w-4 h-4 ml-2" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData.is_published ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Globe className="text-sky-500 animate-pulse h-4 w-4" />
              <p className="text-xs font-medium text-sky-500">
                This note is live on web.
              </p>
            </div>
            <div className="flex items-center">
              <input
                className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate focus:outline-none"
                value={url}
                onChange={() => {}}
              />
              <Button
                onClick={onCopy}
                disabled={copied}
                className="h-8 rounded-l-none"
                data-testid="copy"
              >
                {copied ? (
                  <Check className="h-4 w-4 " />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              size="sm"
              className="w-full text-xs"
              disabled={isSubmitting}
              onClick={onUnPublish}
            >
              Unpublish
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-2">Publish this note</p>
            <span className="text-xs text-muted-foreground mb-4">
              Share your work with others.
            </span>
            <Button
              disabled={isSubmitting}
              onClick={onPublish}
              className="w-full text-xs"
              size="sm"
              data-testid="confirm publish"
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
