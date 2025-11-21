import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IFoodCart, IOrderProduct } from 'src/types/products.types';
import { IVenues } from 'src/types/venues.types';
import { loadCartFromStorage, loadUsersDataFromStorage, loadVenueFromStorage, saveCartToStorage, saveUsersDataToStorage } from 'utils/storageUtils';

export interface IUsersData {
  phoneNumber: string;
  address?: string;
  comment?: string;
  name?: string;
  type?: number;
  activeSpot: number;
}

interface YourFeatureState {
  value: number;
  isShow: boolean;
  cart: IFoodCart[];
  usersData: IUsersData;
  buttonText: string;
  venue: IVenues;
  order: IOrderProduct;
}

const initialState: YourFeatureState = {
  value: 0,
  isShow: false,
  cart: loadCartFromStorage(),
  usersData: loadUsersDataFromStorage(),
  buttonText: 'Заказать',
  venue: loadVenueFromStorage(),
  order: {
    comment: '',
    orderProducts: [],
    phone: '',
    serviceMode: 0,
    servicePrice: '',
    tableNum: '',
    tipsPrice: '',
    venueSlug: '',
    spotSlug: '',
  },
};

const yourFeatureSlice = createSlice({
  name: 'yourFeature',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    setShow: (state) => {
      state.isShow = !state.isShow;
    },
    setVenue: (state, action: PayloadAction<IVenues>) => {
      state.venue = action.payload;
      localStorage.setItem('venue', JSON.stringify(state.venue));
    },
    addToCart: (state, action: PayloadAction<IFoodCart>) => {
      const toAdd = action.payload;
      const baseId = String(toAdd.id).split(',')[0];

      // Current total in cart across all modificators for the same product
      const currentTotalForProduct = state.cart
        .filter((ci) => String(ci.id).split(',')[0] === baseId)
        .reduce((sum, ci) => sum + ci.quantity, 0);

      // Determine max available stock for the product
      const maxAvail =
        toAdd.availableQuantity ??
        state.cart.find((ci) => String(ci.id).split(',')[0] === baseId)?.availableQuantity ??
        Number.POSITIVE_INFINITY;

      const remaining = Math.max(0, maxAvail - currentTotalForProduct);

      const existingLine = state.cart.find((ci) => ci.id === toAdd.id);

      if (existingLine) {
        if (remaining > 0) {
          const addQty = Math.min(remaining, toAdd.quantity);
          existingLine.quantity += addQty;
        }
      } else {
        if (remaining > 0) {
          const initQty = Math.min(toAdd.quantity, remaining);
          state.cart.push({
            ...toAdd,
            quantity: initQty,
            availableQuantity: toAdd.availableQuantity ?? (Number.isFinite(maxAvail) ? maxAvail : undefined),
          });
        }
      }

      saveCartToStorage(state.cart);
    },
    incrementFromCart: (state, action) => {
      const foundItem = state.cart.find((item) => item.id == action.payload.id);
      if (foundItem) {
        if (foundItem.quantity > 1) {
          foundItem.quantity -= 1;
        } else {
          state.cart = state.cart.filter((item) => item.id != action.payload.id);
        }
      }
      saveCartToStorage(state.cart);
    },
    clearCart: (state) => {
      state.cart = [];
      localStorage.removeItem('cartItems');
    },
    setButtonText: (state, action: PayloadAction<string>) => {
      state.buttonText = action.payload;
    },
    setOrder: (state, action: PayloadAction<IOrderProduct>) => {
      state.order = action.payload;
    },
    setUsersData: (state, action) => {
      state.usersData = action.payload;
      saveUsersDataToStorage(action.payload);
    }
  },
});

export const {
  increment,
  decrement,
  setShow,
  setVenue,
  clearCart,
  setButtonText,
  setOrder,
  addToCart,
  incrementFromCart,
  setUsersData,
} = yourFeatureSlice.actions;

export default yourFeatureSlice.reducer;
