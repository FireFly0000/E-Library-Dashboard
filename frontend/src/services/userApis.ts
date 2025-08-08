import { createApi } from "@reduxjs/toolkit/query/react";
import { RtkBaseQuery } from "@/api-config/axiosInstance";
import { ResponsePagination, Response } from "@/types/response";
import {
  GetUserProfileParams,
  UserProfile,
  TrashedBookVersion,
} from "@/types/user";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: RtkBaseQuery({ baseUrl: "" }),
  tagTypes: ["books", "users", "trashed"],
  endpoints: (builder) => ({
    getUserProfile: builder.query<
      ResponsePagination<UserProfile>,
      GetUserProfileParams
    >({
      query: ({ search, userId, page_index, sortBy }) => ({
        url: `users/profile?page_index=${page_index}&search=${search}&userId=${userId}&sortBy=${sortBy}`,
        method: "GET",
      }),
      providesTags: ["books", "users"],
    }),

    getBookVersionsInTrash: builder.query<Response<TrashedBookVersion[]>, void>(
      {
        query: () => ({
          url: "users/get-book-versions-in-trash",
          method: "GET",
        }),
        providesTags: ["trashed"],
      }
    ),
  }),
});

export const { useGetUserProfileQuery, useGetBookVersionsInTrashQuery } =
  userApi;
