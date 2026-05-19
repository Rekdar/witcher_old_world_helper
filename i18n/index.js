"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.myLangs = exports.resources = exports.defaultNS = void 0;
const i18next_1 = __importDefault(require("i18next"));
const i18next_browser_languagedetector_1 = __importDefault(require("i18next-browser-languagedetector"));
const i18next_localstorage_backend_1 = __importDefault(require("i18next-localstorage-backend"));
const react_i18next_1 = require("react-i18next");
const translation_json_1 = __importDefault(require("../locales/en/translation.json"));
const translation_json_2 = __importDefault(require("../locales/pl/translation.json"));
/*
Automatically add new words to locale files: https://www.i18next.com/how-to/extracting-translations
Caching state locally (first code block): https://www.i18next.com/how-to/caching
Custom Formatting for lowercasing all new words added: https://www.i18next.com/translation-function/formatting#adding-custom-format-function
    * Github issue asking: https://github.com/i18next/i18next/issues/765
Automatically translate i18next JSON: https://translate.i18next.com/
Interpolation (most used functionalities - dynamic values): https://www.i18next.com/translation-function/interpolation
 
Use i18next-parser to locate and generate locales JSON files: https://github.com/i18next/i18next-parser
*/
exports.defaultNS = "translation";
exports.resources = {
    en: { translation: translation_json_1.default },
    pl: { translation: translation_json_2.default },
};
exports.myLangs = {
    en: "EN",
    pl: "PL"
};
Object.keys(exports.myLangs);
i18next_1.default
    .use(i18next_localstorage_backend_1.default)
    .use(i18next_browser_languagedetector_1.default)
    .use(react_i18next_1.initReactI18next) // passes i18n down to react-i18next
    .init({
    partialBundledLanguages: true,
    resources: exports.resources,
    fallbackLng: "en",
    debug: true,
    interpolation: {
        escapeValue: false
    },
    keySeparator: ".",
    returnObjects: true,
    backend: {
        backends: [
            i18next_localstorage_backend_1.default,
        ],
        backendOptions: [{
                expirationTime: 7 * 24 * 60 * 60 * 1000 // 7 days
            }, {
                loadPath: '../locales/{{lng}}/{{ns}}.json'
            }]
    }
});
i18next_1.default.loadLanguages(Object.keys(exports.myLangs));
(_a = i18next_1.default.services.formatter) === null || _a === void 0 ? void 0 : _a.add('lowercase', (value, lng, options) => {
    return value.toLowerCase();
});
exports.default = i18next_1.default;
