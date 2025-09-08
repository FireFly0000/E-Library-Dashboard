export type BooksPaginationParams = {
  search: string;
  country: string;
  sortBy: string;
  page_index: number;
  category: string;
};

export type CreateBookParams = {
  bookFile: File;
  bookId: number | null;
  title: string | null;
  thumbnail: File | null;
  category: string;
  description: string | null;
  authorId: number | null;
  authorName: string | null;
  authorCountry: string | null;
};

export type Book = {
  id: number;
  title: string;
  authorId: number;
  categoryId: number;
  thumbnailUrl: string;
  viewCount: number;
};

export type BookSearchTitleAndAuthor = {
  id: number;
  title: string;
  author: string; //author's name
  thumbnailUrl: string;
};

// This type is used for the book versions dashboard
export type BookInfoParams = {
  bookId: number;
  page_index: number;
  sortBy: string;
};

export type BookVersion = {
  id: number;
  fileUrl: string;
  contributorName: string;
  contributorId: number;
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

export type BookVersionTableItem = {
  id: number;
  fileUrl: string;
  reader: string;
  contributorName: string;
  contributorId: number;
  viewCount: number;
  createdAt: string;
};

export type UpdateViewsParams = {
  bookId: number;
  bookVersionId: number;
  contributorId: number;
};

//AI services
export type BookAIServicesParams = {
  content: string;
  language: string;
  title: string;
  service: string;
};

//Books by author id dashboard
export type BooksByAuthorIdParams = {
  search: string;
  authorId: number;
  sortBy: string;
  page_index: number;
  category: string;
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

//For books suggestions by Gemini AI chatbot
type AIBooksList = {
  title: string;
  author: string;
  genre: string;
  description: string;
};

type NewYorkTimesBestSellerBooks = {
  title: string;
  author: string;
  genre: string;
  description: string;
};

export type BookSuggestion = {
  AIBooksList: AIBooksList[];
  NewYorkTimesBestSellerBooks: NewYorkTimesBestSellerBooks[];
};
