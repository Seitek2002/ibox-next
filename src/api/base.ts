import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import i18n from 'i18next';

const baseUrl =
  (process.env.NEXT_PUBLIC_API_BASE_URL as string) || 'https://ibox.kg/api/';

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
