import { useQuery } from "@tanstack/react-query";
import { Document } from "@/lib/types";
import api from "@/app/api";

export const useSearchQuery = (documentId?: string) => {
  const documents = useQuery({
    queryFn: (): Promise<Document[]> =>
      api
        .get(
          documentId
            ? `/api/documents/?documentId=${documentId}`
            : "/api/documents/"
        )
        .then((res) => res.data),
    queryKey: documentId ? ["documents", documentId] : ["search"],
  });
  return { documents };
};
