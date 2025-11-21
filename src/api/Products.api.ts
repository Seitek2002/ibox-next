import { IProduct } from 'src/types/products.types';

import { baseApi } from './base';

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      IProduct[],
      {
        category?: number;
        search?: string;
        // New schema fields
        organizationSlug?: string;
        spotId?: string | number;
        // Backward compatibility:
        spotSlug?: string | number;
        venueSlug?: string;
      }
    >({
      query: ({ category, search, organizationSlug, spotId, spotSlug, venueSlug }) => {
        const params = new URLSearchParams();
        if (category) params.append('category', String(category));
        if (search) params.append('search', search);
        const spot = (spotId ?? spotSlug) as string | number | undefined;
        const org = organizationSlug ?? venueSlug;
        if (spot !== undefined && spot !== null) params.append('spotId', String(spot));
        if (org) params.append('organizationSlug', String(org));

        return `products/?${params.toString()}`;
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetProductsQuery } = productsApi;
