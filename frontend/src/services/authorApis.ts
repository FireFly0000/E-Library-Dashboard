import { createApi } from "@reduxjs/toolkit/query/react";
import { RtkBaseQuery } from "@/api-config/axiosInstance";
import { Response } from "@/types/response";
import { Author } from "@/types/authors";

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

    //Other APIs go here
  }),
});

export const { useSearchAuthorsByNameQuery } = authorApi;
