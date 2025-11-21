import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useGetClientBonusQuery } from 'api/Client.api';
import { usePostOrdersMutation } from 'api/Orders.api';
import { useGetProductsQuery } from 'api/Products.api';
import { IReqCreateOrder } from 'types/orders.types';
import { IFoodCart, IProduct } from 'types/products.types';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { vibrateClick } from 'utils/haptics';
import { loadUsersDataFromStorage } from 'utils/storageUtils';
import { getTodayScheduleWindow, isOutsideWorkTime } from 'utils/timeUtils';
import {
  ContactsForm,
  DeliveryInfoBanner,
  FooterBar,
  HeaderBar,
  Recommended,
  SpotsSelector,
  SumDetails,
} from './components/CartUI';
import Empty from './components/Empty';
import NoPointsModal from './components/NoPointsModal';
import BusketDesktop from 'components/BusketDesktop';
import BusketCard from 'components/Cards/Cart';
import CatalogCard from 'components/Cards/Catalog';
import CartLoader from 'components/CartLoader';
import ClearCartModal from 'components/ClearCartModal';
import FoodDetail from 'components/FoodDetail';
import PointsModal from 'components/PointsModal';
import WorkTimeModal from 'components/WorkTimeModal';


import { useMask } from '@react-input/mask';
import { clearCart, setUsersData } from 'src/store/yourFeatureSlice';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [postOrder] = usePostOrdersMutation();
  const userData = loadUsersDataFromStorage();
  const { t } = useTranslation();
  const [isShow, setIsShow] = useState(false);
  const cart = useAppSelector((state) => state.yourFeature.cart);
  const [isLoading, setIsLoading] = useState(false);
  const [showNoPoints, setShowNoPoints] = useState(false);
  const colorTheme = useAppSelector(
    (state) => state.yourFeature.venue?.colorTheme
  );
  const venueData = useAppSelector((state) => state.yourFeature.venue);
  const usersType = useAppSelector(
    (state) => state.yourFeature.usersData?.type
  );
  const usersActiveSpot = useAppSelector(
    (state) => state.yourFeature.usersData?.activeSpot
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const defaultSpotId =
    venueData?.defaultDeliverySpot ?? venueData?.spots?.[0]?.id ?? 0;
  const [selectedSpot, setSelectedSpot] = useState(defaultSpotId);

  // Sync selectedSpot with activeSpot derived from pickup URL (/:venue/:venueId/s)
  useEffect(() => {
    if (
      typeof usersActiveSpot === 'number' &&
      usersActiveSpot > 0 &&
      usersActiveSpot !== selectedSpot
    ) {
      setSelectedSpot(usersActiveSpot);
    }
  }, [usersActiveSpot, selectedSpot]);

  const [phoneNumber, setPhoneNumber] = useState(
    `+996${userData.phoneNumber.replace('996', '')}`
  );
  const [comment, setComment] = useState('');
  const [address, setAddress] = useState(userData.address || '');
  const [promoCode, setPromoCode] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const storedPromo = localStorage.getItem('promoCode') || '';
  if (storedPromo) {
    setPromoCode(storedPromo);
    setShowPromoInput(true);
  }

  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');

  const [activeFood, setActiveFood] = useState<IProduct | null>(null);
  const [active, setActive] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [wrapperHeight, setWrapperHeight] = useState(0);
  const [clearCartModal, setClearCartModal] = useState(false);
  const [showWorkTimeModal, setShowWorkTimeModal] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  // Stock limit toast (top-right)
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

  const [isPointsModalOpen, setIsPointsModalOpen] = useState(false);
  const { data: bonusData } = useGetClientBonusQuery(
    { phone: phoneNumber, organizationSlug: venueData?.slug },
    { skip: !phoneNumber || !venueData?.slug }
  );
  const availablePoints = Math.max(0, Math.floor(bonusData?.balance ?? 0));
  const [usePoints, setUsePoints] = useState(false);
  const [bonusPoints, setBonusPoints] = useState(0);
  const [otpCode, setOtpCode] = useState<string>('');
  const lastOrderBaseRef = useRef<IReqCreateOrder | null>(null);

  const getHashLS = () => {
    try {
      if (typeof window === 'undefined') return undefined;
      return (
        localStorage.getItem('phoneVerificationHash') ||
        localStorage.getItem('hash') ||
        undefined
      );
    } catch {
      return undefined;
    }
  };

  const getRefAgentLS = () => {
    try {
      const raw = localStorage.getItem('refId') || localStorage.getItem('ref');
      const n = raw ? parseInt(raw, 10) : NaN;
      return Number.isFinite(n) && n > 0 ? n : undefined;
    } catch {
      return undefined;
    }
  };

  const getErrorMessage = (err: unknown): string => {
    if (typeof err === 'object' && err !== null) {
      const obj = err as {
        data?: { error?: string; detail?: string };
        error?: string;
        message?: string;
      };
      return (
        obj.data?.error ||
        obj.data?.detail ||
        obj.error ||
        obj.message ||
        'Ошибка оформления заказа'
      );
    }
    if (typeof err === 'string') return err;
    return 'Ошибка оформления заказа';
  };

  const { data } = useGetProductsQuery(
    {
      organizationSlug: venueData?.slug,
      spotId: selectedSpot,
    },
    { skip: !venueData?.slug }
  );

  const recommendedItems = useMemo(
    () =>
      (data?.filter((it) => it.isRecommended) ?? [])
        .slice()
        .sort((a, b) => {
          const sa = Number.isFinite(a.quantity) && a.quantity > 0 ? 1 : 0;
          const sb = Number.isFinite(b.quantity) && b.quantity > 0 ? 1 : 0;
          if (sb !== sa) return sb - sa;

          const ha =
            (a.productPhoto || a.productPhotoSmall || a.productPhotoLarge) ? 1 : 0;
          const hb =
            (b.productPhoto || b.productPhotoSmall || b.productPhotoLarge) ? 1 : 0;
          if (hb !== ha) return hb - ha;

          const an = (a.productName || '').localeCompare(b.productName || '');
          if (an !== 0) return an;

          return (a.id || 0) - (b.id || 0);
        }),
    [data]
  );

  const inputRef = useMask({
    mask: '+996_________',
    replacement: { _: /\d/ },
  });

  const isSelfPickupRoute = useMemo(() => {
    try {
      const mp = (localStorage.getItem('mainPage') || '').toLowerCase();
      const parts = mp.split('/').filter(Boolean);
      if (parts.length) {
        // Самовывоз: наличие отдельного сегмента "s" (например, /:venue/:spotId/s/)
        return parts[parts.length - 1] === 's' || parts.includes('s');
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const effectiveUsersType = isSelfPickupRoute ? 2 : usersType;

  const orderTypes = useMemo(
    () =>
      effectiveUsersType === 2
        ? [{ text: t('myself'), value: 2 }]
        : [{ text: t('empty.delivery'), value: 3 }],
    [t, effectiveUsersType]
  );

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

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);

    if (!value.trim()) {
      setPhoneError('Это обязательное поле');
    } else if (value.length < 13) {
      setPhoneError('Тут нужно минимум 12 символов');
    } else {
      setPhoneError('');
    }
  };

  const handleAddressChange = (value: string) => {
    setAddress(value);

    if (!value.trim()) {
      setAddressError('Это обязательное поле');
    } else if (value.trim().length < 4) {
      setAddressError('Тут нужно минимум 4 символа');
    } else {
      setAddressError('');
    }
  };

  const validateForm = () => {
    let hasError = false;

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 12) {
      setPhoneError('Тут нужно минимум 12 символов');
      hasError = true;
      const el = document.getElementById('phoneNumber');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setPhoneError('');
    }

    const isDelivery = orderTypes[activeIndex]?.value === 3;
    if (isDelivery) {
      if (!address.trim() || address.trim().length < 4) {
        setAddressError('Тут нужно минимум 4 символа');
        hasError = true;
        const el = document.getElementById('address');
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setAddressError('');
      }
    }

    return !hasError;
  };

  const handleOrder = async () => {
    // Validate before proceeding; show inline errors and keep button enabled
    if (!validateForm()) {
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      return;
    }

    setIsLoading(true);

    // Block ordering outside working hours (weekly schedules aware)
    const { window: todayWindow, isClosed } = getTodayScheduleWindow(
      venueData?.schedules,
      venueData?.schedule
    );
    if (isClosed || isOutsideWorkTime(todayWindow)) {
      setShowWorkTimeModal(true);
      setIsLoading(false);
      return;
    }

    console.log('Promo code:', promoCode);
    const orderProducts = cart.map((item) => {
      if (item.modificators?.id) {
        return {
          product: +item.id.split(',')[0],
          count: +item.quantity,
          modificator: item.modificators.id,
        };
      } else {
        return {
          product: +item.id.split(',')[0],
          count: +item.quantity,
        };
      }
    });

    const currentType = orderTypes[activeIndex];
    if (!currentType) {
      setIsLoading(false);
      return;
    }

    const acc: IReqCreateOrder = {
      phone: phoneNumber
        .replace('-', '')
        .replace('(', '')
        .replace(')', '')
        .replace(' ', '')
        .replace('+', '')
        .replace(' ', ''),
      orderProducts,
      comment,
      serviceMode: 1,
      address: '',
      spot: selectedSpot,
      organizationSlug: venueData.slug,
    };

    if (venueData?.table?.tableNum) {
      acc.serviceMode = 1;
    } else {
      if (currentType.value === 3) {
        acc.serviceMode = 3;
        acc.address = address;
      } else {
        acc.serviceMode = currentType.value;
      }
    }

    dispatch(
      setUsersData({
        ...userData,
        phoneNumber: acc.phone,
        address,
        type: currentType.value,
        activeSpot: selectedSpot,
      })
    );

    const hashLS = getHashLS();
    const payloadBase: IReqCreateOrder = {
      ...acc,
      spot: selectedSpot,
      organizationSlug: venueData.slug,
      useBonus: usePoints || undefined,
      bonus: usePoints ? Math.min(bonusPoints, maxUsablePoints) : undefined,
      code: promoCode?.trim() || otpCode || undefined,
      hash: hashLS,
      refAgent: getRefAgentLS(),
    };
    lastOrderBaseRef.current = payloadBase;

    try {
      const res = await postOrder({
        body: payloadBase,
        organizationSlug: venueData.slug,
        spotId: selectedSpot,
      }).unwrap();

      if (res?.paymentUrl) {
        const url = normalizePaymentUrl(res.paymentUrl);
        if (!url) {
          setIsLoading(false);
          setServerError('Некорректная платежная ссылка');
          return;
        }
        try {
          // Clear cart when the page is actually leaving (more reliable on iOS)
          const onPageHide = () => {
            try { dispatch(clearCart()); } catch {}
            window.removeEventListener('pagehide', onPageHide);
          };
          window.addEventListener('pagehide', onPageHide);

          // iOS Safari friendly navigation
          if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            window.location.assign(url);
          } else {
            window.location.href = url;
          }
          return; // Do not continue in this handler
        } catch (e) {
          setServerError('Не удалось перейти по платежной ссылке');
          setIsLoading(false);
        }
      } else if (res?.phoneVerificationHash) {
        try {
          localStorage.setItem('phoneVerificationHash', res.phoneVerificationHash);
          localStorage.setItem('hash', res.phoneVerificationHash);
        } catch {
          /* ignore */
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      try {
        setServerError(String(msg));
        setTimeout(() => setServerError(null), 5000);
      } catch {
        /* ignore */
      }
      setIsLoading(false);
    }
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
  const serviceFeeAmt = subtotal * (venueData.serviceFeePercent / 100);
  const isDeliveryType = orderTypes[activeIndex]?.value === 3;
  const deliveryFreeFrom =
    venueData?.deliveryFreeFrom != null
      ? Number(venueData.deliveryFreeFrom)
      : null;
  const deliveryFixedFee = Number(venueData?.deliveryFixedFee || 0);
  const deliveryFee = isDeliveryType
    ? deliveryFreeFrom !== null && subtotal >= deliveryFreeFrom
      ? 0
      : deliveryFixedFee
    : 0;
  const hasFreeDeliveryHint =
    isDeliveryType && deliveryFreeFrom !== null && subtotal < deliveryFreeFrom;
  const total =
    Math.round((subtotal + serviceFeeAmt + deliveryFee) * 100) / 100;
  const maxUsablePoints = Math.min(availablePoints, Math.floor(total));
  const appliedBonus = usePoints ? Math.min(bonusPoints, maxUsablePoints) : 0;
  const displayTotal = Math.max(
    0,
    Math.round((total - appliedBonus) * 100) / 100
  );

  // Smooth auto-height for details dropdown (no hardcoded px)
  useEffect(() => {
    if (active) {
      const h = wrapperRef.current?.scrollHeight ?? 0;
      setWrapperHeight(h);
    } else {
      setWrapperHeight(0);
    }
    // Recompute when content that affects height changes
  }, [active, subtotal, serviceFeeAmt, deliveryFee, hasFreeDeliveryHint]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const tVal = effectiveUsersType;
    if (tVal) {
      const idx = orderTypes.findIndex((it) => it.value === tVal);
      if (idx >= 0) setActiveIndex(idx);
      else setActiveIndex(0);
    } else {
      setActiveIndex(0);
    }
  }, [effectiveUsersType, orderTypes]);

  const requestOtpForPoints = async (v: number) => {
    try {
      if (!v || v <= 0) {
        return;
      }
      const orderProducts = cart.map((item) => {
        if (item.modificators?.id) {
          return {
            product: +item.id.split(',')[0],
            count: +item.quantity,
            modificator: item.modificators.id,
          };
        } else {
          return {
            product: +item.id.split(',')[0],
            count: +item.quantity,
          };
        }
      });

      const currentType = orderTypes[activeIndex];
      if (!currentType) {
        setIsLoading(false);
        return;
      }

      const accBase: IReqCreateOrder = {
        phone: phoneNumber
          .replace('-', '')
          .replace('(', '')
          .replace(')', '')
          .replace(' ', '')
          .replace('+', '')
          .replace(' ', ''),
        orderProducts,
        comment,
        serviceMode: 1,
        address: '',
        spot: selectedSpot,
        organizationSlug: venueData.slug,
      };

      if (venueData?.table?.tableNum) {
        accBase.serviceMode = 1;
      } else {
        if (currentType.value === 3) {
          accBase.serviceMode = 3;
          accBase.address = address;
        } else {
          accBase.serviceMode = currentType.value;
        }
      }

      const hashLS = getHashLS();
      const payloadBase: IReqCreateOrder = {
        ...accBase,
        spot: selectedSpot,
        organizationSlug: venueData.slug,
        useBonus: true,
        bonus: Math.min(v, maxUsablePoints),
        hash: hashLS,
        refAgent: getRefAgentLS(),
      };
      lastOrderBaseRef.current = payloadBase;

      const res = await postOrder({
        body: payloadBase,
        organizationSlug: venueData.slug,
        spotId: selectedSpot,
      }).unwrap();

      if (res?.phoneVerificationHash) {
        try {
          localStorage.setItem(
            'phoneVerificationHash',
            res.phoneVerificationHash
          );
          localStorage.setItem('hash', res.phoneVerificationHash);
        } catch {
          /* ignore */
        }
      }
    } catch (err: unknown) {
      try {
        setServerError(getErrorMessage(err));
        setTimeout(() => setServerError(null), 5000);
      } catch {
        /* ignore */
      }
    } finally {
      setIsLoading(false);
    }
  };

  const requestPhoneVerificationHash = async (code: string, v: number) => {
    try {
      const orderProducts = cart.map((item) => {
        if (item.modificators?.id) {
          return {
            product: +item.id.split(',')[0],
            count: +item.quantity,
            modificator: item.modificators.id,
          };
        } else {
          return {
            product: +item.id.split(',')[0],
            count: +item.quantity,
          };
        }
      });

      const currentType = orderTypes[activeIndex];
      if (!currentType) {
        setIsLoading(false);
        return;
      }

      const accBase: IReqCreateOrder = {
        phone: phoneNumber
          .replace('-', '')
          .replace('(', '')
          .replace(')', '')
          .replace(' ', '')
          .replace('+', '')
          .replace(' ', ''),
        orderProducts,
        comment,
        serviceMode: 1,
        address: '',
        spot: selectedSpot,
      };

      if (venueData?.table?.tableNum) {
        accBase.serviceMode = 1;
      } else {
        if (currentType.value === 3) {
          accBase.serviceMode = 3;
          accBase.address = address;
        } else {
          accBase.serviceMode = currentType.value;
        }
      }

      const hashLS = getHashLS();
      const payloadBase: IReqCreateOrder = {
        ...accBase,
        spot: selectedSpot,
        organizationSlug: venueData.slug,
        useBonus: true,
        bonus: Math.min(v, maxUsablePoints),
        code,
        hash: hashLS,
        refAgent: getRefAgentLS(),
      };

      lastOrderBaseRef.current = payloadBase;

      const res = await postOrder({
        body: payloadBase,
        organizationSlug: venueData.slug,
        spotId: selectedSpot,
      }).unwrap();

      if (res?.phoneVerificationHash) {
        try {
          localStorage.setItem(
            'phoneVerificationHash',
            res.phoneVerificationHash
          );
          localStorage.setItem('hash', res.phoneVerificationHash);
        } catch {
          /* ignore */
        }
      }
    } catch (err: unknown) {
      try {
        setServerError(getErrorMessage(err));
        setTimeout(() => setServerError(null), 5000);
      } catch {
        /* ignore */
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Normalize paymentUrl returned from backend (may be string or object)
  const normalizePaymentUrl = (pu: unknown): string | null => {
    try {
      if (typeof pu === 'string') return pu;
      if (pu && typeof pu === 'object') {
        const anyPu = pu as { url?: unknown; href?: unknown };
        if (typeof anyPu.url === 'string') return anyPu.url;
        if (typeof anyPu.href === 'string') return anyPu.href;
      }
    } catch {}
    return null;
  };

  const openPointsFlow = () => {
    const digits = phoneNumber.replace(/\D/g, '');
    if (!digits || digits.length < 12) {
      try {
        setPhoneError('Тут нужно минимум 12 символов');
        const el = document.getElementById('phoneNumber');
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch {}
      return;
    }
    setIsPointsModalOpen(true);
  };

  useEffect(() => {
    return () => {
      if (stockToastTimerRef.current) {
        clearTimeout(stockToastTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      <section className='cart relative font-inter bg-[#F1F2F3] px-[16px] pt-[40px] lg:max-w-[1140px] lg:mx-auto'>
        <FoodDetail
          isShow={isShow}
          setIsShow={handleClose}
          item={
            activeFood || {
              category: { categoryName: '', id: 0 },
              productName: '',
              productPhoto: '',
              productPrice: 0,
              productPhotoLarge: '',
              productPhotoSmall: '',
              weight: 0,
              productDescription: '',
              isRecommended: false,
              modificators: [{ id: 0, name: '', price: 0 }],
              quantity: 0,
              id: 0,
            }
          }
        />
        <ClearCartModal isShow={clearCartModal} setActive={setClearCartModal} />
        <WorkTimeModal
          isShow={showWorkTimeModal}
          onClose={() => setShowWorkTimeModal(false)}
        />
        {/* No-points info modal */}
        <NoPointsModal
          showNoPoints={showNoPoints}
          setShowNoPoints={setShowNoPoints}
        />
        {isLoading && <CartLoader />}

        <HeaderBar
          title={t('basket.title')}
          onBack={() => navigate(-1)}
          onClear={() => setClearCartModal(true)}
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

        {window.innerWidth < 768 && (
          <>
            {venueData?.table?.tableNum && (
              <div className='cart__top'>
                {t('table')}
                {venueData.table.tableNum}
              </div>
            )}
            <div className='cart__items'>
              {cart.length > 0 ? (
                cart.map((item) => (
                  <BusketCard
                    key={item.id}
                    item={item}
                    onMaxExceeded={showMaxStockToast}
                  />
                ))
              ) : (
                <div />
              )}
            </div>
          </>
        )}

        <div className='md:flex gap-[24px]'>
          <div className='md:w-[50%]'>
            {cart.length > 0 ? (
              <>
                <SpotsSelector
                  spots={venueData.spots?.map((s) => ({
                    id: s.id,
                    name: s.name,
                    address: s.address || '',
                  }))}
                  selectedSpot={selectedSpot}
                  onSelect={setSelectedSpot}
                  colorTheme={colorTheme}
                  t={t}
                  visible={activeIndex === 0}
                />

                <ContactsForm
                  t={t}
                  colorTheme={colorTheme}
                  inputRef={inputRef}
                  phoneNumber={phoneNumber}
                  onPhoneChange={handlePhoneChange}
                  phoneError={phoneError}
                  isDelivery={isDeliveryType}
                  address={address}
                  onAddressChange={handleAddressChange}
                  addressError={addressError}
                  showCommentInput={showCommentInput}
                  setShowCommentInput={setShowCommentInput}
                  comment={comment}
                  setComment={setComment}
                />

                {/* Delivery info banner */}
                <DeliveryInfoBanner
                  isDelivery={isDeliveryType}
                  deliveryFreeFrom={deliveryFreeFrom}
                  subtotal={subtotal}
                  colorTheme={colorTheme}
                  t={t}
                />

                <SumDetails
                  t={t}
                  colorTheme={colorTheme}
                  active={active}
                  setActive={setActive}
                  wrapperRef={wrapperRef}
                  wrapperHeight={wrapperHeight}
                  subtotal={subtotal}
                  isDelivery={isDeliveryType}
                  deliveryFee={deliveryFee}
                  hasFreeDeliveryHint={hasFreeDeliveryHint}
                  deliveryFreeFrom={deliveryFreeFrom}
                  availablePoints={availablePoints}
                  usePoints={usePoints}
                  setUsePoints={setUsePoints}
                  maxUsablePoints={maxUsablePoints}
                  setBonusPoints={setBonusPoints}
                  onOpenPointsModal={openPointsFlow}
                  displayTotal={displayTotal}
                  onShowNoPoints={() => setShowNoPoints(true)}
                />

                {!showPromoInput ? (
                  <button
                    type='button'
                    className='text-[14px] block underline mb-3'
                    style={{ color: colorTheme }}
                    onClick={() => {
                      vibrateClick();
                      setShowPromoInput(true);
                    }}
                  >
                    {t('addPromoCode')}
                  </button>
                ) : (
                  <div className='cart__promo bg-[#fff] p-[12px] rounded-[12px] mt-[12px]'>
                    <label htmlFor='promoCode' className='block'>
                      <span className='text-[14px] flex items-center justify-between mb-[8px]'>
                        {t('promoCode')}
                        <span className='text-[12px] text-[#ccc]'>
                          Необязательно
                        </span>
                      </span>
                      <input
                        id='promoCode'
                        type='text'
                        placeholder={t('promoCode')}
                        value={promoCode}
                        onChange={(e) => {
                          const v = e.target.value;
                          setPromoCode(v);
                          try {
                            localStorage.setItem('promoCode', v);
                          } catch {
                            /* ignore */
                          }
                        }}
                      />
                    </label>
                  </div>
                )}
              </>
            ) : (
              <Empty />
            )}
          </div>

          {window.innerWidth >= 768 && (
            <div className='busket flex-1'>
              <BusketDesktop
                to='/order'
                createOrder={handleOrder}
                disabled={!cart.length}
              />
            </div>
          )}
        </div>

        <Recommended
          t={t}
          items={recommendedItems}
          renderItem={(item) => (
            <CatalogCard
              foodDetail={handleOpen}
              key={(item as IProduct).id}
              item={item as IProduct}
            />
          )}
        />

        {window.innerWidth < 768 && (
          <FooterBar
            disabled={!cart.length}
            colorTheme={colorTheme}
            onPay={handleOrder}
          />
        )}
        <PointsModal
          isShow={isPointsModalOpen}
          max={maxUsablePoints}
          initial={maxUsablePoints}
          skipOtp={!!getHashLS()}
          onCancel={() => {
            setIsPointsModalOpen(false);
            setUsePoints(false);
            setBonusPoints(0);
            setOtpCode('');
          }}
          onConfirm={(v) => {
            if (!v || v <= 0) {
              setUsePoints(false);
              setBonusPoints(0);
              setIsPointsModalOpen(false);
              return;
            }
            setBonusPoints(v);
            setUsePoints(true);
            if (!getHashLS()) {
              requestOtpForPoints(v);
            } else {
              setIsPointsModalOpen(false);
            }
          }}
          onConfirmOtp={(code) => {
            if (code) {
              setOtpCode(code);
              requestPhoneVerificationHash(code, bonusPoints);
            }
            setIsPointsModalOpen(false);
          }}
        />
        {serverError && (
          <div
            style={{
              position: 'fixed',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#ff4d4f',
              color: '#fff',
              padding: '12px 16px',
              borderRadius: '8px',
              zIndex: 9999,
              maxWidth: '90%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              textAlign: 'center',
            }}
            role="alert"
          >
            {serverError}
          </div>
        )}
      </section>
    </>
  );
};

export default Cart;
