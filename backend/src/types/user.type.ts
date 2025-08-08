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
  date: Date;
};

export type UserProfile = {
  username: string;
  email: string;
  totalViews: number;
  url_avatar: string;
  bookVersions: BookVersionByUserId[];
};

export type TrashedBookVersion = {
  id: number;
  title: string;
  thumbnailUrl: string;
  viewCount: number;
  fileUrl: string;
  trashedAt: Date;
  authorId: number;
  authorName: string;
};
