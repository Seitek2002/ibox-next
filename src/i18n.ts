import { initReactI18next } from 'react-i18next';

import en from './locales/en/translation.json';
import kg from './locales/kg/translation.json';
import ru from './locales/ru/translation.json';

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ru',
    supportedLngs: ['ru', 'en', 'kg'],
    debug: false,
    resources: {
      ru: { translation: ru },
      en: { translation: en },
      kg: { translation: kg },
    },
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
