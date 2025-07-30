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
  totalViews: number;
  url_avatar: string;
  bookVersions: BookVersionByUserId[];
};
