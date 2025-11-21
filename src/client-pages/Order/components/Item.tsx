import { FC, useState } from 'react';

import { useAppSelector } from 'hooks/useAppSelector';


interface IProps {
  img: string;
  name: string;
  price: number;
  weight: number;
  quantity: number;
}

const Item: FC<IProps> = ({ img, name, price, weight, quantity }) => {
  const colorTheme = useAppSelector(
    (state) => state.yourFeature.venue?.colorTheme
  );
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className='order__status-list-item'>
      <div className='order__status-list-img-wrapper'>
        {!isLoaded && (
          <div className='cart-img-skeleton absolute top-0 left-0 w-full h-full bg-gray-300 animate-pulse'></div>
        )}
        <img
          src={img}
          alt={name}
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-300 cursor-pointer ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
      <div className='order__status-list-info-wrapper'>
        <div className='order__status-list-info'>
          <h5 className='order__status-list-name text-[#090A0B]'>{name}</h5>
          <span className='order__status-list-weight text-[#727272]'>
            {weight} г
          </span>
        </div>
        <div className='order__status-list-info'>
          <span
            className='order__status-list-price'
            style={{ color: colorTheme }}
          >
            {price} с
          </span>
          <span className='order__status-list-quantity text-[#727272]'>
            {quantity} шт
          </span>
        </div>
      </div>
    </div>
  );
};

export default Item;
