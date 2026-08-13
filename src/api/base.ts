import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import i18n from 'i18next';

import { getApiBase } from 'utils/endpoints';

const baseUrl = getApiBase();

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const currentLanguage =
        typeof window !== 'undefined'
          ? i18n.language || window.localStorage.getItem('i18nextLng') || 'en'
          : 'en';
      headers.set('Accept-Language', currentLanguage);
      return headers;
    },
  }),
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});
