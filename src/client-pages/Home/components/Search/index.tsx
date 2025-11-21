import { FC, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useGetProductsQuery } from 'api/Products.api';
import { IProduct } from 'types/products.types';
import { vibrateClick } from 'utils/haptics';
import FoodDetail from '../../../../components/FoodDetail';
import CatalogCard from 'components/Cards/Catalog';

import nothing from 'assets/images/not-found-products.png';

interface IProps {
  onSearchChange: (bool: boolean) => void;
  searchText?: string;
  setSearchText: (text: string) => void;
}

const Search: FC<IProps> = ({ onSearchChange, searchText, setSearchText }) => {
  const { venue } = useParams();
  const [isShow, setIsShow] = useState(false);
  const [activeFood, setActiveFood] = useState<IProduct | null>(null);

  // Stock limit toast (top-right) for Home Search
  const [showStockToast, setShowStockToast] = useState(false);
  const [stockToastMsg, setStockToastMsg] = useState('');
  const stockToastTimerRef = useRef<number | null>(null);
  const showMaxStockToast = () => {
    vibrateClick();
    setStockToastMsg('Нельзя добавить больше — такого количества товара нет');
    setShowStockToast(true);
    try {
      if (stockToastTimerRef.current) {
        clearTimeout(stockToastTimerRef.current);
      }
    } catch {}
    stockToastTimerRef.current = window.setTimeout(
      () => setShowStockToast(false),
      1800
    );
  };

  const effectiveSearch = (searchText || '').trim();
  const {
    data: items,
    isLoading,
    isFetching,
    isUninitialized,
    isError,
  } = useGetProductsQuery(
    {
      category: undefined,
      search: effectiveSearch || undefined,
      organizationSlug: venue,
    },
    { skip: !venue }
  );
  const loading = isUninitialized || isLoading || isFetching;
  const hasError = !!isError;

  const sortedItems = (items ?? []).slice().sort((a, b) => {
    const sa = Number.isFinite(a.quantity) && a.quantity > 0 ? 1 : 0;
    const sb = Number.isFinite(b.quantity) && b.quantity > 0 ? 1 : 0;
    if (sb !== sa) return sb - sa;

    const ha =
      a.productPhoto || a.productPhotoSmall || a.productPhotoLarge ? 1 : 0;
    const hb =
      b.productPhoto || b.productPhotoSmall || b.productPhotoLarge ? 1 : 0;
    if (hb !== ha) return hb - ha;

    const an = (a.productName || '').localeCompare(b.productName || '');
    if (an !== 0) return an;
    return (a.id || 0) - (b.id || 0);
  });

  const handleClose = () => {
    setIsShow(false);
    document.body.style.height = '';
    document.body.style.overflow = '';
  };

  const handleOpen = (food: IProduct) => {
    setIsShow(true);
    setActiveFood(food);
    document.body.style.height = '100dvh';
    document.body.style.overflow = 'hidden';
  };

  useEffect(() => {
    return () => {
      if (stockToastTimerRef.current) {
        clearTimeout(stockToastTimerRef.current);
      }
    };
  }, []);

  return (
    <div className='search'>
      <FoodDetail
        isShow={isShow}
        setIsShow={handleClose}
        item={
          activeFood || {
            category: { categoryName: '', id: 0 },
            productName: '',
            productPhoto: '',
            productPrice: 0,
            weight: 0,
            productDescription: '',
            isRecommended: false,
            productPhotoLarge: '',
            productPhotoSmall: '',
            modificators: [
              {
                id: 0,
                name: '',
                price: 0,
              },
            ],
            id: 0,
            quantity: 0,
          }
        }
      />
      {showStockToast && (
        <div
          style={{
            position: 'fixed',
            top: 12,
            right: 12,
            backgroundColor: '#333',
            color: '#fff',
            padding: '10px 12px',
            borderRadius: 8,
            zIndex: 10000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            maxWidth: '80vw',
            fontSize: 14,
          }}
          role="status"
          aria-live="polite"
        >
          {stockToastMsg || 'Нельзя добавить больше — такого количества товара нет'}
        </div>
      )}
      <div className='search__content'>
        <div className='search__top'>
          <svg
            width='24px'
            height='24px'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            onClick={() => {
              vibrateClick();
              onSearchChange(false);
            }}
          >
            <g clipPath='url(#clip0_381_56772)'>
              <path
                d='M15 4.5L7.5 12L15 19.5'
                stroke='#090A0B'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </g>
            <defs>
              <clipPath id='clip0_381_56772'>
                <rect
                  width='24'
                  height='24'
                  fill='white'
                  transform='matrix(0 -1 -1 0 24 24)'
                />
              </clipPath>
            </defs>
          </svg>

          <label htmlFor='mobile-search'>
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <g clipPath='url(#clip0_381_56783)'>
                <path
                  d='M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z'
                  stroke='#090A0B'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M15.8035 15.8035L21 21'
                  stroke='#090A0B'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </g>
              <defs>
                <clipPath id='clip0_381_56783'>
                  <rect width='24' height='24' fill='white' />
                </clipPath>
              </defs>
            </svg>
            <input
              type='text'
              placeholder='Поиск'
              id='mobile-search'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className='flex-1'
            />
          </label>
        </div>

        {searchText &&
          (loading ? (
            <div className='search__catalog'>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className='bg-white rounded-[12px] p-[12px]'>
                  <div className='w-full h-[140px] bg-gray-200 animate-pulse rounded-[8px]' />
                  <div className='mt-[8px] h-[16px] bg-gray-200 animate-pulse rounded' />
                  <div className='mt-[6px] h-[14px] w-1/2 bg-gray-200 animate-pulse rounded' />
                </div>
              ))}
            </div>
          ) : hasError ? (
            <div className='mt-[24px]'>
              <h3 className='text-center text-[24px] font-semibold mb-[24px]'>
                Увы, ничего не найдено{'('}
              </h3>
              <img
                src={
                  typeof nothing === 'string'
                    ? nothing
                    : (nothing as unknown as { src?: string })?.src ||
                      '/assets/images/not-found-products.png'
                }
                alt=''
                className='w-full'
              />
            </div>
          ) : sortedItems.length > 0 ? (
            <div className='search__catalog'>
              {sortedItems.map((item) => (
                <CatalogCard
                  foodDetail={handleOpen}
                  key={item.id}
                  item={item}
                  onMaxExceeded={showMaxStockToast}
                />
              ))}
            </div>
          ) : (
            <div className='mt-[24px]'>
              <h3 className='text-center text-[24px] font-semibold mb-[24px]'>
                Увы, ничего не найдено{'('}
              </h3>
              <img
                src={
                  typeof nothing === 'string'
                    ? nothing
                    : (nothing as unknown as { src?: string })?.src ||
                      '/assets/images/not-found-products.png'
                }
                alt=''
                className='w-full'
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Search;
