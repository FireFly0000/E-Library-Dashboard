import { Trash2, ArchiveRestore } from "lucide-react";

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
  badRequest: "Bad request",
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

export const BooksSortByOptions = [
  { key: 0, label: "Latest", value: "createdAt DESC" },
  { key: 1, label: "Oldest", value: "createdAt ASC" },
  { key: 2, label: "Popular", value: "popularity DESC" },
];

export const AuthorsSortByOptions = [
  { key: 0, label: "Latest", value: "created_at DESC" },
  { key: 1, label: "Oldest", value: "created_at ASC" },
  { key: 2, label: "Popular", value: "popularity DESC" },
];

export const BooksCategoryOptions = [
  { key: 0, label: "All", value: "All" },
  { key: 1, label: "Fiction", value: "FIC" },
  { key: 2, label: "Science", value: "SCI" },
  { key: 3, label: "Biography", value: "BIO" },
  { key: 4, label: "Romance", value: "ROM" },
  { key: 5, label: "Fantasy", value: "FANT" },
  { key: 6, label: "Thriller", value: "THR" },
  { key: 7, label: "Historical", value: "HIST" },
  { key: 8, label: "Mystery", value: "MYST" },
  { key: 9, label: "Horror", value: "HORR" },
];

export const readModes = [
  { key: 0, label: "Multi", value: true },
  { key: 1, label: "Single", value: false },
];

export const BooksCategoryOptionsWithoutAll = [
  { key: 0, label: "Fiction", value: "FIC" },
  { key: 1, label: "Science", value: "SCI" },
  { key: 2, label: "Biography", value: "BIO" },
  { key: 3, label: "Romance", value: "ROM" },
  { key: 4, label: "Fantasy", value: "FANT" },
  { key: 5, label: "Thriller", value: "THR" },
  { key: 6, label: "Historical", value: "HIST" },
  { key: 7, label: "Mystery", value: "MYST" },
  { key: 8, label: "Horror", value: "HORR" },
];

//for profile page
export const BookVersionActionsMenu = [
  {
    icon: Trash2,
    label: "Move to trash",
    subLabel: "Items in your trash are deleted after 15 days",
  },
];

//for trash bin
export const trashedItemsActionsMenu = [
  {
    icon: ArchiveRestore,
    label: "Recover",
    subLabel: "",
  },
  {
    icon: Trash2,
    label: "Delete",
    subLabel: "Permanently Delete",
  },
];

export const languageList = [
  {
    key: 0,
    label: "English",
    value: "English",
  },
  {
    key: 1,
    label: "Mandarin Chinese",
    value: "Mandarin Chinese",
  },
  {
    key: 2,
    label: "Cantonese",
    value: "Cantonese",
  },
  {
    key: 3,
    label: "Japanese",
    value: "Japanese",
  },
  {
    key: 4,
    label: "Korean",
    value: "Korean",
  },
  {
    key: 5,
    label: "Vietnamese",
    value: "Vietnamese",
  },
  {
    key: 6,
    label: "Thai",
    value: "Thai",
  },
  {
    key: 7,
    label: "Lao",
    value: "Lao",
  },
  {
    key: 8,
    label: "Khmer (Cambodian)",
    value: "Khmer (Cambodian)",
  },
  {
    key: 9,
    label: "Burmese",
    value: "Burmese",
  },
  {
    key: 10,
    label: "Malay",
    value: "Malay",
  },
  {
    key: 11,
    label: "Indonesian",
    value: "Indonesian",
  },
  {
    key: 12,
    label: "Tagalog",
    value: "Tagalog",
  },
  {
    key: 13,
    label: "Cebuano",
    value: "Cebuano",
  },
  {
    key: 14,
    label: "Ilocano",
    value: "Ilocano",
  },
  {
    key: 15,
    label: "Javanese",
    value: "Javanese",
  },
  {
    key: 16,
    label: "Sundanese",
    value: "Sundanese",
  },
  {
    key: 17,
    label: "Minangkabau",
    value: "Minangkabau",
  },
  {
    key: 18,
    label: "Balinese",
    value: "Balinese",
  },
  {
    key: 19,
    label: "Batak",
    value: "Batak",
  },
  {
    key: 20,
    label: "Tamil",
    value: "Tamil",
  },
  {
    key: 21,
    label: "Hindi",
    value: "Hindi",
  },
  {
    key: 22,
    label: "Bengali",
    value: "Bengali",
  },
  {
    key: 23,
    label: "Urdu",
    value: "Urdu",
  },
  {
    key: 24,
    label: "Arabic",
    value: "Arabic",
  },
  {
    key: 25,
    label: "French",
    value: "French",
  },
  {
    key: 26,
    label: "Spanish",
    value: "Spanish",
  },
  {
    key: 27,
    label: "Portuguese",
    value: "Portuguese",
  },
  {
    key: 28,
    label: "Russian",
    value: "Russian",
  },
  {
    key: 29,
    label: "German",
    value: "German",
  },
];

export const countryList = [
  {
    key: 0,
    label: "All",
    value: "All",
  },
  {
    key: 1,
    label: "Afghanistan",
    value: "Afghanistan",
  },
  {
    key: 2,
    label: "Åland Islands",
    value: "Åland Islands",
  },
  {
    key: 3,
    label: "Albania",
    value: "Albania",
  },
  {
    key: 4,
    label: "Algeria",
    value: "Algeria",
  },
  {
    key: 5,
    label: "American Samoa",
    value: "American Samoa",
  },
  {
    key: 6,
    label: "Andorra",
    value: "Andorra",
  },
  {
    key: 7,
    label: "Angola",
    value: "Angola",
  },
  {
    key: 8,
    label: "Anguilla",
    value: "Anguilla",
  },
  {
    key: 9,
    label: "Antarctica",
    value: "Antarctica",
  },
  {
    key: 10,
    label: "Antigua and Barbuda",
    value: "Antigua and Barbuda",
  },
  {
    key: 11,
    label: "Argentina",
    value: "Argentina",
  },
  {
    key: 12,
    label: "Armenia",
    value: "Armenia",
  },
  {
    key: 13,
    label: "Aruba",
    value: "Aruba",
  },
  {
    key: 14,
    label: "Australia",
    value: "Australia",
  },
  {
    key: 15,
    label: "Austria",
    value: "Austria",
  },
  {
    key: 16,
    label: "Azerbaijan",
    value: "Azerbaijan",
  },
  {
    key: 17,
    label: "Bahamas",
    value: "Bahamas",
  },
  {
    key: 18,
    label: "Bahrain",
    value: "Bahrain",
  },
  {
    key: 19,
    label: "Bangladesh",
    value: "Bangladesh",
  },
  {
    key: 20,
    label: "Barbados",
    value: "Barbados",
  },
  {
    key: 21,
    label: "Belarus",
    value: "Belarus",
  },
  {
    key: 22,
    label: "Belgium",
    value: "Belgium",
  },
  {
    key: 23,
    label: "Belize",
    value: "Belize",
  },
  {
    key: 24,
    label: "Benin",
    value: "Benin",
  },
  {
    key: 25,
    label: "Bermuda",
    value: "Bermuda",
  },
  {
    key: 26,
    label: "Bhutan",
    value: "Bhutan",
  },
  {
    key: 27,
    label: "Bolivia, Plurinational State of",
    value: "Bolivia, Plurinational State of",
  },
  {
    key: 28,
    label: "Bonaire, Sint Eustatius and Saba",
    value: "Bonaire, Sint Eustatius and Saba",
  },
  {
    key: 29,
    label: "Bosnia and Herzegovina",
    value: "Bosnia and Herzegovina",
  },
  {
    key: 30,
    label: "Botswana",
    value: "Botswana",
  },
  {
    key: 31,
    label: "Bouvet Island",
    value: "Bouvet Island",
  },
  {
    key: 32,
    label: "Brazil",
    value: "Brazil",
  },
  {
    key: 33,
    label: "British Indian Ocean Territory",
    value: "British Indian Ocean Territory",
  },
  {
    key: 34,
    label: "Brunei Darussalam",
    value: "Brunei Darussalam",
  },
  {
    key: 35,
    label: "Bulgaria",
    value: "Bulgaria",
  },
  {
    key: 36,
    label: "Burkina Faso",
    value: "Burkina Faso",
  },
  {
    key: 37,
    label: "Burundi",
    value: "Burundi",
  },
  {
    key: 38,
    label: "Cabo Verde",
    value: "Cabo Verde",
  },
  {
    key: 39,
    label: "Cambodia",
    value: "Cambodia",
  },
  {
    key: 40,
    label: "Cameroon",
    value: "Cameroon",
  },
  {
    key: 41,
    label: "Canada",
    value: "Canada",
  },
  {
    key: 42,
    label: "Cayman Islands",
    value: "Cayman Islands",
  },
  {
    key: 43,
    label: "Central African Republic",
    value: "Central African Republic",
  },
  {
    key: 44,
    label: "Chad",
    value: "Chad",
  },
  {
    key: 45,
    label: "Chile",
    value: "Chile",
  },
  {
    key: 46,
    label: "China",
    value: "China",
  },
  {
    key: 47,
    label: "Christmas Island",
    value: "Christmas Island",
  },
  {
    key: 48,
    label: "Cocos (Keeling) Islands",
    value: "Cocos (Keeling) Islands",
  },
  {
    key: 49,
    label: "Colombia",
    value: "Colombia",
  },
  {
    key: 50,
    label: "Comoros",
    value: "Comoros",
  },
  {
    key: 51,
    label: "Congo",
    value: "Congo",
  },
  {
    key: 52,
    label: "Congo, Democratic Republic of the",
    value: "Congo, Democratic Republic of the",
  },
  {
    key: 53,
    label: "Cook Islands",
    value: "Cook Islands",
  },
  {
    key: 54,
    label: "Costa Rica",
    value: "Costa Rica",
  },
  {
    key: 55,
    label: "Croatia",
    value: "Croatia",
  },
  {
    key: 56,
    label: "Cuba",
    value: "Cuba",
  },
  {
    key: 57,
    label: "Curaçao",
    value: "Curaçao",
  },
  {
    key: 58,
    label: "Cyprus",
    value: "Cyprus",
  },
  {
    key: 59,
    label: "Czechia",
    value: "Czechia",
  },
  {
    key: 60,
    label: "Côte d'Ivoire",
    value: "Côte d'Ivoire",
  },
  {
    key: 61,
    label: "Denmark",
    value: "Denmark",
  },
  {
    key: 62,
    label: "Djibouti",
    value: "Djibouti",
  },
  {
    key: 63,
    label: "Dominica",
    value: "Dominica",
  },
  {
    key: 64,
    label: "Dominican Republic",
    value: "Dominican Republic",
  },
  {
    key: 65,
    label: "Ecuador",
    value: "Ecuador",
  },
  {
    key: 66,
    label: "Egypt",
    value: "Egypt",
  },
  {
    key: 67,
    label: "El Salvador",
    value: "El Salvador",
  },
  {
    key: 68,
    label: "Equatorial Guinea",
    value: "Equatorial Guinea",
  },
  {
    key: 69,
    label: "Eritrea",
    value: "Eritrea",
  },
  {
    key: 70,
    label: "Estonia",
    value: "Estonia",
  },
  {
    key: 71,
    label: "Eswatini",
    value: "Eswatini",
  },
  {
    key: 72,
    label: "Ethiopia",
    value: "Ethiopia",
  },
  {
    key: 73,
    label: "Falkland Islands (Malvinas)",
    value: "Falkland Islands (Malvinas)",
  },
  {
    key: 74,
    label: "Faroe Islands",
    value: "Faroe Islands",
  },
  {
    key: 75,
    label: "Fiji",
    value: "Fiji",
  },
  {
    key: 76,
    label: "Finland",
    value: "Finland",
  },
  {
    key: 77,
    label: "France",
    value: "France",
  },
  {
    key: 78,
    label: "French Guiana",
    value: "French Guiana",
  },
  {
    key: 79,
    label: "French Polynesia",
    value: "French Polynesia",
  },
  {
    key: 80,
    label: "French Southern Territories",
    value: "French Southern Territories",
  },
  {
    key: 81,
    label: "Gabon",
    value: "Gabon",
  },
  {
    key: 82,
    label: "Gambia",
    value: "Gambia",
  },
  {
    key: 83,
    label: "Georgia",
    value: "Georgia",
  },
  {
    key: 84,
    label: "Germany",
    value: "Germany",
  },
  {
    key: 85,
    label: "Ghana",
    value: "Ghana",
  },
  {
    key: 86,
    label: "Gibraltar",
    value: "Gibraltar",
  },
  {
    key: 87,
    label: "Greece",
    value: "Greece",
  },
  {
    key: 88,
    label: "Greenland",
    value: "Greenland",
  },
  {
    key: 89,
    label: "Grenada",
    value: "Grenada",
  },
  {
    key: 90,
    label: "Guadeloupe",
    value: "Guadeloupe",
  },
  {
    key: 91,
    label: "Guam",
    value: "Guam",
  },
  {
    key: 92,
    label: "Guatemala",
    value: "Guatemala",
  },
  {
    key: 93,
    label: "Guernsey",
    value: "Guernsey",
  },
  {
    key: 94,
    label: "Guinea",
    value: "Guinea",
  },
  {
    key: 95,
    label: "Guinea-Bissau",
    value: "Guinea-Bissau",
  },
  {
    key: 96,
    label: "Guyana",
    value: "Guyana",
  },
  {
    key: 97,
    label: "Haiti",
    value: "Haiti",
  },
  {
    key: 98,
    label: "Heard Island and McDonald Islands",
    value: "Heard Island and McDonald Islands",
  },
  {
    key: 99,
    label: "Holy See",
    value: "Holy See",
  },
  {
    key: 100,
    label: "Honduras",
    value: "Honduras",
  },
  {
    key: 101,
    label: "Hong Kong",
    value: "Hong Kong",
  },
  {
    key: 102,
    label: "Hungary",
    value: "Hungary",
  },
  {
    key: 103,
    label: "Iceland",
    value: "Iceland",
  },
  {
    key: 104,
    label: "India",
    value: "India",
  },
  {
    key: 105,
    label: "Indonesia",
    value: "Indonesia",
  },
  {
    key: 106,
    label: "Iran, Islamic Republic of",
    value: "Iran, Islamic Republic of",
  },
  {
    key: 107,
    label: "Iraq",
    value: "Iraq",
  },
  {
    key: 108,
    label: "Ireland",
    value: "Ireland",
  },
  {
    key: 109,
    label: "Isle of Man",
    value: "Isle of Man",
  },
  {
    key: 110,
    label: "Israel",
    value: "Israel",
  },
  {
    key: 111,
    label: "Italy",
    value: "Italy",
  },
  {
    key: 112,
    label: "Jamaica",
    value: "Jamaica",
  },
  {
    key: 113,
    label: "Japan",
    value: "Japan",
  },
  {
    key: 114,
    label: "Jersey",
    value: "Jersey",
  },
  {
    key: 115,
    label: "Jordan",
    value: "Jordan",
  },
  {
    key: 116,
    label: "Kazakhstan",
    value: "Kazakhstan",
  },
  {
    key: 117,
    label: "Kenya",
    value: "Kenya",
  },
  {
    key: 118,
    label: "Kiribati",
    value: "Kiribati",
  },
  {
    key: 119,
    label: "Korea, Democratic People's Republic of",
    value: "Korea, Democratic People's Republic of",
  },
  {
    key: 120,
    label: "Korea, Republic of",
    value: "Korea, Republic of",
  },
  {
    key: 121,
    label: "Kuwait",
    value: "Kuwait",
  },
  {
    key: 122,
    label: "Kyrgyzstan",
    value: "Kyrgyzstan",
  },
  {
    key: 123,
    label: "Lao People's Democratic Republic",
    value: "Lao People's Democratic Republic",
  },
  {
    key: 124,
    label: "Latvia",
    value: "Latvia",
  },
  {
    key: 125,
    label: "Lebanon",
    value: "Lebanon",
  },
  {
    key: 126,
    label: "Lesotho",
    value: "Lesotho",
  },
  {
    key: 127,
    label: "Liberia",
    value: "Liberia",
  },
  {
    key: 128,
    label: "Libya",
    value: "Libya",
  },
  {
    key: 129,
    label: "Liechtenstein",
    value: "Liechtenstein",
  },
  {
    key: 130,
    label: "Lithuania",
    value: "Lithuania",
  },
  {
    key: 131,
    label: "Luxembourg",
    value: "Luxembourg",
  },
  {
    key: 132,
    label: "Macao",
    value: "Macao",
  },
  {
    key: 133,
    label: "Madagascar",
    value: "Madagascar",
  },
  {
    key: 134,
    label: "Malawi",
    value: "Malawi",
  },
  {
    key: 135,
    label: "Malaysia",
    value: "Malaysia",
  },
  {
    key: 136,
    label: "Maldives",
    value: "Maldives",
  },
  {
    key: 137,
    label: "Mali",
    value: "Mali",
  },
  {
    key: 138,
    label: "Malta",
    value: "Malta",
  },
  {
    key: 139,
    label: "Marshall Islands",
    value: "Marshall Islands",
  },
  {
    key: 140,
    label: "Martinique",
    value: "Martinique",
  },
  {
    key: 141,
    label: "Mauritania",
    value: "Mauritania",
  },
  {
    key: 142,
    label: "Mauritius",
    value: "Mauritius",
  },
  {
    key: 143,
    label: "Mayotte",
    value: "Mayotte",
  },
  {
    key: 144,
    label: "Mexico",
    value: "Mexico",
  },
  {
    key: 145,
    label: "Micronesia, Federated States of",
    value: "Micronesia, Federated States of",
  },
  {
    key: 146,
    label: "Moldova, Republic of",
    value: "Moldova, Republic of",
  },
  {
    key: 147,
    label: "Monaco",
    value: "Monaco",
  },
  {
    key: 148,
    label: "Mongolia",
    value: "Mongolia",
  },
  {
    key: 149,
    label: "Montenegro",
    value: "Montenegro",
  },
  {
    key: 150,
    label: "Montserrat",
    value: "Montserrat",
  },
  {
    key: 151,
    label: "Morocco",
    value: "Morocco",
  },
  {
    key: 152,
    label: "Mozambique",
    value: "Mozambique",
  },
  {
    key: 153,
    label: "Myanmar",
    value: "Myanmar",
  },
  {
    key: 154,
    label: "Namibia",
    value: "Namibia",
  },
  {
    key: 155,
    label: "Nauru",
    value: "Nauru",
  },
  {
    key: 156,
    label: "Nepal",
    value: "Nepal",
  },
  {
    key: 157,
    label: "Netherlands",
    value: "Netherlands",
  },
  {
    key: 158,
    label: "New Caledonia",
    value: "New Caledonia",
  },
  {
    key: 159,
    label: "New Zealand",
    value: "New Zealand",
  },
  {
    key: 160,
    label: "Nicaragua",
    value: "Nicaragua",
  },
  {
    key: 161,
    label: "Niger",
    value: "Niger",
  },
  {
    key: 162,
    label: "Nigeria",
    value: "Nigeria",
  },
  {
    key: 163,
    label: "Niue",
    value: "Niue",
  },
  {
    key: 164,
    label: "Norfolk Island",
    value: "Norfolk Island",
  },
  {
    key: 165,
    label: "North Macedonia",
    value: "North Macedonia",
  },
  {
    key: 166,
    label: "Northern Mariana Islands",
    value: "Northern Mariana Islands",
  },
  {
    key: 167,
    label: "Norway",
    value: "Norway",
  },
  {
    key: 168,
    label: "Oman",
    value: "Oman",
  },
  {
    key: 169,
    label: "Pakistan",
    value: "Pakistan",
  },
  {
    key: 170,
    label: "Palau",
    value: "Palau",
  },
  {
    key: 171,
    label: "Palestine, State of",
    value: "Palestine, State of",
  },
  {
    key: 172,
    label: "Panama",
    value: "Panama",
  },
  {
    key: 173,
    label: "Papua New Guinea",
    value: "Papua New Guinea",
  },
  {
    key: 174,
    label: "Paraguay",
    value: "Paraguay",
  },
  {
    key: 175,
    label: "Peru",
    value: "Peru",
  },
  {
    key: 176,
    label: "Philippines",
    value: "Philippines",
  },
  {
    key: 177,
    label: "Pitcairn",
    value: "Pitcairn",
  },
  {
    key: 178,
    label: "Poland",
    value: "Poland",
  },
  {
    key: 179,
    label: "Portugal",
    value: "Portugal",
  },
  {
    key: 180,
    label: "Puerto Rico",
    value: "Puerto Rico",
  },
  {
    key: 181,
    label: "Qatar",
    value: "Qatar",
  },
  {
    key: 182,
    label: "Romania",
    value: "Romania",
  },
  {
    key: 183,
    label: "Russian Federation",
    value: "Russian Federation",
  },
  {
    key: 184,
    label: "Rwanda",
    value: "Rwanda",
  },
  {
    key: 185,
    label: "Réunion",
    value: "Réunion",
  },
  {
    key: 186,
    label: "Saint Barthélemy",
    value: "Saint Barthélemy",
  },
  {
    key: 187,
    label: "Saint Helena, Ascension and Tristan da Cunha",
    value: "Saint Helena, Ascension and Tristan da Cunha",
  },
  {
    key: 188,
    label: "Saint Kitts and Nevis",
    value: "Saint Kitts and Nevis",
  },
  {
    key: 189,
    label: "Saint Lucia",
    value: "Saint Lucia",
  },
  {
    key: 190,
    label: "Saint Martin (French part)",
    value: "Saint Martin (French part)",
  },
  {
    key: 191,
    label: "Saint Pierre and Miquelon",
    value: "Saint Pierre and Miquelon",
  },
  {
    key: 192,
    label: "Saint Vincent and the Grenadines",
    value: "Saint Vincent and the Grenadines",
  },
  {
    key: 193,
    label: "Samoa",
    value: "Samoa",
  },
  {
    key: 194,
    label: "San Marino",
    value: "San Marino",
  },
  {
    key: 195,
    label: "Sao Tome and Principe",
    value: "Sao Tome and Principe",
  },
  {
    key: 196,
    label: "Saudi Arabia",
    value: "Saudi Arabia",
  },
  {
    key: 197,
    label: "Senegal",
    value: "Senegal",
  },
  {
    key: 198,
    label: "Serbia",
    value: "Serbia",
  },
  {
    key: 199,
    label: "Seychelles",
    value: "Seychelles",
  },
  {
    key: 200,
    label: "Sierra Leone",
    value: "Sierra Leone",
  },
  {
    key: 201,
    label: "Singapore",
    value: "Singapore",
  },
  {
    key: 202,
    label: "Sint Maarten (Dutch part)",
    value: "Sint Maarten (Dutch part)",
  },
  {
    key: 203,
    label: "Slovakia",
    value: "Slovakia",
  },
  {
    key: 204,
    label: "Slovenia",
    value: "Slovenia",
  },
  {
    key: 205,
    label: "Solomon Islands",
    value: "Solomon Islands",
  },
  {
    key: 206,
    label: "Somalia",
    value: "Somalia",
  },
  {
    key: 207,
    label: "South Africa",
    value: "South Africa",
  },
  {
    key: 208,
    label: "South Georgia and the South Sandwich Islands",
    value: "South Georgia and the South Sandwich Islands",
  },
  {
    key: 209,
    label: "South Sudan",
    value: "South Sudan",
  },
  {
    key: 210,
    label: "Spain",
    value: "Spain",
  },
  {
    key: 211,
    label: "Sri Lanka",
    value: "Sri Lanka",
  },
  {
    key: 212,
    label: "Sudan",
    value: "Sudan",
  },
  {
    key: 213,
    label: "Suriname",
    value: "Suriname",
  },
  {
    key: 214,
    label: "Svalbard and Jan Mayen",
    value: "Svalbard and Jan Mayen",
  },
  {
    key: 215,
    label: "Sweden",
    value: "Sweden",
  },
  {
    key: 216,
    label: "Switzerland",
    value: "Switzerland",
  },
  {
    key: 217,
    label: "Syrian Arab Republic",
    value: "Syrian Arab Republic",
  },
  {
    key: 218,
    label: "Taiwan, Province of China",
    value: "Taiwan, Province of China",
  },
  {
    key: 219,
    label: "Tajikistan",
    value: "Tajikistan",
  },
  {
    key: 220,
    label: "Tanzania, United Republic of",
    value: "Tanzania, United Republic of",
  },
  {
    key: 221,
    label: "Thailand",
    value: "Thailand",
  },
  {
    key: 222,
    label: "Timor-Leste",
    value: "Timor-Leste",
  },
  {
    key: 223,
    label: "Togo",
    value: "Togo",
  },
  {
    key: 224,
    label: "Tokelau",
    value: "Tokelau",
  },
  {
    key: 225,
    label: "Tonga",
    value: "Tonga",
  },
  {
    key: 226,
    label: "Trinidad and Tobago",
    value: "Trinidad and Tobago",
  },
  {
    key: 227,
    label: "Tunisia",
    value: "Tunisia",
  },
  {
    key: 228,
    label: "Turkey",
    value: "Turkey",
  },
  {
    key: 229,
    label: "Turkmenistan",
    value: "Turkmenistan",
  },
  {
    key: 230,
    label: "Turks and Caicos Islands",
    value: "Turks and Caicos Islands",
  },
  {
    key: 231,
    label: "Tuvalu",
    value: "Tuvalu",
  },
  {
    key: 232,
    label: "Uganda",
    value: "Uganda",
  },
  {
    key: 233,
    label: "Ukraine",
    value: "Ukraine",
  },
  {
    key: 234,
    label: "United Arab Emirates",
    value: "United Arab Emirates",
  },
  {
    key: 235,
    label: "United Kingdom",
    value: "United Kingdom",
  },
  {
    key: 236,
    label: "United States Minor Outlying Islands",
    value: "United States Minor Outlying Islands",
  },
  {
    key: 237,
    label: "United States",
    value: "United States",
  },
  {
    key: 238,
    label: "Uruguay",
    value: "Uruguay",
  },
  {
    key: 239,
    label: "Uzbekistan",
    value: "Uzbekistan",
  },
  {
    key: 240,
    label: "Vanuatu",
    value: "Vanuatu",
  },
  {
    key: 241,
    label: "Venezuela, Bolivarian Republic of",
    value: "Venezuela, Bolivarian Republic of",
  },
  {
    key: 242,
    label: "Viet Nam",
    value: "Viet Nam",
  },
  {
    key: 243,
    label: "Virgin Islands, British",
    value: "Virgin Islands, British",
  },
  {
    key: 244,
    label: "Virgin Islands, U.S.",
    value: "Virgin Islands, U.S.",
  },
  {
    key: 245,
    label: "Wallis and Futuna",
    value: "Wallis and Futuna",
  },
  {
    key: 246,
    label: "Western Sahara",
    value: "Western Sahara",
  },
  {
    key: 247,
    label: "Yemen",
    value: "Yemen",
  },
  {
    key: 248,
    label: "Zambia",
    value: "Zambia",
  },
  {
    key: 249,
    label: "Zimbabwe",
    value: "Zimbabwe",
  },
];
