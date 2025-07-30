import { createApi } from "@reduxjs/toolkit/query/react";
import { RtkBaseQuery } from "@/api-config/axiosInstance";
import { ResponsePagination, Response } from "@/types/response";
import {
  Author,
  AuthorDashboardResponse,
  AuthorsPaginationParams,
} from "@/types/authors";

export const authorApi = createApi({
  reducerPath: "authorApi",
  baseQuery: RtkBaseQuery({ baseUrl: "" }),
  endpoints: (builder) => ({
    searchAuthorsByName: builder.query<Response<Author[]>, string>({
      query: (name) => ({
        url: `authors/search-by-name?name=${name}`,
        method: "GET",
      }),
    }),

    allAuthorsPaging: builder.query<
      ResponsePagination<AuthorDashboardResponse[]>,
      AuthorsPaginationParams
    >({
      query: ({ search, page_index, country, category, sortBy }) => ({
        url: `authors/paging?page_index=${page_index}&search=${search}&country=${country}&sortBy=${sortBy}&category=${category}`,
        method: "GET",
      }),
    }),
    //Other APIs go here
  }),
});

export const { useSearchAuthorsByNameQuery, useAllAuthorsPagingQuery } =
  authorApi;
