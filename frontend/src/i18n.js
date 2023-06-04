import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationHN from './locales/hn/translations.json';
import translationGJ from './locales/gj/translations.json';

const availableLanguages = ['en','hn','gj']

// the translations
const resources = {
  hn: {
    translation: translationHN
  },
  gj: {
    translation: translationGJ
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en",

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;