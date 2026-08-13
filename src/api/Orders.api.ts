import { ICreateOrderResponse, IOrder, IOrderById, IReqCreateOrder } from 'src/types/orders.types';

import { baseApi } from './base';

export type PostOrderArgs = {
  body: IReqCreateOrder;
  organizationSlug: string;
  spotId?: string | number;
};

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<
      IOrder[],
      {
        // New schema fields
        organizationSlug?: string;
        spotId?: string | number;
        phone?: string;
        // Backward compatibility with older code paths:
        venueSlug?: string;
        spotSlug?: string | number;
      }
    >({
      query: ({ organizationSlug, spotId, phone, venueSlug, spotSlug }) => {
        const params = new URLSearchParams();
        const org = organizationSlug ?? venueSlug;
        const spot = (spotId ?? spotSlug) as string | number | undefined;

        // Бэкенд ждёт snake_case и требует organization_slug + phone.
        if (org) params.append('organization_slug', String(org));
        if (spot !== undefined && spot !== null) params.append('spot_id', String(spot));
        if (phone) params.append('phone', phone);

        return `orders/?${params.toString()}`;
      },
    }),
    postOrders: builder.mutation<ICreateOrderResponse, PostOrderArgs>({
      query: ({ body, organizationSlug, spotId }) => ({
        url: 'orders/',
        method: 'POST',
        body,
        params: {
          organizationSlug,
          ...(spotId !== undefined && spotId !== null ? { spotId } : {}),
        },
      }),
    }),
    getOrdersById: builder.query<
      IOrderById,
      { id: number; organizationSlug?: string; phone?: string }
    >({
      // Retrieve на бэкенде использует тот же get_queryset, что и список:
      // без organization_slug и phone он отдаёт 400.
      query: ({ id, organizationSlug, phone }) => {
        const params = new URLSearchParams();
        if (organizationSlug) params.append('organization_slug', organizationSlug);
        if (phone) params.append('phone', phone);
        const qs = params.toString();

        return qs ? `orders/${id}/?${qs}` : `orders/${id}/`;
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrdersQuery,
  usePostOrdersMutation,
  useGetOrdersByIdQuery,
  useLazyGetOrdersByIdQuery,
} = ordersApi;
