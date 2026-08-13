import { format } from '@react-input/mask';
import type { Replacement, Track } from '@react-input/mask';

/** Кыргызстан: код страны 996 + 9 цифр номера. */
export const PHONE_COUNTRY_CODE = '996';
export const PHONE_LOCAL_LENGTH = 9;
/** Маска только для «местной» части: +996 показывается отдельной подписью. */
export const PHONE_MASK = '___ ___ ___';
export const PHONE_PLACEHOLDER = '709 556 597';
export const PHONE_REPLACEMENT: Replacement = { _: /\d/ };
export const PHONE_MASK_OPTIONS = {
  mask: PHONE_MASK,
  replacement: PHONE_REPLACEMENT,
};

/**
 * Оставляет только 9 цифр «местного» номера: срезает код страны,
 * ведущие нули (0709… → 709…) и всё лишнее.
 */
export function toLocalDigits(value: string): string {
  let digits = (value || '').replace(/\D/g, '');

  // Срезаем код страны везде, кроме случая, когда цифр ровно 9:
  // тогда это уже местный номер (у O! есть коды вида 996XXXXXX).
  if (
    digits.startsWith(PHONE_COUNTRY_CODE) &&
    digits.length !== PHONE_LOCAL_LENGTH
  ) {
    digits = digits.slice(PHONE_COUNTRY_CODE.length);
  }
  digits = digits.replace(/^0+/, '');

  return digits.slice(0, PHONE_LOCAL_LENGTH);
}

/** Приводит любое написание номера к виду маски: 709 556 597. */
export function formatPhone(value: string): string {
  const digits = toLocalDigits(value);

  return digits ? format(digits, PHONE_MASK_OPTIONS) : '';
}

/** Формат для бэкенда: 996XXXXXXXXX. */
export function toApiPhone(value: string): string {
  return `${PHONE_COUNTRY_CODE}${toLocalDigits(value)}`;
}

export function isPhoneComplete(value: string): boolean {
  return toLocalDigits(value).length === PHONE_LOCAL_LENGTH;
}

/**
 * Нормализует ввод перед маской: вставленный из буфера номер в любом виде
 * (+996 709 556-597, 0709556597, 996709556597) превращается в 9 цифр,
 * а нецифровой мусор не вставляется вовсе.
 */
export const trackPhoneInsert: Track = ({ inputType, data, value }) => {
  if (inputType !== 'insert') return data;

  let digits = (data ?? '').replace(/\D/g, '');
  if (!digits) return false;

  if (digits.length >= PHONE_LOCAL_LENGTH) {
    digits = toLocalDigits(digits);
  } else if (!toLocalDigits(value).length) {
    // Местный номер не начинается с нуля: 0709… → 709…
    digits = digits.replace(/^0+/, '');
  }

  return digits || false;
};
