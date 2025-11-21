import { FC, useState } from 'react';

import { IFoodCart } from 'types/products.types';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { vibrateClick } from 'utils/haptics';

const minus = '/assets/icons/Busket/minus.svg';
const plus = '/assets/icons/Busket/plus.svg';

import { addToCart, incrementFromCart } from 'src/store/yourFeatureSlice';

interface IProps {
  item: IFoodCart;
  onMaxExceeded?: () => void;
}

const BusketCard: FC<IProps> = ({ item, onMaxExceeded }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useAppDispatch();
  const colorTheme = useAppSelector(
    (state) => state.yourFeature.venue?.colorTheme
  );
  const cart = useAppSelector((state) => state.yourFeature.cart);

  const increment = () => {
    vibrateClick();
    // prevent adding more than available stock for this product (across all modificators)
    const baseId = String(item.id).split(',')[0];
    const currentTotal = cart
      .filter((ci) => String(ci.id).split(',')[0] === baseId)
      .reduce((sum, ci) => sum + ci.quantity, 0);
    const maxAvail = item.availableQuantity ?? Number.POSITIVE_INFINITY;
    if (currentTotal >= maxAvail) {
      onMaxExceeded && onMaxExceeded();
      return;
    }
    dispatch(addToCart({ ...item, quantity: 1, availableQuantity: item.availableQuantity }));
  };

  const decrement = () => {
    vibrateClick();
    dispatch(incrementFromCart(item));
  };

  return (
    <div className='busket-card'>
      <div className='busket-card__img-wrapper'>
        {!isLoaded && (
          <div className='cart-img-skeleton absolute top-0 left-0 w-full h-full bg-gray-300 animate-pulse'></div>
        )}
        <img
          src={item.productPhoto}
          alt=''
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
      <div className='busket-card__text'>
        <h3>{item.productName}</h3>
        <div className='flex items-center'>
          <span className='price' style={{ color: colorTheme }}>
            {item.modificators ? item.modificators.price : +item.productPrice} с
          </span>
          {item.modificators?.name && (
            <span className='weight mx-[5px]'> | </span>
          )}
          {item.modificators?.name && (
            <span className='weight'>{item.modificators.name}</span>
          )}
        </div>
      </div>
      <div className='busket-card__counter'>
        <img onClick={decrement} src={minus} alt='' />
        <span>{item.quantity}</span>
        <img onClick={increment} src={plus} alt='' />
      </div>
    </div>
  );
};

export default BusketCard;
