export type Author = {
  id: number;
  name: string;
  country: string;
};

//For all authors dashboard with pagination
export type AuthorDashboardResponse = {
  id: number;
  popularity: number;
  name: string;
  createdAt: Date;
  country: string;
};

export type AuthorDashboardTableItem = {
  id: number;
  popularity: number;
  name: string;
  createdAt: string;
  country: string;
};

export type AuthorsPaginationParams = {
  search: string;
  country: string;
  sortBy: string;
  page_index: number;
  category: string;
};
