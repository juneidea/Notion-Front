import { useQuery } from "@tanstack/react-query";
import { Document } from "@/lib/types";
import api from "@/app/api";

export const useDocumentsQuery = (parentDocumentId?: number) => {
  return useQuery({
    queryFn: (): Promise<Document[]> =>
      api
        .get(
          parentDocumentId
            ? `/api/documents/?parentId=${parentDocumentId}`
            : "/api/documents/?parentId=-1"
        )
        .then((res) => res.data),
    queryKey: parentDocumentId
      ? ["documents", parentDocumentId]
      : ["documents"],
  });
};
