import { FC } from 'react';
import Image from 'next/image';

import { useAppSelector } from 'hooks/useAppSelector';
import { vibrateClick } from 'utils/haptics';

import categoryPlaceholder from '@/assets/images/category-placeholder.svg';
const safeSrc = (v: unknown) =>
  typeof v === 'string' && v.trim().length > 0 ? v : undefined;

interface IProps {
  item: {
    id: number;
    categoryPhoto: string;
    categoryName: string;
  };
  active: number | undefined;
  selectCategory: (id: number | undefined) => void;
}

const Item: FC<IProps> = ({ item, active, selectCategory }) => {
  const colorTheme = useAppSelector(
    (state) => state.yourFeature.venue?.colorTheme
  );
  const title = (item.categoryName || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .join(' ');

  return (
    <div
      className={`categories__item ${active === item.id ? 'active' : ''}`}
      key={item.id}
      onClick={() => {
        vibrateClick();
        selectCategory(item.id);
      }}
    >
      <div
        className={`categories__wrapper`}
        style={{
          backgroundColor: active === item.id ? colorTheme : 'white',
          borderColor: active === item.id ? colorTheme : 'white',
          borderWidth: active === item.id ? '3px' : '1px',
        }}
      >
        <Image
          src={(safeSrc(item.categoryPhoto) ?? categoryPlaceholder) as string}
          alt='icon'
          width={40}
          height={40}
          unoptimized={/^https?:\/\//.test(String(item.categoryPhoto))}
          onError={() => { /* Next/Image: handled by src state upstream if needed */ }}
        />
      </div>
      <span className='leading-tight text-black'>{title}</span>
    </div>
  );
};

export default Item;
