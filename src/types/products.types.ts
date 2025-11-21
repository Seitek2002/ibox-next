export interface ICategory {
  id: number;
  categoryName: string;
}

export interface IFoodCart {
  id: string;
  productName: string;
  productDescription: string | null;
  productPrice: number;
  weight: number;
  productPhoto: string;
  category: ICategory;
  quantity: number;
  availableQuantity?: number;
  modificators?: IModificator;
}

export interface IModificator {
  id: number;
  name: string;
  price: number;
}

export interface IProduct {
  id: number;
  productName: string;
  productDescription: string | null;
  productPrice: number;
  weight: number;
  productPhoto: string;
  productPhotoSmall: string;
  productPhotoLarge: string;
  category?: ICategory;
  categories?: ICategory[];
  modificators: IModificator[];
  isRecommended: boolean;
  quantity: number;
}

export interface IOrderProduct {
  venueSlug: string,
  spotSlug: string,
  tableNum?: string,
  phone: string,
  comment: string,
  serviceMode: number,
  servicePrice: string,
  tipsPrice: string,
  orderProducts: {
    product: number,
    count: number,
    modificator?: number
  }[]
}
