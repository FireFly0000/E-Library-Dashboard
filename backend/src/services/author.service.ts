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
  FilterAuthorsByName as FilterAuthorsByNameParams,
  CreateAuthor as CreateAuthorParams,
} from "../validations/author";
import { formatAuthorName } from "../utils/helper";

//Get all authors paging (without books)
const getAllAuthorsPaging = async (
  req: RequestHasLogin,
  params: GetAllAuthorsPagingParams
): Promise<ResponseBase> => {
  try {
    const { search, country, sortBy, page_index, category } = params;
    const userId = req.user_id;

    if (!userId) {
      return new ResponseError(
        401,
        i18n.t("errorMessages.unauthorized"),
        false
      );
    }
    const pageSize = 10; // Fixed page size

    const authorsData: [] = await db.$queryRawUnsafe(
      `
      SELECT a.*, COALESCE(SUM(b."view_count"), 0) AS popularity
      FROM "Author" a
      LEFT JOIN "Book" b ON b."author_id" = a."id"
      LEFT JOIN "Category" c ON c."id" = b."category_id"
      WHERE (a."name" ILIKE $1 AND a."country" ILIKE $2)
      AND (c."category_code" = $3 OR $3 = '') 
      GROUP BY a.id
      ORDER BY ${sortBy}
      LIMIT ${pageSize} OFFSET ${(page_index - 1) * pageSize}
    `,
      `%${search || ""}%`,
      `%${country || ""}%`,
      category || ""
    );

    const totalRecords = authorsData.length;
    const totalPages = Math.ceil(totalRecords / pageSize);

    return new ResponseSuccessPaginated(
      200,
      i18n.t("successMessages.getAllAuthors"),
      true,
      authorsData,
      totalRecords, // Total number of authors returned
      totalPages, // Total number of pages
      page_index, // Current page index
      pageSize // Page size
    );
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      return new ResponseError(400, error.toString(), false);
    }

    return new ResponseError(
      500,
      i18n.t("errorMessages.internalServer"),
      false
    );
  }
};

//filter authors by name
export const filterAuthorsByName = async (
  req: RequestHasLogin,
  params: FilterAuthorsByNameParams
): Promise<ResponseBase> => {
  try {
    const { name, withBooks } = params;
    const userId = req.user_id;

    if (userId) {
      const authors = await db.author.findMany({
        where: {
          name: {
            contains: name,
            mode: "insensitive", // Case insensitive search
          },
        },
        include: {
          books: withBooks, // Include books if needed
        },
      });

      return new ResponseSuccess(
        200,
        i18n.t("successMessages.filterAuthorsByName"),
        true,
        authors
      );
    }
    return new ResponseError(401, i18n.t("errorMessages.unauthorized"), false);
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
      return new ResponseError(
        401,
        i18n.t("errorMessages.unauthorized"),
        false
      );
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
  filterAuthorsByName,
  createAuthor,
};
export default AuthorService;
