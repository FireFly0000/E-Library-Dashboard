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
  BookSchema,
  GetAllBooksPaging,
  GetBooksByTitleAndAuthor,
  GetBookVersionsById,
  UpdateViewsParams,
  AITranslateParams,
  GetBooksPagingByAuthorID,
} from "../validations/book";
import {
  uploadFileToS3,
  getFileUrlFromS3,
  parseSearchTitleAndAuthor,
  hashAIRedisKey,
} from "../utils/helper";
import { generateBookSlug } from "../utils/helper";
import { CategoryCode } from "@prisma/client";
import {
  BookInfo,
  BookResponse,
  SearchTitleAndAuthorResponse,
  BookByAuthorId,
  BookByAuthorDashboardResponse,
} from "types/book.type";
import { formatAuthorName, formatBookTitle } from "../utils/helper";
import { Prisma } from "@prisma/client";
import redis from "../configs/redis.config";
import { genAI } from "../configs/genAi.config";

const createBook = async (
  req: RequestHasLogin,
  params: BookSchema
): Promise<ResponseBase> => {
  try {
    if (!req.user_id) {
      return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
    }

    const hasBookId = !!params.bookVersion?.bookId;

    const hasBookInfo =
      params.title && params.category && params.description && params.thumbnail;

    //Add new book, first bookVersion and new Author
    if (hasBookInfo && !hasBookId) {
      // Prepare the author relation data conditionally (new vs existing author)
      let authorRelation = null;
      let authorName = params.author
        ? formatAuthorName(params.author.name)
        : "";
      if (params.authorId) {
        authorRelation = { connect: { id: params.authorId } };
        //Assign authorName with corresponding name from authorId
        await db.author
          .findUnique({
            where: {
              id: params.authorId,
            },
            select: {
              name: true,
            },
          })
          .then((response) => {
            authorName = response.name;
          });
      } else if (params.author?.country && params.author?.name) {
        //if new author already exists, connect to that author instead
        const existingAuthor = await db.author.findFirst({
          where: {
            name: authorName,
            country: params.author.country,
          },
        });
        if (existingAuthor) {
          authorRelation = { connect: { id: existingAuthor.id } };
          authorName = existingAuthor.name;
        } else {
          authorRelation = {
            create: {
              name: authorName,
              country: params.author.country,
            },
          };
        }
      } else {
        throw new Error("Missing author information");
      }

      //generate book's slug for insert
      const slug = generateBookSlug(params.title, authorName);

      const existingBook = await db.book.findUnique({ where: { slug } });

      if (existingBook) {
        return new ResponseError(
          400,
          i18n.t("errorMessages.bookAlreadyExist"),
          false
        );
      }

      // reserve slug (insert a placeholder) to wait for duplicate check
      //Avoiding spamming duplicate files to S3
      const newBook = await db.book.create({
        data: {
          title: formatBookTitle(params.title),
          category: {
            connect: { categoryCode: params.category as CategoryCode },
          },
          author: authorRelation,
          description: params.description,
          thumbnail: "Uploading...",
          slug: slug,
          versions: {
            create: {
              user: { connect: { id: params.bookVersion.userId } },
              fileName: "Uploading...",
            },
          },
        },
        include: {
          versions: true,
        },
      });
      const thumbnailName = await uploadFileToS3(params.thumbnail[0]);
      const bookFileName = await uploadFileToS3(params.bookVersion.bookFile[0]);

      if (thumbnailName === "" || bookFileName === "") {
        await db.book.delete({
          where: {
            id: newBook.id,
          },
        });
        return new ResponseError(
          400,
          i18n.t("errorMessages.fileUploadFail"),
          false
        );
      }

      //update files' names once upload is completed
      const newBookAdded = await db.book.update({
        where: {
          id: newBook.id,
        },
        data: {
          thumbnail: thumbnailName,
          versions: {
            update: {
              where: { id: newBook.versions[0].id },
              data: { fileName: bookFileName },
            },
          },
        },
      });

      if (!newBookAdded) {
        return new ResponseError(
          400,
          i18n.t("errorMessages.createBookFail"),
          false
        );
      }

      return new ResponseSuccess(
        200,
        i18n.t("successMessages.createBookSuccessfully"),
        true
      );
    }
    //Added bookVersion to existing book
    else if (!hasBookInfo && hasBookId) {
      const bookFileName = await uploadFileToS3(params.bookVersion.bookFile);

      if (bookFileName === "") {
        return new ResponseError(
          400,
          i18n.t("errorMessages.fileUploadFail"),
          false
        );
      }

      const bookVersionAdded = await db.bookVersion.create({
        data: {
          user: { connect: { id: params.bookVersion.userId } },
          fileName: bookFileName,
          book: {
            connect: { id: params.bookVersion.bookId },
          },
        },
      });

      if (!bookVersionAdded) {
        return new ResponseError(
          400,
          i18n.t("errorMessages.createBookVersionFail"),
          false
        );
      }

      return new ResponseSuccess(
        200,
        i18n.t("successMessages.createBookSuccessfully"),
        true
      );
    }
  } catch (error) {
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

const getAllBooksPaging = async (
  params: GetAllBooksPaging
): Promise<ResponseBase> => {
  try {
    const { search, country, page_index, category } = params;

    // Parse sort field and direction
    const sortBy = params.sortBy || "createdAt DESC";
    const [sortField, sortDirection] = sortBy
      .split(" ")
      .map((item) => (item === "popularity" ? "viewCount" : item));

    const pageSize = 16; // Fixed page size

    const categoryFilter = category && category !== "All" ? category : null;
    const whereClause = {
      title: {
        contains: search,
        mode: "insensitive" as Prisma.QueryMode,
      },
      category: categoryFilter
        ? {
            categoryCode: categoryFilter as CategoryCode,
          }
        : undefined,
      author:
        country !== "All"
          ? {
              country: country,
            }
          : undefined,
    };

    const [booksDataRaw, totalRecords] = await db.$transaction([
      db.book.findMany({
        where: whereClause,
        orderBy: {
          [sortField]: sortDirection.toLowerCase() === "asc" ? "asc" : "desc",
        },
        select: {
          id: true,
          title: true,
          thumbnail: true,
          authorId: true,
          categoryId: true,
          viewCount: true,
        },
        skip: (page_index - 1) * pageSize,
        take: pageSize,
      }),
      db.book.count({
        where: whereClause,
      }),
    ]);

    if (!booksDataRaw) {
      return new ResponseError(400, i18n.t("errorMessages.NoBookFound"), false);
    }

    const booksData: BookResponse[] = await Promise.all(
      booksDataRaw.map(async (book) => ({
        id: book.id,
        title: book.title,
        authorId: book.authorId,
        categoryId: book.categoryId,
        thumbnailUrl: await getFileUrlFromS3(book.thumbnail),
        viewCount: book.viewCount,
      }))
    );

    //const totalRecords = booksData.length;
    const totalPages = Math.ceil(totalRecords / pageSize);

    return new ResponseSuccessPaginated(
      200,
      i18n.t("successMessages.getAllBooks"),
      true,
      booksData, //BookResponse[]
      totalRecords, // Total number of books returned
      totalPages, // Total number of pages
      page_index, // Current page index
      pageSize // Page size
    );
  } catch (error) {
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

const getBooksByTiTleAndAuthor = async (
  req: RequestHasLogin,
  params: GetBooksByTitleAndAuthor
): Promise<ResponseBase> => {
  try {
    if (!req.user_id) {
      return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
    }
    const { search } = params;

    if (!search || search.trim() === "") {
      return new ResponseSuccess(
        200,
        i18n.t("successMessages.noSearchInput"),
        true,
        []
      );
    }

    const { title, author } = parseSearchTitleAndAuthor(search);
    const books = await db.book.findMany({
      select: {
        id: true,
        title: true,
        thumbnail: true,
        author: {
          select: {
            name: true,
          },
        },
      },
      where: {
        title: {
          contains: title,
          mode: "insensitive",
        },
        author: {
          name: {
            contains: author,
            mode: "insensitive",
          },
        },
      },
    });

    const responseData: SearchTitleAndAuthorResponse[] = await Promise.all(
      books.map(async (book) => ({
        id: book.id,
        title: book.title,
        author: book.author.name,
        thumbnailUrl: await getFileUrlFromS3(book.thumbnail),
      }))
    );

    return new ResponseSuccess(
      200,
      i18n.t("successMessages.searchBookByTitleAndAuthor"),
      true,
      responseData
    );
  } catch (error) {
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

const getBookVersions = async (
  //req: RequestHasLogin,
  params: GetBookVersionsById
): Promise<ResponseBase> => {
  try {
    //if (!req.user_id) {
    //  return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
    //}
    const { bookId, page_index } = params;
    // Parse sort field and direction
    const sortBy = params.sortBy || "createdAt DESC";
    const [sortField, sortDirection] = sortBy
      .split(" ")
      .map((item) => (item === "popularity" ? "viewCount" : item));

    const pageSize = 10; // Fixed page size

    const [bookRawInfo, totalRecords] = await db.$transaction([
      db.book.findUnique({
        where: {
          id: bookId,
        },
        select: {
          id: true,
          title: true,
          description: true,
          thumbnail: true,
          viewCount: true,
          author: {
            select: {
              name: true,
              country: true,
            },
          },
          versions: {
            select: {
              id: true,
              fileName: true,
              viewCount: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
            orderBy: {
              [sortField]:
                sortDirection.toLowerCase() === "asc" ? "asc" : "desc",
            },
            skip: (page_index - 1) * pageSize,
            take: pageSize,
          },
        },
      }),
      db.bookVersion.count({
        where: {
          bookId: bookId,
        },
      }),
    ]);

    if (!bookRawInfo) {
      return new ResponseError(
        400,
        i18n.t("errorMessages.bookDoesNotExist"),
        false
      );
    }

    //const totalRecords = booksData.length;
    const totalPages = Math.ceil(totalRecords / pageSize);

    const bookInfo: BookInfo = {
      title: bookRawInfo.title,
      authorName: bookRawInfo.author.name,
      authorCountry: bookRawInfo.author.country,
      description: bookRawInfo.description,
      thumbnailUrl: await getFileUrlFromS3(bookRawInfo.thumbnail),
      totalViews: bookRawInfo.viewCount,
      versions: await Promise.all(
        bookRawInfo.versions.map(async (version) => ({
          id: version.id,
          fileUrl: await getFileUrlFromS3(version.fileName),
          viewCount: version.viewCount,
          createdAt: version.createdAt,
          contributorName: version.user.username,
          contributorId: version.user.id,
        }))
      ),
    };

    return new ResponseSuccessPaginated(
      200,
      i18n.t("successMessages.getBookVersions"),
      true,
      bookInfo,
      totalRecords,
      totalPages,
      page_index,
      pageSize
    );
  } catch (error) {
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

const updateBooksViews = async (
  req: RequestHasLogin,
  params: UpdateViewsParams & { ip: string }
): Promise<ResponseBase> => {
  try {
    const { bookVersionId, bookId, contributorId, ip } = params;

    const userId = req.user_id; // if logged in

    if (!userId && !ip) {
      return new ResponseError(
        400,
        i18n.t("errorMessages.userIdOrIpIsRequired"),
        false
      );
    }

    const viewerKey = userId
      ? `viewed_bookVersion_${bookVersionId}_user_${userId}`
      : `viewed_bookVersion_${bookVersionId}_ip_${ip}`;

    const alreadyViewed = await redis.get(viewerKey);

    if (alreadyViewed) {
      return new ResponseSuccess(
        200,
        i18n.t("successMessages.viewCountedForCurrentSession"),
        true
      );
    }

    //5 hours for a view session, before another view could be added
    await redis.set(viewerKey, "true", "EX", 60 * 60 * 5);

    //Increment views with check
    const viewsUpdated = await db.$transaction(async (tx) => {
      // Check if bookVersion belongs to the book and user
      const bookVersion = await tx.bookVersion.findUnique({
        where: { id: bookVersionId, userId: contributorId },
      });

      if (!bookVersion || bookVersion.bookId !== bookId) {
        throw new Error("BookVersionDoesNotBelongToBookOrUser");
      }

      const bookUpdate = await tx.book.update({
        where: { id: bookId },
        data: { viewCount: { increment: 1 } },
      });

      const versionUpdate = await tx.bookVersion.update({
        where: { id: bookVersionId },
        data: { viewCount: { increment: 1 } },
      });

      const userUpdate = await tx.user.update({
        where: { id: contributorId },
        data: { total_views: { increment: 1 } },
      });

      return { bookUpdate, versionUpdate, userUpdate };
    });

    if (!viewsUpdated) {
      return new ResponseError(
        400,
        i18n.t("successMessages.viewsIncrementFailed"),
        false
      );
    }

    return new ResponseSuccess(
      200,
      i18n.t("successMessages.viewsIncrementSuccessfully"),
      true
    );
  } catch (error) {
    if (error.message === "BookVersionDoesNotBelongToBookOrUser") {
      return new ResponseError(
        400,
        i18n.t("errorMessages.viewsIncrementFailed"),
        false
      );
    }
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

const AIContentServices = async (
  params: AITranslateParams
): Promise<ResponseBase> => {
  try {
    const { content, title, language, service } = params;

    const redisKey = hashAIRedisKey(content, service, language, title);
    const cacheKey = `bookAIServices_${redisKey}`;
    const cachedResponse = await redis.get(cacheKey);

    if (cachedResponse) {
      return new ResponseSuccess(
        200,
        i18n.t("successMessages.AIContentGeneratedSuccessfully"),
        true,
        cachedResponse
      );
    }

    const formatPrompt = `Format the response as HTML fragment only (no <html> or <head> or <body> tags, do not begin with \`\`\`html),
    suitable for rendering in a Tailwind-based React frontend. 
    
    1,The main content must be separated sections with bullet points in each section for clarity. 
    2,The bullet point must be <li></li> only do not use <ul></ul>. 
    3,Must add space between sections, and each section must have a bold header.
    5,Must include a brief intro before the sections and a summary after the sections 
    5,Do not add any padding, border, and all text must be of color text-foreground`;

    const contentPrompt =
      service === "translate"
        ? `Translate the below chunk of content from the book ${title} into the language ${language}. Just give the translation, don't add anything else.\n${content}`
        : service === "discuss"
        ? `${formatPrompt}. Discuss the below content from the book ${title} in the language ${language}.\n${content}.`
        : service === "summarize"
        ? `${formatPrompt}. Summarize the context of the below content from the book ${title} in the language ${language}.\n${content}.`
        : `Nothing`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contentPrompt,
    });

    await redis.set(cacheKey, response.text, "EX", 60 * 15); //expires in 15 mins

    //for await (const chunk of response) {
    //  console.log(chunk.text);
    //}

    return new ResponseSuccess(
      200,
      i18n.t("successMessages.AIContentGeneratedSuccessfully"),
      true,
      response.text
    );
  } catch (error) {
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

const getBooksPagingByAuthorID = async (
  params: GetBooksPagingByAuthorID
): Promise<ResponseBase> => {
  try {
    const { search, page_index, category, authorId } = params;

    // Parse sort field and direction
    const sortBy = params.sortBy || "createdAt DESC";
    const [sortField, sortDirection] = sortBy
      .split(" ")
      .map((item) => (item === "popularity" ? "viewCount" : item));

    const pageSize = 16; // Fixed page size

    const categoryFilter = category && category !== "All" ? category : null;
    const whereClause = {
      title: {
        contains: search,
        mode: "insensitive" as Prisma.QueryMode,
      },
      category: categoryFilter
        ? {
            categoryCode: categoryFilter as CategoryCode,
          }
        : undefined,
      author: {
        id: authorId,
      },
    };

    const [booksDataRaw, totalRecords, totalViewsRes] = await db.$transaction([
      db.book.findMany({
        where: whereClause,
        orderBy: {
          [sortField]: sortDirection.toLowerCase() === "asc" ? "asc" : "desc",
        },
        select: {
          id: true,
          title: true,
          thumbnail: true,
          authorId: true,
          categoryId: true,
          viewCount: true,
        },
        skip: (page_index - 1) * pageSize,
        take: pageSize,
      }),
      db.book.count({
        where: whereClause,
      }),
      db.$queryRawUnsafe<{ total_views: number }>(
        `SELECT SUM("view_count") as total_views
        FROM "Book"
        WHERE "author_id" = $1
        `,
        authorId
      ),
    ]);

    if (!booksDataRaw) {
      return new ResponseError(400, i18n.t("errorMessages.NoBookFound"), false);
    }

    const booksData: BookByAuthorId[] = await Promise.all(
      booksDataRaw.map(async (book) => ({
        id: book.id,
        title: book.title,
        authorId: book.authorId,
        thumbnailUrl: await getFileUrlFromS3(book.thumbnail),
        viewCount: book.viewCount,
      }))
    );

    const finalResponse: BookByAuthorDashboardResponse = {
      totalViews: Number(totalViewsRes[0]?.total_views ?? 0),
      books: booksData,
    };

    //const totalRecords = booksData.length;
    const totalPages = Math.ceil(totalRecords / pageSize);

    return new ResponseSuccessPaginated(
      200,
      i18n.t("successMessages.getAllBooksByAuthorID"),
      true,
      finalResponse, //BookByAuthorDashboardResponse
      totalRecords, // Total number of books returned
      totalPages, // Total number of pages
      page_index, // Current page index
      pageSize // Page size
    );
  } catch (error) {
    console.log(error);
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

const BookService = {
  createBook,
  getAllBooksPaging,
  getBooksByTiTleAndAuthor,
  getBookVersions,
  updateBooksViews,
  AIContentServices,
  getBooksPagingByAuthorID,
};

export default BookService;
