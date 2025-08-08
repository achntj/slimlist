export interface List {
  id: number;
  name: string;
  content: string;
  due_date: string | null;
  tags: string;
  created_at: string;
  updated_at: string;
}

export interface ListWithParsedTags extends Omit<List, 'tags'> {
  tags: string[];
}
