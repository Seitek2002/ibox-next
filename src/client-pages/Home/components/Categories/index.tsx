import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useGetCategoriesQuery } from 'api/Categories.api';
import { useAppSelector } from 'hooks/useAppSelector';
import { vibrateClick } from 'utils/haptics';

import Item from './Item';

interface IProps {
  onCategoryChange: (id: number | undefined) => void;
  onSearchChange: (bool: boolean) => void;
  selectedCategory?: number;
  onCategoryTitleChange?: (title: string) => void;
}

const Categories: FC<IProps> = ({
  onCategoryChange,
  onSearchChange,
  selectedCategory,
  onCategoryTitleChange,
}) => {
  const params = useParams<{ venue: string }>();
  const [isShow, setIsShow] = useState(false);
  const { data: categories } = useGetCategoriesQuery(
    {
      organizationSlug: params.venue,
    },
    { skip: !params.venue }
  );
  const [active, setActive] = useState<number | undefined>(0);
  const colorTheme = useAppSelector(
    (state) => state.yourFeature.venue?.colorTheme
  );
  const { t } = useTranslation();

  // sync active state with parent when selectedCategory is controlled from above
  useEffect(() => {
    if (typeof selectedCategory !== 'undefined') {
      setActive(selectedCategory);
    }
  }, [selectedCategory]);

  // sync active state with parent when selectedCategory is controlled from above
  useEffect(() => {
    if (typeof selectedCategory !== 'undefined') {
      setActive(selectedCategory);
    }
  }, [selectedCategory]);

  const selectCategory = (id: number | undefined) => {
    vibrateClick();
    if (id === -1) {
      onSearchChange(true);
    }
    setActive(id);
    onCategoryChange(id ?? undefined);

    // propagate category title to parent for header
    if (onCategoryTitleChange) {
      if (!id || id === 0) {
        onCategoryTitleChange(t('allDishes'));
      } else if (id === -1) {
        onCategoryTitleChange(t('search'));
      } else {
        const title = categories?.find(
          (c: { id: number; categoryName: string }) => c.id === id
        )?.categoryName;
        onCategoryTitleChange(title || t('allDishes'));
      }
    }
  };

  return (
    <section className='categories'>
      {categories && categories.length > 7 && (
        <span
          className={`dropdown-arrow`}
          onClick={() => {
            vibrateClick();
            setIsShow(!isShow);
          }}
        >
          {isShow ? t('hidden') : t('all')} {t('category')}
        </span>
      )}
      <div className={'categories__content ' + (isShow ? 'active' : '')}>
        <div className='md:hidden'>
          <div
            className={`categories__item ${active === -1 ? 'active' : ''}`}
            onClick={() => selectCategory(-1)}
          >
            <div
              className={`categories__wrapper`}
              style={{
                backgroundColor: -1 === active ? colorTheme : 'white',
                borderColor: -1 === active ? colorTheme : 'white',
                borderWidth: -1 === active ? '3px' : '1px',
              }}
            >
              <svg
                version='1.1'
                id='Capa_1'
                xmlns='http://www.w3.org/2000/svg'
                xmlnsXlink='http://www.w3.org/1999/xlink'
                x='0px'
                y='0px'
                viewBox='0 0 118.783 118.783'
                xmlSpace='preserve'
                fill={active === -1 ? 'white' : colorTheme}
              >
                <g>
                  <path
                    d='M115.97,101.597L88.661,74.286c4.64-7.387,7.333-16.118,7.333-25.488c0-26.509-21.49-47.996-47.998-47.996
		S0,22.289,0,48.798c0,26.51,21.487,47.995,47.996,47.995c10.197,0,19.642-3.188,27.414-8.605l26.984,26.986
		c1.875,1.873,4.333,2.806,6.788,2.806c2.458,0,4.913-0.933,6.791-2.806C119.72,111.423,119.72,105.347,115.97,101.597z
		 M47.996,81.243c-17.917,0-32.443-14.525-32.443-32.443s14.526-32.444,32.443-32.444c17.918,0,32.443,14.526,32.443,32.444
		S65.914,81.243,47.996,81.243z'
                  />
                </g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
              </svg>
            </div>
            <span className='leading-tight block text-black'>
              {t('search')}
            </span>
          </div>
        </div>
        <div
          className={`categories__item ${active === 0 ? 'active' : ''}`}
          onClick={() => selectCategory(0)}
        >
          <div
            className={`categories__wrapper`}
            style={{
              backgroundColor: 0 === active ? colorTheme : 'white',
              borderColor: 0 === active ? colorTheme : 'white',
              borderWidth: 0 === active ? '3px' : '1px',
            }}
          >
            <svg
              version='1.1'
              id='Layer_1'
              xmlns='http://www.w3.org/2000/svg'
              xmlnsXlink='http://www.w3.org/1999/xlink'
              x='0px'
              y='0px'
              viewBox='0 0 512 512'
              xmlSpace='preserve'
              fill={active === 0 ? 'white' : colorTheme}
            >
              <g>
                <g>
                  <path
                    d='M264.181,76.909c-93.646,0-169.561,75.915-169.561,169.561s75.915,169.561,169.561,169.561
			s169.561-75.915,169.561-169.561S357.827,76.909,264.181,76.909z M264.18,375.129c-70.942,0-128.658-57.716-128.658-128.658
			s57.716-128.658,128.658-128.658s128.658,57.716,128.658,128.658S335.123,375.129,264.18,375.129z'
                  />
                </g>
              </g>
              <g>
                <g>
                  <path
                    d='M264.18,152.299c-51.926,0-94.171,42.245-94.171,94.171c0,51.926,42.245,94.171,94.171,94.171
			c51.926,0,94.171-42.245,94.171-94.171S316.107,152.299,264.18,152.299z'
                  />
                </g>
              </g>
              <g>
                <g>
                  <path
                    d='M501.315,260.687V54.64c0-1.988-1.269-3.755-3.155-4.39c-1.884-0.634-3.963,0.007-5.166,1.591
			c-25.708,33.903-39.622,75.283-39.622,117.83v75.378c0,8.645,7.008,15.654,15.654,15.654h6.526
			c-6.433,66.443-10.684,159.37-10.684,170.251c0,17.142,10.551,31.038,23.566,31.038c13.015,0,23.566-13.897,23.566-31.038
			C512,420.072,507.749,327.13,501.315,260.687z'
                  />
                </g>
              </g>
              <g>
                <g>
                  <path
                    d='M68.417,219.843c13.042-7.9,21.759-22.224,21.759-38.586l-6.46-105.621c-0.247-4.026-3.584-7.165-7.618-7.165
			c-4.363,0-7.839,3.655-7.622,8.01l4.201,84.709c0,4.762-3.861,8.621-8.621,8.621c-4.761,0-8.621-3.861-8.621-8.621l-2.099-84.674
			c-0.111-4.475-3.77-8.044-8.247-8.044c-4.477,0-8.135,3.57-8.247,8.044l-2.099,84.674c0,4.762-3.861,8.621-8.621,8.621
			c-4.761,0-8.621-3.861-8.621-8.621l4.201-84.709c0.216-4.357-3.262-8.01-7.622-8.01c-4.034,0-7.371,3.139-7.617,7.165L0,181.258
			c0,16.362,8.716,30.685,21.759,38.586c8.488,5.141,13.22,14.753,12.126,24.617c-7.363,66.358-12.363,174.693-12.363,186.494
			c0,17.142,10.551,31.038,23.566,31.038c13.015,0,23.566-13.897,23.566-31.038c0-11.801-5.001-120.136-12.363-186.494
			C55.196,234.602,59.933,224.982,68.417,219.843z'
                  />
                </g>
              </g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
            </svg>
          </div>
          <span className='leading-tight text-black'>{t('all')}</span>
        </div>
        {categories?.map((item) => (
          <Item
            key={item.id}
            item={item}
            active={active}
            selectCategory={selectCategory}
          />
        ))}
      </div>
    </section>
  );
};

export default Categories;
