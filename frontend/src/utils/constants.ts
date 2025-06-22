// messages.ts
export const HTTP_CALL = {
  HTTP_POST: "POST",
  HTTP_GET: "GET",
  HTTP_PATCH: "PATCH",
  HTTP_PUT: "PUT",
  HTTP_DELETE: "DELETE",
};

export const ROLE = {
  AUTHOR: "Author",
  USER: "User",
};

export const PAGE_INDEX = {
  FIRST_PAGE: "1",
  UNDEFINED_PAGE: "0",
};

export const errorMessages = {
  wrongPassword: "Wrong password",
  weakPassword: "Weak password",
  tooLongPassword: "Password is too long",
  emailNotExist: "Email does not exist",
  validationFail: "Validation fail",
  internalServer: "Internal server",
  invalidEmail: "Invalid email",
  emailIsRequired: "Email is required",
  passwordIsRequired: "Password is required",
  newPasswordRequired: "New Password is required",
  confirmPasswordIsRequired: "Confirm Password is required",
  confirmPasswordNotMatch: " Confirm Password does not match",
  wrongConfirmPasswordIsRequired: "Wrong Confirm Password is required",

  titleIsRequired: "Title is required",
  titleTooLong: "Title is too long, under 100 characters only",
  summaryTooLong: "Summary is too long, under 200 characters only",
  descriptionTooWeak: "Description is too short, minimum 8 characters",
  descriptionTooLong: "Description is too long, under 200 characters only",
  summaryIsRequired: "Summary is required",
  descriptionIsRequired: "Description is required",
  currentPasswordIsRequired: "Current password is required",
  newPasswordIsRequired: "New password is required",
  usernameIsRequired: "Username is required",
  usernameIsTooLong: "Username is maximum 32 character",

  categoriesIsRequired: "Category is required",

  fileIsNotSupport: "File is not support",
  thumbnailIsRequired: "Thumbnail is required",
  thumbnailTooBig: "Thumbnail too big",

  videoFileType: "Invalid file type, .mp4 .mkv .mov file only",
  videoFileSize: "Video too large, video size lower than 100MB only",

  commentTooLong: "Comment is too long, maximum 100 characters only",

  //Auth
  loginAgain: "Please login again",
};

export const successMessages = {
  verificationForgotPassword: "Sent a verification code to your email",
};

export const fileType = {
  mp4: "video/mp4",
  mkv: "video/x-matroska",
  mov: "video/quicktime",
  png: "png",
  jpg: "jpg",
  jpeg: "jpeg",
};
