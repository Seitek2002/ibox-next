import { IFoodCart } from 'types/products.types';
import { IVenues } from 'types/venues.types';
import { IUsersData } from 'src/store/yourFeatureSlice';

const getLS = () => (typeof window !== 'undefined' ? window.localStorage : null);

function readJSON<T>(key: string, fallback: T): T {
  try {
    const ls = getLS();
    if (!ls) return fallback;
    const raw = ls.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T): void {
  try {
    const ls = getLS();
    if (!ls) return;
    ls.setItem(key, JSON.stringify(value));
  } catch {
    // ignore write errors (SSR or storage blocked)
  }
}

export const saveCartToStorage = (cart: IFoodCart[]) => {
  writeJSON<IFoodCart[]>('cartItems', cart);
};

export const loadCartFromStorage = () => {
  return readJSON<IFoodCart[]>('cartItems', []);
};

export const saveUsersDataToStorage = (users: IUsersData) => {
  writeJSON<IUsersData>('users', users);
};

export const loadUsersDataFromStorage: () => IUsersData = () => {
  return readJSON<IUsersData>('users', {
    phoneNumber: '',
    address: '',
    comment: '',
    name: '',
    activeSpot: 0,
  });
};

export const saveVenueToStorage = (venue: IVenues) => {
  writeJSON<IVenues>('venue', venue);
};

export const loadVenueFromStorage: () => IVenues = () => {
  return readJSON<IVenues>('venue', {
    colorTheme: '#854C9D',
    companyName: '',
    slug: '',
    logo: '',
    description: null,
    schedule: '',
    serviceFeePercent: 0,
    deliveryFixedFee: 0,
    deliveryFreeFrom: null,
    schedules: [],
    defaultDeliverySpot: null,
    table: {
      id: 0,
      tableNum: '',
    },
    spots: [],
    activeSpot: 0,
    isDeliveryAvailable: false,
    isTakeoutAvailable: false,
    isDineinAvailable: false,
  });
};
