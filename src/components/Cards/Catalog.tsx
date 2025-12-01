import { FC, useMemo, useState } from 'react';

import { IProduct } from 'types/products.types';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { vibrateClick } from 'utils/haptics';

const placeholder = '/assets/images/product-placeholder.svg';

import { addToCart, incrementFromCart } from 'src/store/yourFeatureSlice';

interface IProps {
  item: IProduct;
  foodDetail?: (item: IProduct) => void;
  onMaxExceeded?: () => void;
}

const CatalogCard: FC<IProps> = ({ item, foodDetail, onMaxExceeded }) => {
  const dispatch = useAppDispatch();

  const safeSrc = (v: unknown) => (typeof v === 'string' && v.trim().length > 0 ? v : undefined);

  const srcCandidate = useMemo(
    () => safeSrc(item.productPhotoSmall) ?? placeholder,
    [item.productPhotoSmall]
  );
  const [isLoaded, setIsLoaded] = useState(srcCandidate === placeholder);
  const cart = useAppSelector((state) => state.yourFeature.cart);
  const colorTheme = useAppSelector(
    (state) => state.yourFeature.venue?.colorTheme
  );

  // Normalize stock value: treat null/invalid as 0 (out of stock)
  const stockOf = (q: unknown) =>
    typeof q === 'number' && Number.isFinite(q) ? q : 0;

  const openFoodDetail = () => {
    vibrateClick();
    if (foodDetail) foodDetail(item as IProduct);
  };

  const handleClick = () => {
    vibrateClick();
    if (item.modificators.length) {
      openFoodDetail();
    } else {
      // Prevent adding more than stock
      const baseId = String(item.id);
      const currentTotal = cart
        .filter((ci) => String(ci.id).split(',')[0] === baseId)
        .reduce((sum, ci) => sum + ci.quantity, 0);
      const maxStock = stockOf(item.quantity);
      if (maxStock <= 0 || currentTotal >= maxStock) {
        onMaxExceeded && onMaxExceeded();
        // Out of stock or reached limit
        return;
      }

      const newItem = {
        ...item,
        // Ensure cart item always has a single category (fallback to first categories[] or empty)
        category: item.category ??
          item.categories?.[0] ?? { id: 0, categoryName: '' },
        id: item.id + '',
        modificators: undefined,
        quantity: 1,
        availableQuantity: stockOf(item.quantity),
      };
      dispatch(addToCart(newItem));
    }
  };
  const handleDecrement = () => {
    vibrateClick();
    if (item.modificators.length) {
      openFoodDetail();
    } else {
      dispatch(incrementFromCart(item));
    }
  };

  const foundCartItem = cart.find(
    (cartItem) => +cartItem.id.split(',')[0] == item.id
  );

  return (
    <div className='cart-block bg-white'>
      <div className='cart-img'>
        {!isLoaded && (
          <div className='cart-img-skeleton absolute top-0 left-0 w-full h-full bg-gray-300 animate-pulse'></div>
        )}
        <img
          src={srcCandidate}
          alt={item.productName || 'product'}
          onLoad={() => setIsLoaded(true)}
          onError={(e) => {
            if (e.currentTarget.src !== placeholder) {
              e.currentTarget.src = placeholder;
              setIsLoaded(true);
            }
          }}
          className={`transition-opacity duration-300 cursor-pointer ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={openFoodDetail}
        />
        <div
          className={
            foundCartItem ? 'add-btn opacity-90 active' : 'add-btn opacity-90'
          }
          style={{ backgroundColor: colorTheme }}
        >
          <div className='wrapper-btn'>
            <button
              onClick={(e) => {
                e.stopPropagation();
                vibrateClick();
                handleDecrement();
              }}
              className='absolute items-center justify-center'
              style={{
                width: foundCartItem?.quantity ? 18 : 0,
                height: 18,
                left: foundCartItem?.quantity ? 0 : 100,
                display: foundCartItem?.quantity ? 'flex' : 'none',
                transition: '0.5s',
                color: '#fff',
                lineHeight: '18px',
              }}
              aria-label='minus'
            >
              -
            </button>
            <span
              className='cart-count text-[#fff] text-center'
              style={{
                transition: '0.5s',
                overflow: 'hidden',
              }}
            >
              {foundCartItem?.quantity}
            </span>
            <div></div>
          </div>
          <div
            className='fixed-plus'
            style={{
              width: foundCartItem?.quantity ? '25%' : '100%',
              right: 0,
              transition: '1.0s',
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                vibrateClick();
                handleClick();
              }}
              style={{
                height: '100%',
                width: '100%',
                color: '#fff',
                lineHeight: '18px',
              }}
              className='z-10 flex items-center justify-center'
              aria-label='plus'
            >
              +
            </button>
          </div>
        </div>
      </div>
      {item.modificators.length ? (
        <div className='cart-info'>
          <span className='cart-price' style={{ color: colorTheme }}>
            от {+item.modificators[0].price} с
          </span>
        </div>
      ) : stockOf(item.quantity) === 0 ? (
        <span className='text-center text-[red]'>Нет в наличии</span>
      ) : (
        <div className='cart-info'>
          <span className='cart-price' style={{ color: colorTheme }}>
            {+item.productPrice} с
          </span>
        </div>
      )}
      <h4 className='cart-name'>{item.productName}</h4>
    </div>
  );
};

export default CatalogCard;
