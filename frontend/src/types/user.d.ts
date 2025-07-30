//for getMe
export type User = {
  id?: number;
  username: string;
  url_avatar?: string;
  email: string;
  password?: string;
  viewCount: number;

  //BookVersions: BookVersion[]
};

//for user profile (all users)
export type GetUserProfileParams = {
  search: string;
  userId: number;
  sortBy: string;
  page_index: number;
};

export type BookVersionByUserId = {
  id: number;
  bookId: number;
  thumbnail: string;
  title: string;
  authorId: number;
  authorName: string;
  authorCountry: string;
  viewCount: number;
  fileUrl: string;
};

export type UserProfile = {
  username: string;
  email: string;
  url_avatar: string;
  totalViews: number;
  bookVersions: BookVersionByUserId[];
};
