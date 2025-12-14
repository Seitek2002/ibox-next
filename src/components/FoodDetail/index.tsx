import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { IModificator, IProduct } from 'types/products.types';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { vibrateClick } from 'utils/haptics';

import close from '@/assets/icons/close.svg';
import minus from '@/assets/icons/Busket/minus.svg';
import plus from '@/assets/icons/Busket/plus.svg';
import whiteMinus from '@/assets/icons/CatalogCard/white-minus.svg';
import whitePlus from '@/assets/icons/CatalogCard/white-plus.svg';
import productPlaceholder from '@/assets/images/product-placeholder.svg';


import { addToCart, incrementFromCart } from 'src/store/yourFeatureSlice';
import Image from 'next/image';

interface IProps {
  item: IProduct;
  setIsShow: () => void;
  isShow: boolean;
}

const FoodDetail: FC<IProps> = ({ setIsShow, item, isShow }) => {
  const cart = useAppSelector((state) => state.yourFeature.cart);
  const colorTheme = useAppSelector(
    (state) => state.yourFeature.venue?.colorTheme
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const { t } = useTranslation();
  const [counter, setCounter] = useState(1);
  const sizes: IModificator[] = item.modificators || [];
  const [selectedSize, setSelectedSize] = useState<IModificator | null>(null);
  const dispatch = useAppDispatch();
  const startY = useRef<number | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const prev = document.body.style.overflow;
    if (isShow) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = prev || '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isShow]);

  useEffect(() => {
    if (!isShow) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsShow();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isShow, setIsShow]);

  const onTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches?.[0]?.clientY ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startY.current == null) return;
    const endY = e.changedTouches?.[0]?.clientY ?? 0;
    const delta = endY - startY.current;
    if (delta > 100) setIsShow();
    startY.current = null;
  };

  // Normalize stock value: treat null/invalid as 0 (out of stock)
  const stockOf = (q: unknown) =>
    typeof q === 'number' && Number.isFinite(q) ? q : 0;

  // Guard: ensure we only pass actual non-empty strings to <img src>
  const safeSrc = (v: unknown) =>
    typeof v === 'string' && v.trim().length > 0 ? v : undefined;

  const handleCounterChange = useCallback((delta: number) => {
    vibrateClick();
    setCounter((prev) => Math.max(1, prev + delta));
  }, []);

  const handleDone = useCallback(() => {
    vibrateClick();
    if (item) {
      const sizeId = selectedSize?.id ?? 0;

      // Enforce stock across all modificators for this product
      const baseId = String(item.id);
      const currentTotal = cart
        .filter((ci) => String(ci.id).split(',')[0] === baseId)
        .reduce((sum, ci) => sum + ci.quantity, 0);
      const maxAvail = stockOf(item.quantity);
      const remaining = Math.max(0, maxAvail - currentTotal);
      if (remaining <= 0) {
        return;
      }
      const qtyToAdd = Math.min(counter, remaining);

      const newItem = {
        ...item,
        // Ensure required cart shape: always provide a single category
        category: item.category ??
          item.categories?.[0] ?? { id: 0, categoryName: '' },
        modificators: selectedSize ?? undefined,
        id: item.id + ',' + sizeId,
        quantity: qtyToAdd,
        availableQuantity: stockOf(item.quantity),
      };
      dispatch(addToCart(newItem));
    }

    setIsShow();
  }, [item, setIsShow, selectedSize, counter, cart, dispatch]);

  const selectSize = useCallback((sizeKey: IModificator) => {
    vibrateClick();
    setSelectedSize(sizeKey);
  }, []);



  const handleImageClick = () => {
    vibrateClick();
    setIsShow();
  };

  const initialSrc =
    safeSrc(item?.productPhotoLarge) ??
    safeSrc(item?.productPhoto) ??
    productPlaceholder;
  const [mainSrc, setMainSrc] = useState<string>(initialSrc);

  const foundCartItem = cart.find(
    (cartItem) => +cartItem.id.split(',')[0] == item.id
  );

  // Compute remaining availability across cart for this product (all modificators)
  const baseId = String(item.id);
  const currentTotal = cart
    .filter((ci) => String(ci.id).split(',')[0] === baseId)
    .reduce((sum, ci) => sum + ci.quantity, 0);
  const maxAvail = stockOf(item.quantity);
  const remaining = Math.max(0, maxAvail - currentTotal);
  const isOutOfStock = remaining <= 0;

  const handleAddNoMods = useCallback(() => {
    vibrateClick();

    const baseId = String(item.id);
    const currentTotal = cart
      .filter((ci) => String(ci.id).split(',')[0] === baseId)
      .reduce((sum, ci) => sum + ci.quantity, 0);
    const maxAvail = stockOf(item.quantity);
    if (maxAvail <= 0 || currentTotal >= maxAvail) {
      return;
    }

    const newItem = {
      ...item,
      // Ensure cart item always has a single category (fallback to first categories[] or empty)
      category: item.category ??
        item.categories?.[0] ?? { id: 0, categoryName: '' },
      id: String(item.id),
      modificators: undefined,
      quantity: 1,
      availableQuantity: stockOf(item.quantity),
    };
    dispatch(addToCart(newItem));
  }, [dispatch, item, cart]);

  const handleDecrementNoMods = useCallback(() => {
    vibrateClick();
    dispatch(incrementFromCart(item));
  }, [dispatch, item]);

  useEffect(() => {
    if (Array.isArray(item.modificators) && item.modificators[0]) {
      setSelectedSize(item.modificators[0]);
    } else {
      setSelectedSize(null);
    }
  }, [item.modificators]);

  useEffect(() => {
    const curId = item.id + ',' + (selectedSize?.id ?? 0);
    const found = cart.find((cartItem) => cartItem.id === curId);
    if (found) {
      setCounter(found.quantity || 1);
    } else {
      setCounter(1);
    }
  }, [cart, item.id, selectedSize?.id]);

  useEffect(() => {
    setIsLoaded(false);
    setMainSrc(
      (safeSrc(item?.productPhotoLarge) ??
        safeSrc(item?.productPhoto) ??
        productPlaceholder) as string
    );
  }, [item?.productPhoto, item?.productPhotoLarge]);

  const descriptionNodes = useMemo(() => {
    const desc = item?.productDescription ?? '';
    const trimmed = desc.trim();
    if (!trimmed) return null;

    const lines = trimmed
      .split(/\r\n|\n|\r/)
      .map((l) => l.trim())
      .filter(Boolean);

    const nodes: ReactNode[] = [];
    let list: string[] = [];

    const pushList = () => {
      if (list.length) {
        nodes.push(
          <ul key={`ul-${nodes.length}`} className='desc-list'>
            {list.map((li, idx) => (
              <li key={idx}>{li}</li>
            ))}
          </ul>
        );
        list = [];
      }
    };

    for (const line of lines) {
      if (/^-/.test(line)) {
        const text = line.replace(/^-\s*/, '').trim();
        if (text) list.push(text);
      } else {
        pushList();
        nodes.push(<p key={`p-${nodes.length}`}>{line}</p>);
      }
    }

    pushList();
    return nodes;
  }, [item?.productDescription]);

  return (
    <>
      <div
        className={isShow ? 'overlay active' : 'overlay'}
        onClick={handleImageClick}
      ></div>
      <div
        className={`${isShow ? 'active' : ''} food-detail`}
        style={{ backgroundColor: '#fff' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Image
          src={close}
          alt='close'
          className='close'
          onClick={handleImageClick}
          width={20}
          height={20}
        />
        <div className='food-detail__wrapper'>
          <div className='img-wrapper'>
            {!isLoaded && (
              <div className='cart-img-skeleton absolute top-0 left-0 w-full h-full bg-gray-300 animate-pulse'></div>
            )}
            <Image
              src={mainSrc}
              alt='product'
              fill
              sizes='(max-width: 768px) 100vw, 600px'
              unoptimized={/^https?:\/\//.test(mainSrc)}
              onLoad={() => setIsLoaded(true)}
              onError={() => {
                if (mainSrc !== productPlaceholder) {
                  setMainSrc(productPlaceholder as string);
                }
                setIsLoaded(true);
              }}
              loading='lazy'
              className={`transition-opacity duration-300 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
          <div className='food-detail__content'>
            <div className='description'>
              <h2>{item?.productName}</h2>
              <div className='product-description'>{descriptionNodes}</div>
            </div>
            {sizes.length !== 0 && (
              <div className='size'>
                <div className='flex items-center justify-between'>
                  <h2>{t('size.size')}</h2>
                  <div style={{ color: colorTheme }} className='required'>
                    {t('necessarily')}
                  </div>
                </div>
                <div className='size__content'>
                  {sizes.map((sizeKey: IModificator, index: number) => (
                    <div
                      key={index}
                      className={`size__item bg-white ${
                        selectedSize?.name === sizeKey.name ? 'active' : ''
                      }`}
                      style={{
                        borderColor:
                          selectedSize?.name === sizeKey.name ? colorTheme : '',
                      }}
                      onClick={() => selectSize(sizeKey)}
                    >
                      <span>{sizeKey.name}</span>
                      <div className='price'>{sizeKey.price} c</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sizes.length !== 0 ? (
              isOutOfStock ? (
                <div className='out-of-stock text-red-600 font-semibold'>
                  {'Нет в наличии'}
                </div>
              ) : (
                <footer className='counter'>
                  <div className='counter__left'>
                    <Image
                      src={minus}
                      alt=''
                      onClick={() => handleCounterChange(-1)}
                      className='cursor-pointer'
                      width={24}
                      height={24}
                    />
                    <span>{counter}</span>
                    <Image
                      src={plus}
                      alt=''
                      onClick={() => handleCounterChange(1)}
                      className='cursor-pointer'
                      width={24}
                      height={24}
                    />
                  </div>
                  <div
                    className='counter__right'
                    style={{ backgroundColor: colorTheme, color: '#fff' }}
                  >
                    <button onClick={handleDone}>{t('button.add')}</button>
                  </div>
                </footer>
              )
            ) : isOutOfStock ? (
              <div className='food-detail__actions'>
                <div className='out-of-stock text-red-600 font-semibold'>
                  {'Нет в наличии'}
                </div>
              </div>
            ) : (
              <div className='food-detail__actions'>
                {!foundCartItem ? (
                  <button
                    className='cart-btn text-[#fff]'
                    style={{ backgroundColor: colorTheme }}
                    onClick={handleAddNoMods}
                  >
                    {t('button.add')}
                  </button>
                ) : foundCartItem.modificators &&
                  foundCartItem.modificators.name ? (
                  <button
                    className='cart-btn bg-[#F1F2F3] text-[#000]'
                    onClick={handleAddNoMods}
                  >
                    {t('button.add')}
                  </button>
                ) : (
                  <div
                    className='cart-btn active'
                    style={{ backgroundColor: colorTheme }}
                  >
                    <Image
                      onClick={handleDecrementNoMods}
                      src={whiteMinus}
                      alt='minus'
                      width={24}
                      height={24}
                    />
                    <span className='cart-count text-[#fff]'>
                      {foundCartItem?.quantity}
                    </span>
                    <Image
                      onClick={handleAddNoMods}
                      src={whitePlus}
                      alt='plus'
                      width={24}
                      height={24}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FoodDetail;
