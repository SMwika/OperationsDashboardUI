import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "@/constants";
import { handleApiResponse } from "@/helpers";
import { IResponse } from "@/interfaces";
import { getPersistedAccessToken } from "@/auth/msal";

interface ILookupParams {
  [key: string]: any;
}

export const commonApi = createApi({
  reducerPath: "common/api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}`,
    prepareHeaders: (headers) => {
      const token = getPersistedAccessToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (build) => ({
    getLookup: build.query<any, ILookupParams>({
      query: (params) => ({
        url: "preloading/data",
        method: "POST",
        body: { params },
      }),
      transformResponse: (response: IResponse) => handleApiResponse(response),
    }),
  }),
});

export const { useGetLookupQuery } = commonApi;
