"use client";

import React, { useRef, useState } from "react";
import { Document } from "@/lib/types";
import { useDocumentsMutate } from "@/hooks/use-documents-mutate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface TitleProps {
  initialData: Document;
}

export const Title = ({ initialData }: TitleProps) => {
  const { update } = useDocumentsMutate();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitile] = useState(initialData.title || "Untitled");
  const inputRef = useRef<HTMLInputElement>(null);

  const enableInput = () => {
    setTitile(initialData.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitile(event.target.value);
    update({
      id: initialData.id,
      title: event.target.value || "Untitled",
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      disableInput();
    }
  };

  return (
    <div className="flex items-center gap-x-1" data-testid="title">
      {!!initialData.icon && <p data-testid="icon">{initialData.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableInput}
          onBlur={disableInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={title}
          className="h-7 px-2 focus-visible:ring-transparent"
          data-testid="input"
        />
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          size="sm"
          className="font-normal h-auto p-1"
          data-testid="button"
        >
          <span className="truncate">{initialData.title}</span>
        </Button>
      )}
    </div>
  );
};

Title.Skeleton = function TitleSkeleton() {
  return (
    <Skeleton className="h-9 w-20 rounded-md" data-testid="title skeleton" />
  );
};
