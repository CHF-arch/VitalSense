import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import moment from "moment";
import "moment-timezone";
import "moment/locale/el"; // Import Greek locale for moment

i18n
  .use(HttpApi)
  .use(LanguageDetector)
.use(initReactI18next)
  .init({
    supportedLngs: ["en", "el"],
    fallbackLng: "en",
    detection: {
      order: ["cookie", "htmlTag", "localStorage", "path", "subdomain"],
      caches: ["cookie"],
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
    },
    react: { useSuspense: false },
  });

// Set moment's locale when i18n language changes
i18n.on("languageChanged", (lng) => {
  moment.locale(lng);
});

// Set default timezone for moment
moment.tz.setDefault("Europe/Athens");

export default i18n;
