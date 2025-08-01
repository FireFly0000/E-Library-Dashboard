import {
  ResponseBase,
  ResponseError,
  ResponseSuccess,
  ResponseSuccessPaginated,
} from "../commons/response";
import { RequestHasLogin } from "types/request.type";
import { db } from "../configs/db.config";
import i18n from "../utils/i18next";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import {
  deleteFileFromS3,
  getFileUrlFromS3,
  uploadFileToS3,
} from "../utils/helper";
import {
  GetUserProfileParams,
  UpdateUserProfileImgParams,
} from "validations/user";
import { Prisma } from "@prisma/client";
import { BookVersionByUserId, UserProfile } from "types/user.type";

const getUserProfile = async (
  params: GetUserProfileParams
): Promise<ResponseBase> => {
  const { search, page_index, userId } = params;
  try {
    // Parse sort field and direction
    const sortBy = params.sortBy || "createdAt DESC";
    const [sortField, sortDirection] = sortBy
      .split(" ")
      .map((item) => (item === "popularity" ? "viewCount" : item));

    const pageSize = 10; // Fixed page size

    const whereClause = {
      book: {
        title: {
          contains: search,
          mode: "insensitive" as Prisma.QueryMode,
        },
      },
      user: {
        id: userId,
      },
    };

    const bookVersionSelectClause = {
      id: true,
      fileName: true,
      viewCount: true,
      book: {
        select: {
          author: {
            select: {
              name: true,
              id: true,
              country: true,
            },
          },
          title: true,
          thumbnail: true,
          id: true,
        },
      },
    };

    const [totalRecords, userProfileRaw] = await db.$transaction([
      db.bookVersion.count({
        where: whereClause,
      }),

      db.user.findUnique({
        where: { id: userId },
        select: {
          username: true,
          email: true,
          url_avatar: true,
          total_views: true,
          bookVersions: {
            where: whereClause,
            orderBy: {
              [sortField]:
                sortDirection.toLowerCase() === "asc" ? "asc" : "desc",
            },
            select: bookVersionSelectClause,
            skip: (page_index - 1) * pageSize,
            take: pageSize,
          },
        },
      }),
    ]);

    if (!userProfileRaw) {
      return new ResponseError(
        400,
        i18n.t("errorMessages.UserProfileNotFound"),
        false
      );
    }

    const bookVersionsData: BookVersionByUserId[] = await Promise.all(
      userProfileRaw.bookVersions.map(async (version) => ({
        id: version.id,
        bookId: version.book.id,
        thumbnail: await getFileUrlFromS3(version.book.thumbnail),
        title: version.book.title,
        fileUrl: await getFileUrlFromS3(version.fileName),
        authorName: version.book.author.name,
        authorCountry: version.book.author.country,
        authorId: version.book.author.id,
        viewCount: version.viewCount,
      }))
    );

    //const totalRecords = booksData.length;
    const totalPages = Math.ceil(totalRecords / pageSize);

    const finalResponse: UserProfile = {
      username: userProfileRaw.username,
      email: userProfileRaw.email,
      url_avatar: await getFileUrlFromS3(userProfileRaw.url_avatar),
      totalViews: userProfileRaw.total_views,
      bookVersions: bookVersionsData,
    };

    return new ResponseSuccessPaginated(
      200,
      i18n.t("successMessages.getUserProfile"),
      true,
      finalResponse, //UserProfile
      totalRecords, // Total number of books returned
      totalPages, // Total number of pages
      page_index, // Current page index
      pageSize // Page size
    );
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return new ResponseError(405, error.toString(), false);
    }
    return new ResponseError(
      500,
      i18n.t("errorMessages.internalServer"),
      false
    );
  }
};

const updateUserProfileImg = async (
  req: RequestHasLogin,
  params: UpdateUserProfileImgParams
): Promise<ResponseBase> => {
  try {
    const { profileId, profileImg } = params;
    if (!req.user_id || req.user_id !== profileId) {
      return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
    }

    const user = await db.user.findUnique({
      where: {
        id: req.user_id,
      },
      select: {
        url_avatar: true,
      },
    });

    if (!user) {
      return new ResponseError(
        400,
        i18n.t("errorMessages.userNotFound"),
        false
      );
    }

    //delete old profile img
    if (user.url_avatar !== null) {
      const deletedImg = await deleteFileFromS3(user.url_avatar);
      if (!deletedImg) {
        return new ResponseError(
          400,
          i18n.t("errorMessages.deleteOldProfileImgFailed"),
          false
        );
      }
    }

    //upload new profile img
    const newImgName = await uploadFileToS3(profileImg);
    if (newImgName === "") {
      return new ResponseError(
        400,
        i18n.t("errorMessages.fileUploadFail"),
        false
      );
    }

    //save new img name to db
    const saveNewFileToDb = await db.user.update({
      where: {
        id: req.user_id,
      },
      data: {
        url_avatar: newImgName,
      },
    });

    if (!saveNewFileToDb) {
      return new ResponseError(
        400,
        i18n.t("errorMessages.fileUploadFail"),
        false
      );
    }

    return new ResponseSuccess(
      200,
      i18n.t("successMessages.changeProfileImg"),
      true
    );
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return new ResponseError(405, error.toString(), false);
    }
    return new ResponseError(
      500,
      i18n.t("errorMessages.internalServer"),
      false
    );
  }
};

const UserService = {
  getUserProfile,
  updateUserProfileImg,
};

export default UserService;
