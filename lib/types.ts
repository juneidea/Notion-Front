export type Document = {
  id: number;
  title: string;
  is_archived?: boolean;
  is_published?: boolean;
  parent_id?: number;
  content?: string;
  cover_image?: string;
  icon?: string;
};
