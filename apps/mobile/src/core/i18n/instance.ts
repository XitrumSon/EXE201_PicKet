import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import type { AppLanguage } from "./formatters";
import { resources } from "./resources";
export function createAppI18n(language: AppLanguage) {
  const instance = createInstance();
  void instance.use(initReactI18next).init({ resources, lng: language, fallbackLng: "vi", supportedLngs: ["vi", "en"],
    initAsync: false, keySeparator: false, interpolation: { escapeValue: false }, react: { useSuspense: false } });
  return instance;
}
