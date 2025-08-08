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
  date: Date;
};

export type UserProfile = {
  username: string;
  email: string;
  url_avatar: string;
  totalViews: number;
  bookVersions: BookVersionByUserId[];
};

export type MoveBookVersionToTrashParams = {
  bookVersionId: number;
  profileId: number;
};

//For user's info update (basic settings)
export type ChangeUserBasicInfo = {
  username: string;
  //Add other infos here in future (gender, birth year, etc)
};

//For user's info update (secured settings)
export type EmailUpdateParams = {
  email: string;
  password: string;
};

export type ChangePasswordParams = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

//For trashed book versions
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

//recoverTrashedBookVersion
export type RecoverTrashedBookVersionParams = {
  bookVersionId: number;
};

//deleteBookVersion
export type DeleteBookVersionParams = {
  bookVersionId: number;
};
