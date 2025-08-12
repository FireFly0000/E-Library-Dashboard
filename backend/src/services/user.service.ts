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
  MoveBookVersionToTrashParams,
  GetUserProfileParams,
  UpdateUserProfileImgParams,
  UpdateUserBasicInfoParams,
  RecoverTrashedBookVersionParams,
  DeleteBookVersionParams,
} from "validations/user";
import { Prisma } from "@prisma/client";
import {
  BookVersionByUserId,
  TrashedBookVersion,
  UserProfile,
} from "types/user.type";

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
      isTrashed: false,
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
      createdAt: true,
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
        date: version.createdAt,
      }))
    );

    //const totalRecords = booksData.length;
    const totalPages = Math.ceil(totalRecords / pageSize);

    const finalResponse: UserProfile = {
      username: userProfileRaw.username,
      email: userProfileRaw.email,
      url_avatar: userProfileRaw.url_avatar
        ? await getFileUrlFromS3(userProfileRaw.url_avatar)
        : null,
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

const moveBookVersionToTrash = async (
  req: RequestHasLogin,
  params: MoveBookVersionToTrashParams
): Promise<ResponseBase> => {
  try {
    const { profileId, bookVersionId } = params;
    if (!req.user_id || req.user_id !== profileId) {
      return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
    }

    if (typeof profileId !== "number" || typeof bookVersionId !== "number") {
      return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
    }

    const trashedResult = await db.$queryRawUnsafe<{ success: boolean }[]>(`
      WITH updated_version AS (
        UPDATE "BookVersion"
        SET 
          "is_trashed" = TRUE, 
          "trashed_at" = CURRENT_TIMESTAMP
        WHERE id = ${bookVersionId} AND "user_id" = ${profileId}
        RETURNING "book_id", "view_count", "id" AS "updated_version_id"
      ),

      --Update book view_count and isEmpty
      updated_book AS (
        UPDATE "Book" b
        SET 
          is_empty = CASE
            WHEN COALESCE(bv.active_versions,0) = 0
            THEN TRUE
            ELSE b.is_empty
          END,
          view_count = CASE
            WHEN uv.view_count > 0 
            THEN b.view_count - uv.view_count
            ELSE b.view_count
          END
        FROM updated_version uv
        LEFT JOIN (
          SELECT "book_id", COUNT(*) AS active_versions
          FROM "BookVersion" bv2
          WHERE "is_trashed" = FALSE
          AND bv2.id <> (SELECT updated_version_id FROM updated_version)
          GROUP BY "book_id"
        ) bv ON bv.book_id = uv.book_id
        WHERE b.id = uv.book_id
          AND (
            COALESCE(bv.active_versions, 0) = 0  -- No active versions → mark empty
            OR uv.view_count > 0                 -- Or views to decrement
          )
        RETURNING b.id
      ),

      --update user view_count
      updated_user AS (
        UPDATE "User" u
        SET 
          total_views = u.total_views - uv.view_count
        FROM updated_version uv
        WHERE u.id = ${profileId} AND uv.view_count > 0
        RETURNING id
      )
      SELECT EXISTS (SELECT 1 FROM updated_version) AS success;
    `);

    const trashedSucceed = trashedResult[0]?.success ?? false;

    if (trashedSucceed) {
      return new ResponseSuccess(
        200,
        i18n.t("successMessages.trashBookVersion"),
        true
      );
    } else {
      return new ResponseError(
        400,
        i18n.t("errorMessages.trashBookVersionFailed"),
        false
      );
    }
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

//update user basic info (only username for now)
//gender, birth year etc if want to add more
const updateUserBasicInfo = async (
  req: RequestHasLogin,
  params: UpdateUserBasicInfoParams
): Promise<ResponseBase> => {
  try {
    const { username } = params;
    const user_id = req.user_id;
    if (!user_id) {
      return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
    }

    const infoUpdated = await db.user.update({
      where: { id: user_id },
      data: {
        username: username,
      },
    });

    if (!infoUpdated) {
      return new ResponseError(
        400,
        i18n.t("errorMessages.updateUserBasicInfoFailed"),
        false
      );
    }
    return new ResponseSuccess(
      200,
      i18n.t("successMessages.updateUserBasicInfo"),
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

//getBookVersionsInTrash
const getBookVersionsInTrash = async (
  req: RequestHasLogin
): Promise<ResponseBase> => {
  try {
    const userId = req.user_id;
    if (!userId) {
      return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
    }

    const trashedBookVersions = await db.bookVersion.findMany({
      where: {
        userId: userId,
        isTrashed: true,
      },
      select: {
        trashedAt: true,
        id: true,
        fileName: true,
        viewCount: true,
        book: {
          select: {
            title: true,
            thumbnail: true,
            author: {
              select: { name: true, id: true },
            },
          },
        },
      },
      orderBy: {
        trashedAt: "desc",
      },
    });

    if (!trashedBookVersions) {
      return new ResponseError(
        400,
        i18n.t("errorMessages.getTrashedVersionsFailed"),
        false
      );
    }

    const finalResponse: TrashedBookVersion[] = await Promise.all(
      trashedBookVersions.map(async (version) => ({
        id: version.id,
        title: version.book.title,
        thumbnailUrl: await getFileUrlFromS3(version.book.thumbnail),
        viewCount: version.viewCount,
        fileUrl: await getFileUrlFromS3(version.fileName),
        trashedAt: version.trashedAt,
        authorId: version.book.author.id,
        authorName: version.book.author.name,
      }))
    );

    return new ResponseSuccess(
      200,
      i18n.t("successMessages.getTrashedVersions"),
      true,
      finalResponse
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

const recoverTrashedBookVersion = async (
  req: RequestHasLogin,
  params: RecoverTrashedBookVersionParams
): Promise<ResponseBase> => {
  try {
    const userId = req.user_id;
    const { bookVersionId } = params;
    if (
      !userId ||
      typeof userId !== "number" ||
      typeof bookVersionId !== "number"
    ) {
      return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
    }

    const recoveredResult = await db.$queryRawUnsafe<{ success: boolean }[]>(`
      WITH updated_version AS (
        UPDATE "BookVersion"
        SET "is_trashed" = FALSE, "trashed_at" = NULL
        WHERE id = ${bookVersionId} AND "user_id" = ${userId}
        RETURNING "book_id", "view_count"
      ),
      updated_book AS (
        UPDATE "Book" b
        SET
          is_empty = CASE
            WHEN b.is_empty = TRUE THEN FALSE
            ELSE b.is_empty
          END,
          view_count = CASE
            WHEN uv.view_count > 0   
            THEN b.view_count + uv.view_count
            ELSE b.view_count
          END
        FROM updated_version uv
        WHERE b.id = uv.book_id
          AND (b.is_empty = TRUE OR uv.view_count > 0)
      ),
      updated_user AS (
        UPDATE "User" u
        SET 
          total_views = u.total_views + uv.view_count
        FROM updated_version uv
        WHERE u.id = ${userId} AND uv.view_count > 0
        RETURNING id
      )
      SELECT EXISTS (SELECT 1 FROM updated_version) AS success;
    `);
    const recoveredSucceed = recoveredResult[0].success;

    if (!recoveredSucceed) {
      return new ResponseError(
        400,
        i18n.t("errorMessages.recoverVersionFailed"),
        false
      );
    }
    return new ResponseSuccess(
      200,
      i18n.t("successMessages.recoverVersionSuccess"),
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

const deleteBookVersion = async (
  req: RequestHasLogin,
  params: DeleteBookVersionParams
): Promise<ResponseBase> => {
  try {
    const userId = req.user_id;
    const { bookVersionId } = params;
    if (
      !userId ||
      typeof userId !== "number" ||
      typeof bookVersionId !== "number"
    ) {
      return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
    }

    const versionDeleted: boolean = await db.$transaction(async (tx) => {
      const trashedVersion = await tx.bookVersion.findUnique({
        where: {
          id: bookVersionId,
          userId: userId,
          isTrashed: true,
        },
        select: {
          id: true,
          fileName: true,
        },
      });

      if (!trashedVersion) return false;

      const fileDeleted = await deleteFileFromS3(trashedVersion.fileName);

      if (!fileDeleted) {
        return false;
      }

      const versionDeleted = await tx.bookVersion.delete({
        where: {
          id: trashedVersion.id,
        },
      });

      if (!versionDeleted) {
        return false;
      }
      return true;
    });

    if (!versionDeleted) {
      return new ResponseError(
        400,
        i18n.t("errorMessages.deleteBookVersionFailed"),
        false
      );
    }

    return new ResponseSuccess(
      200,
      i18n.t("successMessages.deleteBookVersionSuccess"),
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
  moveBookVersionToTrash,
  updateUserBasicInfo,
  getBookVersionsInTrash,
  recoverTrashedBookVersion,
  deleteBookVersion,
};

export default UserService;
