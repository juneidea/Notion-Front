import { useQuery } from "@tanstack/react-query";
import { Document } from "@/lib/types";
import api from "@/app/api";

export const usePreviewQuery = (documentId?: string) => {
  const documents = useQuery({
    queryFn: (): Promise<Document[]> =>
      api
        .get(
          `/api/documents/preview/?documentId=${documentId}&isPublished=True`
        )
        .then((res) => res.data),
    queryKey: ["preview"],
  });

  return { documents };
};
