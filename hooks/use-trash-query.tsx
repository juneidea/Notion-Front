import { useQuery } from "@tanstack/react-query";
import { Document } from "@/lib/types";
import api from "@/app/api";

export const useTrashQuery = (parentDocumentId?: number) => {
  return useQuery({
    queryFn: (): Promise<Document[]> =>
      api.get("/api/documents/?isArchived=True").then((res) => res.data),
    queryKey: ["documents", parentDocumentId],
  });
};
