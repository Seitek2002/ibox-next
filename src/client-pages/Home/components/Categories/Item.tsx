import { FC } from 'react';

import { useAppSelector } from 'hooks/useAppSelector';
import { vibrateClick } from 'utils/haptics';

const categoryPlaceholder = '/assets/images/category-placeholder.svg';
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
        <img
          src={safeSrc(item.categoryPhoto) ?? categoryPlaceholder}
          alt='icon'
          onError={(e) => {
            if (e.currentTarget.src !== categoryPlaceholder) {
              e.currentTarget.src = categoryPlaceholder;
            }
          }}
        />
      </div>
      <span className='leading-tight text-black'>{title}</span>
    </div>
  );
};

export default Item;
