import { baseApi } from './base';

type RawClientBonus = {
  phoneNumber?: string;
  organization?: string | null;
  bonus?: string | number | null;
  balance?: string | number | null;
  firstName?: string | null;
  lastName?: string | null;
  userType?: string;
};

export interface IClientBalance {
  phoneNumber: string;
  organization?: string | null;
  balance: number;
  firstName?: string | null;
  lastName?: string | null;
  userType?: string;
}

export const clientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClientBonus: builder.query<IClientBalance, { phone: string; organizationSlug?: string; venueSlug?: string }>({
      query: ({ phone, organizationSlug, venueSlug }) => ({
        url: 'client/bonus',
        method: 'GET',
        params: {
          phone,
          ...(organizationSlug ? { organization_slug: organizationSlug } : {}),
          ...(venueSlug ? { venue_slug: venueSlug } : {}),
        },
      }),
      transformResponse: (res: RawClientBonus) => {
        const balanceNum = Number(res?.balance);
        const balance = Number.isFinite(balanceNum) ? balanceNum : 0;
        return {
          phoneNumber: String(res?.phoneNumber ?? ''),
          organization: res?.organization ?? null,
          balance,
          firstName: res?.firstName ?? null,
          lastName: res?.lastName ?? null,
          userType: res?.userType ?? undefined,
        } as IClientBalance;
      }
    }),
  }),
  overrideExisting: false,
});

export const { useGetClientBonusQuery } = clientApi;
