import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/app/api";
import { Document } from "@/lib/types";

export const useTrashMutate = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Delete Document

  const deleteDocumentMutation = useMutation({
    mutationFn: (id: number) => api.delete(`api/documents/delete/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["documents"],
      });
      router.push("/documents");
      toast.success("Note deleted!");
    },
  });

  const remove = (id: number) => {
    deleteDocumentMutation.mutate(id);
    if (deleteDocumentMutation.isPending) toast.loading("Deleting note...");
    if (deleteDocumentMutation.isError) toast.error("Failed to delete note.");
  };

  // Restore Document

  const updateDocumentMutation = useMutation({
    mutationFn: ({
      id,
      title,
      is_archived,
      parent_id,
    }: {
      id: number;
      title: string;
      is_archived: boolean;
      parent_id?: number;
    }) =>
      api.put(`/api/documents/update/${id}/`, {
        title,
        is_archived,
        parent_id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["documents"],
      });
      toast.success("Note restored!");
    },
  });

  const restore = async (id: number) => {
    const byIdDocumentQuery: Document[] = await api
      .get(`/api/documents/?documentId=${id}`)
      .then((res) => res.data);
    if (!byIdDocumentQuery) {
      throw new Error("Not found");
    }
    const document = byIdDocumentQuery[0];
    let updatedDocument = updateDocumentMutation.mutate({
      id,
      title: document.title,
      is_archived: false,
    });
    if (document.parent_id !== -1) {
      const parentQuery: Document[] = await api
        .get(`/api/documents/?documentId=${document.parent_id}`)
        .then((res) => res.data);
      if (parentQuery[0].is_archived) {
        updatedDocument = updateDocumentMutation.mutate({
          id,
          title: document.title,
          is_archived: false,
          parent_id: -1,
        });
      }
    }
    if (updateDocumentMutation.isPending) toast.loading("Restoring note...");
    if (updateDocumentMutation.isError) toast.error("Failed to restore note.");
    await recursiveRestore(id);
    return updatedDocument;
  };

  const recursiveRestore = async (parent_id: number) => {
    const childDocuments: Document[] = await api
      .get(`/api/documents/?parentId=${parent_id}&isArchived=True`)
      .then((res) => res.data);
    childDocuments?.forEach((document) => {
      updateDocumentMutation.mutate({
        id: document.id,
        title: document.title,
        is_archived: false,
      });
      recursiveRestore(document.id);
    });
  };

  return { remove, restore };
};
