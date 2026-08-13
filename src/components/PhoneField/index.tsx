import React, { useState } from 'react';

import { useMask } from '@react-input/mask';

import {
  PHONE_COUNTRY_CODE,
  PHONE_MASK,
  PHONE_PLACEHOLDER,
  PHONE_REPLACEMENT,
  trackPhoneInsert,
} from 'utils/phone';

const ERROR_COLOR = '#E63A3A';
const BORDER_COLOR = '#E1E2E5';

interface PhoneFieldProps {
  id?: string;
  label?: string;
  requiredText?: string;
  value: string;
  onChange: (value: string) => void;
  /** Проверку удобно делать на потере фокуса, а не на каждый символ. */
  onBlur?: () => void;
  onEnter?: () => void;
  error?: string;
  colorTheme?: string;
}

const PhoneField: React.FC<PhoneFieldProps> = ({
  id = 'phoneNumber',
  label,
  requiredText,
  value,
  onChange,
  onBlur,
  onEnter,
  error,
  colorTheme,
}) => {
  const [focused, setFocused] = useState(false);
  // Код страны — статичная подпись, а не часть маски: так вставка номера
  // из буфера в любом формате не спорит с «+996» внутри значения.
  const maskRef = useMask({
    mask: PHONE_MASK,
    replacement: PHONE_REPLACEMENT,
    track: trackPhoneInsert,
  });

  const borderColor = error
    ? ERROR_COLOR
    : focused && colorTheme
      ? colorTheme
      : BORDER_COLOR;

  return (
    <label htmlFor={id}>
      {label && (
        <span className='text-[16px]'>
          {label}{' '}
          {requiredText && (
            <span className='required' style={{ color: colorTheme }}>
              {requiredText}
            </span>
          )}
        </span>
      )}

      <div
        className='flex items-center w-full mb-[8px] rounded-[8px] px-[16px]'
        style={{ border: `1px solid ${borderColor}` }}
      >
        <span className='text-[16px] text-[#80868B] select-none'>
          +{PHONE_COUNTRY_CODE}
        </span>
        <input
          id={id}
          name='phone'
          // Цифровая клавиатура на мобильных + автозаполнение своего номера.
          type='tel'
          inputMode='numeric'
          autoComplete='tel'
          ref={maskRef}
          value={value}
          placeholder={PHONE_PLACEHOLDER}
          aria-invalid={Boolean(error)}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onEnter?.();
          }}
          style={{
            flex: 1,
            width: '100%',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            margin: 0,
            padding: '12px 0 12px 8px',
            // 16px — иначе iOS зумит страницу при фокусе.
            fontSize: 16,
          }}
        />
      </div>

      {error && (
        <div role='alert' className='text-[12px]' style={{ color: ERROR_COLOR }}>
          {error}
        </div>
      )}
    </label>
  );
};

export default PhoneField;
