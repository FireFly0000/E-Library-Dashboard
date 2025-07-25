import { createApi } from "@reduxjs/toolkit/query/react";
import { RtkBaseQuery } from "@/api-config/axiosInstance";
import {
  Book,
  BookSearchTitleAndAuthor,
  BookInfo,
  BookInfoParams,
  AIServicesParams,
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

    AIContentServices: builder.query<Response<string>, AIServicesParams>({
      query: ({ content, language, title, service }) => ({
        url: `books/ai-services?content=${content}&language=${language}&title=${title}&service=${service}`,
        method: "GET",
      }),
      providesTags: ["AI-services"],
    }),

    /*StreamAIContent: builder.query({
      queryFn: () => ({ data: "" }), //Initial empty data
      async onCacheEntryAdded(
        { content, language, title, service }: AIServicesParams,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved }
      ) {
        await cacheDataLoaded; // Wait for initial data (if any) to load
        const baseURL = import.meta.env.VITE_BASE_URL;

        const url = new URL(`${baseURL}/books/ai-services`);
        url.searchParams.set("content", content);
        url.searchParams.set("language", language);
        url.searchParams.set("title", title);
        url.searchParams.set("service", service);

        const eventSource = new EventSource(url.toString());

        eventSource.onmessage = (e) => {
          updateCachedData((draft) => {
            return draft + e.data;
          });
        };

        eventSource.onerror = (error) => {
          console.error("SSE Error:", error);
          eventSource.close();
        };

        await cacheEntryRemoved; // Wait for the cache entry to be removed
        eventSource.close(); // Close the SSE connection
      },
    }),*/
  }),
});

export const {
  useGetBooksPagingQuery,
  useGetBooksSearchByTitleAndAuthorQuery,
  useGetBookVersionsQuery,
  useAIContentServicesQuery,
} = bookApi;
