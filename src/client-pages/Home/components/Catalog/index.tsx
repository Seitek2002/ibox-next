import { FC, memo, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useGetProductsQuery } from 'api/Products.api';
import { IFoodCart, IProduct } from 'types/products.types';
import { useAppSelector } from 'hooks/useAppSelector';
import { vibrateClick } from 'utils/haptics';
import CatalogCard from 'components/Cards/Catalog';
import FoodDetail from 'components/FoodDetail';

import nothing from 'assets/images/not-found-products.png';

import { t } from 'i18next';

interface IProps {
  searchText?: string;
  selectedCategory?: number;
  categoryTitle?: string;
  isSearchOpenOnMobile?: boolean;
}

const Catalog: FC<IProps> = ({
  searchText,
  selectedCategory = 0,
  categoryTitle,
  isSearchOpenOnMobile = false,
}) => {
  const { venue } = useParams();
  const [isShow, setIsShow] = useState(false);
  const [activeFood, setActiveFood] = useState<IProduct | null>(null);

  // Stock limit toast (top-right) for Home Catalog
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
  const cart = useAppSelector((state) => state.yourFeature.cart);
  const colorTheme = useAppSelector(
    (state) => state.yourFeature.venue?.colorTheme
  );
  const navigate = useNavigate();
  const effectiveSearch = (searchText || '').trim();
  const {
    data: items,
    isLoading,
    isFetching,
    isUninitialized,
  } = useGetProductsQuery(
    {
      search: effectiveSearch || undefined,
      organizationSlug: venue,
    },
    { skip: !venue || isSearchOpenOnMobile }
  );

  const loading = isUninitialized || isLoading || isFetching;

  const handleClose = () => {
    setIsShow(false);
    document.body.style.height = '';
    document.body.style.overflow = '';
  };

  const handleOpen = (food: IProduct) => {
    setIsShow(true);
    setActiveFood(food);
    document.body.style.height = '100dvh';
    document.body.style.overflow = 'auto';
  };

  function getCartItemPrice(item: IFoodCart): number {
    if (item.modificators?.price) {
      return item.modificators.price;
    }
    return item.productPrice;
  }

  const subtotal = cart.reduce((acc, item) => {
    const realPrice = getCartItemPrice(item);
    return acc + realPrice * item.quantity;
  }, 0);

  // Frontend filtering by category ID using categories[] (or fallback category)
  const filteredItems = useMemo(() => {
    if (!items) return [];
    const base =
      !selectedCategory || selectedCategory === 0
        ? items
        : items.filter((p: IProduct) => {
            const fromArray = (p.categories || []).map((c) => c.id);
            const fromSingle = p.category ? [p.category.id] : [];
            const allIds = fromArray.length ? fromArray : fromSingle;
            return allIds.includes(selectedCategory);
          });

    const hasPhoto = (p: IProduct) =>
      Boolean(p.productPhoto || p.productPhotoSmall || p.productPhotoLarge);

    // In-stock first, then items with photo; stable tie-breaker by name then id
    return [...base].sort((a, b) => {
      const sa = Number.isFinite(a.quantity) && a.quantity > 0 ? 1 : 0;
      const sb = Number.isFinite(b.quantity) && b.quantity > 0 ? 1 : 0;
      if (sb !== sa) return sb - sa;

      const ha = hasPhoto(a) ? 1 : 0;
      const hb = hasPhoto(b) ? 1 : 0;
      if (hb !== ha) return hb - ha;

      const an = (a.productName || '').localeCompare(b.productName || '');
      if (an !== 0) return an;

      return (a.id || 0) - (b.id || 0);
    });
  }, [items, selectedCategory]);

  const nothingSrc = typeof nothing === 'string' ? nothing : (nothing as unknown as { src?: string })?.src || '/assets/images/not-found-products.png';

  useEffect(() => {
    return () => {
      if (stockToastTimerRef.current) {
        clearTimeout(stockToastTimerRef.current);
      }
    };
  }, []);

  return (
    <section className='catalog'>
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
      <h2>{categoryTitle || t('allDishes')}</h2>
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
      {loading ? (
        <div className='catalog__content'>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className='bg-white rounded-[12px] p-[12px]'>
              <div className='w-full h-[140px] bg-gray-200 animate-pulse rounded-[8px]' />
              <div className='mt-[8px] h-[16px] bg-gray-200 animate-pulse rounded' />
              <div className='mt-[6px] h-[14px] w-1/2 bg-gray-200 animate-pulse rounded' />
            </div>
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className='catalog__content'>
          {filteredItems.map((item) => {
            return (
              <CatalogCard
                foodDetail={handleOpen}
                key={item.id}
                item={item}
                onMaxExceeded={showMaxStockToast}
              />
            );
          })}
          {window.innerWidth < 768 && cart.length !== 0 && (
            <div className='catalog__footer'>
              <button
                onClick={() => {
                  vibrateClick();
                  navigate('/cart');
                }}
                style={{ backgroundColor: colorTheme }}
              >
                {t('basket.order')}
                <span className='font-bold absolute right-[30px]'>
                  {subtotal} с
                </span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className='mt-[24px] flex flex-col items-center'>
          <h3 className='text-center text-[24px] font-semibold mb-[24px]'>
            Увы, ничего не найдено{'('}
          </h3>
          <img src={nothingSrc} alt='' className='w-1/2' />
        </div>
      )}
    </section>
  );
};

export default memo(Catalog);
