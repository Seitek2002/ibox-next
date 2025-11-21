export interface IOrderProduct {
  product: {
    id: number;
    productName: string;
    productPhoto: string;
    weight: number;
  };
  count: number;
  modificator?: number;
  price: number;
}

export interface IReqCreateOrder {
  phone: string;
  comment?: string;
  serviceMode: number;
  address?: string;
  servicePrice?: string;
  tipsPrice?: number;
  spot: number;
  organizationSlug?: string;
  spotId?: number;
  isTgBot?: boolean;
  tgRedirectUrl?: string;
  refAgent?: number | null;

  // Bonus/points (parity with web-menu OpenAPI)
  useBonus?: boolean;
  bonus?: number;
  code?: string | null;
  hash?: string | null;

  orderProducts: {
    product: number;
    count: number;
    modificator?: number;
  }[];
}

export interface IOrder {
  id?: number;
  phone: string;
  comment?: string;
  address?: string;
  serviceMode: number;
  servicePrice?: string;
  tipsPrice?: string;
  orderProducts: IOrderProduct[];
  status: number;
  statusText: string;
}

export interface IOrderById {
  id: number;
  phone: string;
  comment?: string;
  address: string;
  status: number;
  serviceMode: number;
  servicePrice?: string;
  tipsPrice?: string;
  createdAt: string;
  orderProducts: IOrderProduct[];
  tableNum: string;
  statusText: string;
}

export interface ICreateOrderResponse {
  id: number;
  paymentUrl: string | null;
  phoneVerificationHash?: string;
}

 // orderProducts: [
//   {
//     product: 10;
//     count: 1;
//     modificator?: 2;
//   },
//   {
//     product: 10;
//     count: 1;
//     modificator?: 1;
//   },
//   {
//     product: 10;
//     count: 1;
//     modificator?: 0;
//   },
// ]
