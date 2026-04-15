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
    debug: true, // Enable debug to help diagnose issues
    interpolation: {
      escapeValue: false,
    },
    backend: {
      // Ensure loadPath is correct regardless of BASE_URL trailing slash
      loadPath: `${import.meta.env.BASE_URL.replace(/\/$/, '')}/locales/{{lng}}/{{ns}}.json`,
    },
    supportedLngs: ['en', 'ja', 'zh-HK', 'zh-TW'],
    nonExplicitSupportedLngs: true,
    ns: ['translation'],
    defaultNS: 'translation',
    react: {
      useSuspense: false, // Disable suspense as no boundary is provided
    },
  });

export default i18n;
