import { createApi } from "@reduxjs/toolkit/query/react";
import { RtkBaseQuery } from "@/api-config/axiosInstance";
import { ResponsePagination } from "@/types/response";
import { GetUserProfileParams, UserProfile } from "@/types/user";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: RtkBaseQuery({ baseUrl: "" }),
  tagTypes: ["books", "users"],
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
  }),
});

export const { useGetUserProfileQuery } = userApi;
