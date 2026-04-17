import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'zh-TW',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: `${import.meta.env.BASE_URL.replace(/\/$/, '')}/locales/{{lng}}/{{ns}}.json`,
    },
    supportedLngs: ['zh-TW', 'en', 'ja', 'zh-HK'],
    fallbackLng: 'zh-TW',
    load: 'languageOnly', // Try to load 'en' if 'en-US' is detected
    nonExplicitSupportedLngs: true,
    cleanCode: true,
    ns: ['translation'],
    defaultNS: 'translation',
    react: {
      useSuspense: false,
    },
  });

export default i18n;
