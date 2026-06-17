export interface Resource {
  id: string;
  title: string;
  author: string;
  category: string;
  year: number;
  rating: number;
  description: string;
  coverImage: string;
  pages: number;
  language: string;
  publisher: string;
  dateAdded?: string;
  isNew?: boolean;
  pdfUrl?: string;
}
