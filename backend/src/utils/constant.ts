import { error } from "console";

export const errorMessages = {
  validationFail: "Validation fail",
  internalServer: "Internal server",
  badRequest: "Bad request",
  missingRequestBody: "Missing the request body",
  //Data failed
  getDataFailed: "Cannot find requested resources",

  // Token
  emailTokenExpired: "The verification link has expired",
  tokenVerifiedCode: "The verification link is not correct",
  tokenGenerateCode: "This verification link was never generated",

  // Password
  wrongPassword: "Wrong password",
  weakPassword: "Weak password",
  tooLongPassword: "Password is too long",
  passwordIsRequired: "Password is required",
  newPasswordIsRequired: "New Password is required",
  currentPasswordIsRequired: "Current password is required",
  confirmPasswordIsRequired: "Confirm Password is required",
  confirmPasswordDifferentPassword:
    "Confirm password must be the same with password",
  wrongConfirmPasswordIsRequired: "Wrong Confirm Password is required",
  passwordMustBeString: "Password must be a string",
  passWordAndConfirmPasswordMustBeSameRequired:
    "Password and comfirm password must be same required !",

  // Email
  emailNotExist: "Email does not exist",
  emailAlreadyExists: "Email already exists",
  invalidEmail: "Invalid email",
  emailIsRequired: "Email is required",
  emailMustBeString: "Email must be a string",
  inCorrectEmail: "Incorrect email",
  errorSendEmail:
    "Email sending failed, please login again to receive a new confirmation email",
  emailNotFound: "Email not found",
  errorSendEmail2: "Error sending email, please try again",
  errorSendEmail3:
    "Unverified account.\nError sending email, please login again to receive a new confirmation email",

  // Verified Email
  verifiedEmail: "This account has been verified before",
  verifiedEmailFailed: "Verify email failed",

  // Login
  loginFailed: "Email or password is invalid",
  signUpFailed: "Sign Up Failed",

  // User
  userNotFound: " User is not found ",
  loginUnverified:
    "Unverified account, We have sent you a verification link, please check your email soon before it expires!",

  // username
  UsernameMustBeString: "Username must be a string",
  UsernameIsRequired: "Username is required",
  tooLongUsername: "Username is too long",
  usernameAlreadyExists: "Username already exists",

  // Reset password
  expiredToken: "This link is expired",
  errorToken: "This link is error",
  errorMatchingPasssword: "Password ",

  // Slug
  slugIsUsed: "This slug is already in use",
  courseSlugIsRequired: "Course Slug is required",
  courseSlugMalformed: "Course Slug malformed",
  courseSlugMustBeString: "Course Slug must be a string",

  // Title
  courseTitleIsRequired: "Title is required",
  courseTitleMustBeString: "Title must be a string",
  courseTitleIsTooLong: "Title is too long, maximum 100 characters only",

  // Status
  statusIsRequired: "Status is required",
  statusMustBeBoolean: "Status must be a boolean",

  // Description
  descriptionIsRequired: "Description is required",
  descriptionMustBeString: "Description must be a string",
  tooLongDescription: "Description is too long",
  tooshortDescription: "Description is too short",

  // Summary
  summaryIsRequired: "Summary is required",
  summaryMustBeString: "Summary must be a string",

  // Category
  categoryArrayNumber: "Categories must be a array int",
  // export const MESSAGE_ERROR_CATEGORIES_ARRAY_NUMBER = "Categories must be a array int";
  categoryIsRequired: "Categories is required",
  categoryNotFound: "Category Not Found",

  // Thumbnail
  thumbnailIsRequired: "Thumbnail is required",

  // Upload Image
  imageUploadError: "Upload Image Error",

  //Auth
  loginAgain: "Please login again",
  unauthorized: "Unauthorized",

  //reOrder
  reOrderRequired: "Your reOrder is missing",
  orderExisted: "Order was Existed",
  orderDuplicate: "Order item must be unique",

  orderNotValid: "Order List is not valid",

  //Author
  authorNameMustBeString: "Author name must be a string",
  authorNameIsRequired: "Author name is required",
  authorNameTooShort: "Author name is too short",
  authorCountryMustBeString: "Author's country must be a string",
  authorCountryIsRequired: "Author's country is required",
  createdAuthorFailed: "Created author failed, please try again",
};

export const successMessages = {
  // Request
  requestSuccess: "Request successful",

  // Request Body
  validationFailed: "Validation failed",

  // Data Success
  getDataSuccess: "Get data successfully",
  createDataSuccess: "Create successfully",
  updateDataSuccess: "Update successfully",
  deleteDataSuccess: "Delete successfully",

  // Email
  verificationForgotPassword: "Sent a verification code to your email",
  resendVerificationEmail: "Resend verification email successfully",

  // Verified Email
  verifiedEmail: "Account verification successful",
  verifiedEmailBefore: "This account has been verified before",

  // Password
  changePasswordSuccessfully: "Change password successfully",

  // Login
  successLogin: "Logged in successfully",

  // Sign-up
  signUpSuccess: "Signup successful, please check your email",

  // Reset password
  resetPasswordSuccess: "Reset successfully, please login your account",

  // Upload Image
  imageUploadSuccess: "Upload Image Successfully",

  // reOrder
  sectionReorderSuccess: "Reorder lessons successfully",

  // Author
  getAllAuthors: "Get all authors successfully",
  filterAuthorsByName: "Filter authors by name successfully",
  newAuthorCreated: "New author created successfully",
};
