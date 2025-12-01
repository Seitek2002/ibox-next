import { IVenues } from 'src/types/venues.types';

import { baseApi } from './base';

export const venuesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVenue: builder.query<
      IVenues,
      { venueSlug: string; spotId?: number; tableId?: string | number }
    >({
      query: ({ venueSlug, spotId, tableId }) => {
        if (!venueSlug) return '/organizations';
        if (tableId != null && tableId !== '') {
          return `organizations/${venueSlug}/table/${tableId}/`;
        }
        const base = `organizations/${venueSlug}/`;
        // Append spotId as query parameter when provided
        if (typeof spotId === 'number' && Number.isFinite(spotId)) {
          const sep = base.includes('?') ? '&' : '?';
          return `${base}${sep}spotId=${spotId}`;
        }
        return base;
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetVenueQuery } = venuesApi;
