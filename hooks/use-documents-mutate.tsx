import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/app/api";
import { Document } from "@/lib/types";

export const useDocumentsMutate = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  // New Document

  const newDocumentMutation = useMutation({
    mutationFn: ({ title, parentId }: { title: string; parentId?: number }) =>
      api.post("/api/documents/", {
        title,
        is_archived: false,
        is_published: false,
        parent_id: parentId,
      }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["documents", variables.parentId],
      });
      router.push(`/documents/${data.data.id}`);
      toast.success("New note created!");
    },
  });

  const onCreate = ({
    title,
    parentId,
  }: {
    title: string;
    parentId?: number;
  }) => {
    newDocumentMutation.mutate({ title, parentId });
    if (newDocumentMutation.isPending) toast.loading("Creating a new note...");
    if (newDocumentMutation.isError)
      toast.error("Failed to create a new note.");
  };

  // Update Document

  const updateDocumentMutation = useMutation({
    mutationFn: ({
      id,
      title,
      is_archived,
      content,
      cover_image,
      icon,
      is_published,
    }: {
      id: number;
      title?: string;
      is_archived?: boolean;
      content?: string;
      cover_image?: string;
      icon?: string;
      is_published?: boolean;
    }) =>
      api.put(`/api/documents/update/${id}/`, {
        title,
        is_archived,
        content,
        cover_image,
        icon,
        is_published,
      }),
    onSuccess: (data, variables) => {
      const parentId =
        data.data.parent_id === -1 ? undefined : data.data.parent_id;
      queryClient.invalidateQueries({
        queryKey: ["documents"],
      });
      if (variables.is_archived === true) {
        toast.success("Note moved to trash!");
      }
    },
  });

  const archive = async (id: number) => {
    const byIdDocumentQuery: Document[] = await api
      .get(`/api/documents/?documentId=${id}`)
      .then((res) => res.data);
    if (!byIdDocumentQuery) {
      throw new Error("Not found");
    }
    const document = byIdDocumentQuery[0];
    const updatedDocument = updateDocumentMutation.mutate({
      id,
      title: document.title,
      is_archived: true,
    });
    if (updateDocumentMutation.isPending) toast.loading("Moving to trash...");
    if (updateDocumentMutation.isError) toast.error("Failed to archive note.");
    await recursiveArchive(id);
    return updatedDocument;
  };

  const recursiveArchive = async (parent_id: number) => {
    const childDocuments: Document[] = await api
      .get(`/api/documents/?parentId=${parent_id}`)
      .then((res) => res.data);
    childDocuments?.forEach((document) => {
      updateDocumentMutation.mutate({
        id: document.id,
        title: document.title,
        is_archived: true,
      });
      recursiveArchive(document.id);
    });
  };

  const update = async ({
    id,
    title,
    content,
    cover_image,
    icon,
    is_published,
  }: {
    id: number;
    title?: string;
    content?: string;
    cover_image?: string;
    icon?: string;
    is_published?: boolean;
  }) => {
    const byIdDocumentQuery: Document[] = await api
      .get(`/api/documents/?documentId=${id}`)
      .then((res) => res.data);
    if (!byIdDocumentQuery) {
      throw new Error("Not found");
    }
    const updatedDocument = updateDocumentMutation.mutate({
      id,
      title,
      content,
      cover_image,
      icon,
      is_published,
    });
    if (updateDocumentMutation.isPending) toast.loading("Updating note...");
    if (updateDocumentMutation.isError) toast.error("Failed to update");
    return updatedDocument;
  };

  return { archive, onCreate, update };
};
