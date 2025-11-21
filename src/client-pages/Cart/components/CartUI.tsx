import React, { RefObject } from 'react';

import { vibrateClick } from 'utils/haptics';

const clearCartIcon = '/assets/icons/Busket/clear-cart.svg';
const cookieIcon = '/assets/icons/Busket/cookie.svg';
const headerArrowIcon = '/assets/icons/Busket/header-arrow.svg';
const priceArrow = '/assets/icons/Busket/price-arrow.svg';
const deliveryIcon = '/assets/icons/Order/delivery.svg';

import { Pencil } from 'lucide-react';

type TFunc = (k: string, opts?: Record<string, unknown>) => string;

export const HeaderBar: React.FC<{
  title: string;
  onBack: () => void;
  onClear: () => void;
}> = ({ title, onBack, onClear }) => {
  return (
    <header className='cart__header'>
      <img
        src={headerArrowIcon}
        alt=''
        onClick={() => {
          vibrateClick();
          onBack();
        }}
        className='cursor-pointer'
      />
      <h3>{title}</h3>
      <img
        src={clearCartIcon}
        alt=''
        onClick={() => {
          vibrateClick();
          onClear();
        }}
      />
    </header>
  );
};

export const OrderTypeSwitcher: React.FC<{
  items: { text: string; value: number }[];
  activeIndex: number;
  onChange: (idx: number) => void;
  colorTheme?: string;
}> = ({ items, activeIndex, onChange, colorTheme }) => {
  if (items.length <= 1) return null;

  return (
    <div className='cart__order-type'>
      {items.map((item, idx) => (
        <div
          key={item.value}
          onClick={() => {
            vibrateClick();
            onChange(idx);
          }}
          className={`cart__order-type-wrapper bg-[#fff] border-[#e1e2e5] cursor-pointer justify-center ${
            activeIndex === idx ? 'active' : ''
          }`}
          style={{
            borderColor: activeIndex === idx ? colorTheme : '#e1e2e5',
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};

export const SpotsSelector: React.FC<{
  spots?: { id: number; name: string; address: string }[];
  selectedSpot: number;
  onSelect: (id: number) => void;
  colorTheme?: string;
  t: TFunc;
  visible?: boolean;
}> = ({ spots, selectedSpot, onSelect, colorTheme, t, visible = true }) => {
  if (!visible) return null;
  if (!spots || spots.length <= 1) return null;

  return (
    <div className='cart__contacts'>
      <div className='flex items-center justify-between mb-6'>
        <h4>{t('selectBranch')}</h4>
      </div>

      <div className='space-y-4'>
        {spots.map((location) => {
          const isSelected = selectedSpot === location.id;

          return (
            <label
              key={location.id}
              style={{
                borderColor: isSelected && colorTheme ? colorTheme : '#e1e2e5',
              }}
              className='flex items-center w-full px-1 rounded-xl cursor-pointer transition-all duration-200 border-[2px]'
              htmlFor={location.id + ''}
            >
              <div className='relative mr-4 flex-shrink-0'>
                <input
                  type='radio'
                  id={location.id + ''}
                  name='location'
                  checked={isSelected}
                  onChange={() => onSelect(location.id)}
                  className='peer sr-only'
                />
                <div
                  style={{ backgroundColor: colorTheme }}
                  className={`w-5 h-5 rounded-full border-2 transition-colors duration-200 ${
                    isSelected
                      ? 'border-amber-600 bg-amber-600'
                      : 'border-amber-400 bg-white peer-hover:border-amber-500'
                  }`}
                >
                  {isSelected && (
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='w-2 h-2 rounded-full bg-white' />
                    </div>
                  )}
                </div>
              </div>
              <div style={{ color: colorTheme }}>
                <div className='font-medium'>{location.name}</div>
                <div>{location.address}</div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export const ContactsForm: React.FC<{
  t: TFunc;
  colorTheme?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  phoneNumber: string;
  onPhoneChange: (v: string) => void;
  phoneError?: string;
  isDelivery: boolean;
  address: string;
  onAddressChange: (v: string) => void;
  addressError?: string;
  showCommentInput: boolean;
  setShowCommentInput: (v: boolean) => void;
  comment: string;
  setComment: (v: string) => void;
}> = ({
  t,
  colorTheme,
  inputRef,
  phoneNumber,
  onPhoneChange,
  phoneError,
  isDelivery,
  address,
  onAddressChange,
  addressError,
  showCommentInput,
  setShowCommentInput,
  comment,
  setComment,
}) => {
  return (
    <div className='cart__contacts'>
      <label htmlFor='phoneNumber'>
        <span className='text-[16px]'>
          {t('phoneNumber')}{' '}
          <span className='required' style={{ color: colorTheme }}>
            {t('necessarily')}
          </span>
        </span>
        <input
          type='text'
          placeholder='+996'
          id='phoneNumber'
          ref={inputRef}
          value={phoneNumber}
          onChange={(e) => onPhoneChange(e.target.value)}
          className='text-[16px]'
        />
        {phoneError && <div className='error-message'>{phoneError}</div>}
      </label>

      {isDelivery && (
        <label htmlFor='address'>
          <span className='text-[14px]'>{t('addres')}</span>
          <input
            type='text'
            id='address'
            placeholder={t('empty.location') || t('addres')}
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
          />
          {addressError && <div className='error-message'>{addressError}</div>}
        </label>
      )}

      {!showCommentInput ? (
        <button
          type='button'
          className='text-[14px] block underline mb-3'
          style={{ color: colorTheme }}
          onClick={() => {
            vibrateClick();
            setShowCommentInput(true);
          }}
        >
          {t('addComment')}
        </button>
      ) : (
        <label htmlFor='comment'>
          <span className='text-[14px]'>{t('comment')}</span>
          <input
            id='comment'
            type='text'
            placeholder={t('empty.comment') || t('comment')}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </label>
      )}
    </div>
  );
};

export const DeliveryInfoBanner: React.FC<{
  isDelivery: boolean;
  deliveryFreeFrom: number | null;
  subtotal: number;
  colorTheme?: string;
  t: TFunc;
}> = ({ isDelivery, deliveryFreeFrom, subtotal, colorTheme, t }) => {
  if (!isDelivery || deliveryFreeFrom === null) return null;

  return (
    <div
      className='cart__delivery-info rounded-[12px] mt-[12px] bg-white'
      style={{ border: `1px solid ${colorTheme}33` }}
    >
      <div className='cart__delivery-icon' style={{ borderColor: colorTheme }}>
        <img src={deliveryIcon} alt='delivery' />
      </div>
      <div className='cart__delivery-text'>
        {subtotal >= deliveryFreeFrom ? (
          <span>
            {t('freeDeliveryYouGet')}{' '}
            <span style={{ color: colorTheme, fontWeight: 600 }}>
              {t('freeDelivery')}
            </span>
          </span>
        ) : (
          <span>
            {t('freeDeliveryAdd', {
              amount: Math.max(0, Math.ceil(deliveryFreeFrom - subtotal)),
            })}{' '}
            <span style={{ color: colorTheme, fontWeight: 600 }}>
              бесплатной доставки
            </span>
          </span>
        )}
      </div>
    </div>
  );
};

export const SumDetails: React.FC<{
  t: TFunc;
  colorTheme?: string;
  active: boolean;
  setActive: (v: boolean) => void;
  wrapperRef: RefObject<HTMLDivElement | null>;
  wrapperHeight: number;
  subtotal: number;
  isDelivery: boolean;
  deliveryFee: number;
  hasFreeDeliveryHint: boolean;
  deliveryFreeFrom: number | null;
  availablePoints: number;
  usePoints: boolean;
  setUsePoints: (v: boolean) => void;
  maxUsablePoints: number;
  setBonusPoints: (v: number) => void;
  onOpenPointsModal: () => void;
  displayTotal: number;
  onShowNoPoints: () => void;
}> = ({
  t,
  colorTheme,
  active,
  setActive,
  wrapperRef,
  wrapperHeight,
  subtotal,
  isDelivery,
  deliveryFee,
  hasFreeDeliveryHint,
  deliveryFreeFrom,
  availablePoints,
  usePoints,
  setUsePoints,
  maxUsablePoints,
  setBonusPoints,
  onOpenPointsModal,
  displayTotal,
  onShowNoPoints,
}) => {
  return (
    <div className='cart__sum bg-[#fff]'>
      <div
        onClick={() => {
          vibrateClick();
          setActive(!active);
        }}
        className='cart__sum-top text-[#80868B]'
      >
        {t('empty.deteil')}
        <img
          src={priceArrow}
          alt='arrow'
          className={active ? 'cart__sum-img' : 'cart__sum-img active'}
        />
      </div>
      <div
        ref={wrapperRef}
        className={
          active
            ? 'cart__sum-wrapper divide-y active'
            : 'cart__sum-wrapper divide-y'
        }
        style={{ height: `${wrapperHeight}px` }}
      >
        <div className='cart__sum-item text-[#80868B]'>
          {t('empty.total')}
          <div className='cart__sum-total all text-[#80868B]'>{subtotal} c</div>
        </div>

        {isDelivery && (
          <div className='cart__sum-item text-[#80868B]'>
            {t('deliveryFee')}
            <div className='cart__sum-total delivery'>{deliveryFee} c</div>
          </div>
        )}

        {hasFreeDeliveryHint && deliveryFreeFrom !== null && (
          <div className='cart__sum-item text-[#80868B]'>
            <span className=''>{t('freeDeliveryFrom')}</span>
            <div className='cart__sum-total text-[#00BFB2] font-semibold'>
              {Number(deliveryFreeFrom)} c
            </div>
          </div>
        )}
      </div>

      <div
        className='cart__sum-ress border-[#f3f3f3]'
        style={{ borderTop: '1px solid #f3f3f3' }}
      >
        <div className='flex items-center justify-between w-full'>
          <label className='flex items-center gap-2 cursor-pointer'>
            <input
              type='checkbox'
              checked={usePoints}
              onChange={(e) => {
                vibrateClick();
                const checked = e.target.checked;
                if (checked) {
                  onOpenPointsModal();
                } else {
                  setUsePoints(false);
                  setBonusPoints(0);
                }
              }}
            />
            <span>Использовать баллы?</span>
          </label>
          <div className='flex items-center gap-[8px]'>
            {maxUsablePoints} б.
            <Pencil
              size={18}
              className='cursor-pointer'
              onClick={() => {
                vibrateClick();
                onOpenPointsModal();
              }}
            />
          </div>
        </div>
      </div>

      <div className='cart__sum-ress border-[#f3f3f3]' style={{ borderTop: '1px solid #f3f3f3' }}>
        {t('empty.totalAmount')} <span>{displayTotal} c</span>
      </div>
    </div>
  );
};

export const Recommended: React.FC<{
  t: TFunc;
  items: unknown[];
  renderItem: (item: unknown) => React.ReactNode;
}> = ({ t, items, renderItem }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className='cart__forgot'>
      <h4 className='cart__forgot-title'>
        {t('orders.forgotten')}
        <img src={cookieIcon} alt='cookie' />
      </h4>
      <div className='cart__forgot-wrapper'>{items.map(renderItem)}</div>
    </div>
  );
};

export const FooterBar: React.FC<{
  disabled: boolean;
  colorTheme?: string;
  onPay: () => void;
}> = ({ disabled, colorTheme, onPay }) => {
  return (
    <footer className='cart__footer'>
      <button
        disabled={disabled}
        style={{ backgroundColor: colorTheme }}
        onClick={() => {
          vibrateClick();
          onPay();
        }}
      >
        {'Оплатить'}
      </button>
    </footer>
  );
};
