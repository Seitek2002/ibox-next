import { IVenues } from 'src/types/venues.types';

import { baseApi } from './base';

export const venuesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVenue: builder.query<
      IVenues,
      { venueSlug: string; tableId?: string | number }
    >({
      query: ({ venueSlug, tableId }) => {
        if (!tableId) return `organizations/${venueSlug}/`;
        if (!venueSlug || !tableId) return '/organizations';
        return `organizations/${venueSlug}/table/${tableId}/`;
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetVenueQuery } = venuesApi;
