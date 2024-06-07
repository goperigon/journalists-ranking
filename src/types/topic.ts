interface Topic {
  id: number;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  name: string;
  labels: {
    category: string;
    subcategory: string;
  };
}
