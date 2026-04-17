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
    lowerCaseLng: false, // Keep case sensitive to match standard codes like zh-TW
    nonExplicitSupportedLngs: true,
    load: 'currentOnly',
    ns: ['translation'],
    defaultNS: 'translation',
    react: {
      useSuspense: false, // Disable suspense as no boundary is provided
    },
  });

export default i18n;
