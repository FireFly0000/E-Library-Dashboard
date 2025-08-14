export const allowedCategoryCodes = [
  "FIC", // Fiction
  "SCI", // Science
  "BIO", // Biography
  "ROM", // Romance
  "FANT", // Fantasy
  "THR", // Thriller
  "HIST", // Historical
  "MYST", // Mystery
  "HORR", // Horror
];

export type BookResponse = {
  id: number;
  title: string;
  authorId: number;
  categoryId: number;
  thumbnailUrl: string;
  viewCount: number;
};

export type SearchTitleAndAuthorResponse = {
  id: number;
  title: string;
  author: string; //author's name
  thumbnailUrl: string;
};

type BookVersion = {
  id: number;
  fileUrl: string;
  contributorName: string;
  viewCount: number;
  createdAt: Date;
};

export type BookInfo = {
  title: string;
  authorName: string;
  authorCountry: string;
  description: string;
  thumbnailUrl: string;
  totalViews: number;
  versions: BookVersion[];
};

export type BookByAuthorId = {
  id: number;
  title: string;
  authorId: number;
  thumbnailUrl: string;
  viewCount: number;
};

export type BookByAuthorDashboardResponse = {
  totalViews: number;
  books: BookByAuthorId[];
};
