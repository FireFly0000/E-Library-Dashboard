import { createApi } from "@reduxjs/toolkit/query/react";
import { RtkBaseQuery } from "@/api-config/axiosInstance";
import {
  Book,
  BookSearchTitleAndAuthor,
  BookInfo,
  BookInfoParams,
} from "@/types/books";
import { BooksPaginationParams } from "@/types/books";
import { ResponsePagination, Response } from "@/types/response";

export const bookApi = createApi({
  reducerPath: "bookApi",
  baseQuery: RtkBaseQuery({ baseUrl: "" }),
  tagTypes: ["books", "AI-services"],
  endpoints: (builder) => ({
    getBooksPaging: builder.query<
      ResponsePagination<Book[]>,
      BooksPaginationParams
    >({
      query: ({ search, page_index, country, category, sortBy }) => ({
        url: `books/paging?page_index=${page_index}&search=${search}&country=${country}&sortBy=${sortBy}&category=${category}`,
        method: "GET",
      }),
      providesTags: ["books"],
    }),

    getBooksSearchByTitleAndAuthor: builder.query<
      Response<BookSearchTitleAndAuthor[]>,
      string
    >({
      query: (search) => ({
        url: `books/title-by-author?search=${search}`,
        method: "GET",
      }),
      providesTags: ["books"],
    }),

    getBookVersions: builder.query<
      ResponsePagination<BookInfo>,
      BookInfoParams
    >({
      query: ({ bookId, page_index, sortBy }) => ({
        url: `books/book-versions?bookId=${bookId}&page_index=${page_index}&sortBy=${sortBy}`,
        method: "GET",
      }),
      providesTags: ["books"],
    }),

    /*AIContentServices: builder.query<Response<string>, BookAIServicesParams>({
      query: ({ content, language, title, service }) => ({
        url: `books/ai-services?content=${content}&language=${language}&title=${title}&service=${service}`,
        method: "GET",
      }),
      providesTags: ["AI-services"],
    }),*/
  }),
});

export const {
  useGetBooksPagingQuery,
  useGetBooksSearchByTitleAndAuthorQuery,
  useGetBookVersionsQuery,
  //useAIContentServicesQuery,
} = bookApi;
