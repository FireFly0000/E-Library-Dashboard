import {
  ResponseBase,
  ResponseError,
  ResponseSuccess,
  ResponseSuccessPaginated,
} from "../commons/response";
import { db } from "../configs/db.config";
import i18n from "../utils/i18next";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { RequestHasLogin } from "../types/request.type";
import {
  GetAllAuthorsPaging as GetAllAuthorsPagingParams,
  SearchAuthorsByName as SearchAuthorsByNameParams,
  CreateAuthor as CreateAuthorParams,
  AuthorWithPopularity,
} from "../validations/author";
import { formatAuthorName } from "../utils/helper";

//Get all authors paging (without books)
const getAllAuthorsPaging = async (
  params: GetAllAuthorsPagingParams
): Promise<ResponseBase> => {
  try {
    const { search, country, sortBy, page_index, category } = params;

    const pageSize = 10; // Fixed page size

    let sortOption = "a.created_at DESC";
    if (sortBy.includes("created_at")) {
      sortOption = `a.${sortBy}`;
    }

    const authorsData: AuthorWithPopularity[] = await db.$queryRawUnsafe(
      `
      SELECT a.*, COALESCE(SUM(b."view_count"), 0) AS popularity
      FROM "Author" a
      LEFT JOIN "Book" b ON b."author_id" = a."id"
      LEFT JOIN "Category" c ON c."id" = b."category_id"
      WHERE (a."name" ILIKE $1 AND a."country" ILIKE $2)
      AND (c."category_code" = $3::"CategoryCode" OR $3 IS NULL) 
      GROUP BY a.id
      ORDER BY ${sortOption}
      LIMIT ${pageSize} OFFSET ${(page_index - 1) * pageSize}
    `,
      `%${search || ""}%`,
      `%${country === "All" ? "" : country}%`,
      category === "All" ? null : category
    );

    const totalRecords = authorsData.length;
    const totalPages = Math.ceil(totalRecords / pageSize);

    const normalizedAuthorsData = authorsData.map((author) => ({
      ...author,
      popularity: Number(author.popularity),
    }));

    return new ResponseSuccessPaginated(
      200,
      i18n.t("successMessages.getAllAuthors"),
      true,
      normalizedAuthorsData,
      totalRecords, // Total number of authors returned
      totalPages, // Total number of pages
      page_index, // Current page index
      pageSize // Page size
    );
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      return new ResponseError(400, error.toString(), false);
    }
    console.log(error);
    return new ResponseError(
      500,
      i18n.t("errorMessages.internalServer"),
      false
    );
  }
};

//Search authors by name
export const searchAuthorsByName = async (
  req: RequestHasLogin,
  params: SearchAuthorsByNameParams
): Promise<ResponseBase> => {
  try {
    const { name } = params;
    const userId = req.user_id;

    if (userId) {
      const authors = await db.author.findMany({
        where: {
          name: {
            contains: name,
            mode: "insensitive", // Case insensitive search
          },
        },
      });

      return new ResponseSuccess(
        200,
        i18n.t("successMessages.filterAuthorsByName"),
        true,
        authors
      );
    }
    return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      return new ResponseError(400, e.toString(), false);
    }

    return new ResponseError(
      500,
      i18n.t("errorMessages.internalServer"),
      false
    );
  }
};

//Create author
export const createAuthor = async (
  req: RequestHasLogin,
  params: CreateAuthorParams
): Promise<ResponseBase> => {
  try {
    const userId = req.user_id;

    if (!userId) {
      return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
    }

    const authorData: CreateAuthorParams = {
      name: formatAuthorName(params.name),
      country: params.country,
    };

    const newAuthor = await db.author.create({
      data: authorData,
    });

    if (newAuthor) {
      return new ResponseSuccess(
        200,
        i18n.t("successMessages.newAuthorCreated"),
        true,
        newAuthor
      );
    } else {
      return new ResponseError(
        400,
        i18n.t("errorMessages.createdAuthorFailed"),
        false
      );
    }
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      return new ResponseError(400, e.toString(), false);
    }

    return new ResponseError(
      500,
      i18n.t("errorMessages.internalServer"),
      false
    );
  }
};

const AuthorService = {
  getAllAuthorsPaging,
  searchAuthorsByName,
  createAuthor,
};
export default AuthorService;
