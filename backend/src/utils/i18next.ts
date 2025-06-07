import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { errorMessages, successMessages } from "./constant";

i18n
  .use(Backend) // load translations using HTTP requests (optional in your case)
  .use(LanguageDetector) // auto-detects user's language
  .init({
    fallbackLng: "en", // fallback language if user's language is unsupported
    debug: false, // disable debug logs
    resources: {
      en: {
        translation: {
          errorMessages,
          successMessages,
        },
      },
    },
    interpolation: {
      escapeValue: false, // don't escape HTML (safe for React, Vue, etc.)
    },
  });

export default i18n;
