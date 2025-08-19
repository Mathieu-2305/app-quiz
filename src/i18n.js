import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enCommon from "./locales/en/common.json";
import frCommon from "./locales/fr/common.json";
import deCommon from "./locales/de/common.json";
import itCommon from "./locales/it/common.json";

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			en: { common: enCommon },
			fr: { common: frCommon },
			de: { common: deCommon},
			it: { common: itCommon}
		},
		fallbackLng: "en",
		supportedLngs: ["en", "fr", "de", "it"],
		load: "languageOnly",
		nonExplicitSupportedLngs: true,
		ns: ["common"],
		defaultNS: "common",
		detection: { order: ["localStorage", "querystring", "navigator"],
			caches: ["localStorage"],
			lookupQuerystring: "lng" },
		interpolation: { escapeValue: false },
		react: { useSuspense: false },
		initImmediate: false,
		returnNull: false
	});


export default i18n;

