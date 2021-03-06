import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from './locales/en';
import ko from './locales/ko';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: en,
            ko: ko
        },
        lng: "en", // if you're using a language detector, do not define the lng option
        fallbackLng: "en",
        ns: ['common', "alert"],
    });

export default i18n
