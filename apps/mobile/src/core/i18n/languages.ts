import { authEn, authVi } from "./auth-resources";
import { cashflowEn, cashflowVi } from "./cashflow-resources";
import { transactionsEn, transactionsVi } from "./transactions-resources";
import { securityEn, securityVi } from "./security-resources";
import { en, vi } from "./resources";
import { commonEn, commonVi } from "./common-resources";
import { learningEn, learningVi } from "./learning-resources";
import { calendarEn, calendarVi } from "./calendar-resources";
import { overviewEn, overviewVi } from "./overview-resources";
/** Add complete reviewed resources here; selectors and formatters use this registry. */
export const languages = {
  vi: { name: "Tiếng Việt", locale: "vi-VN", direction: "ltr", translation: vi, common: commonVi, learning: learningVi, calendar: calendarVi, overview: overviewVi, transactions: transactionsVi, security: securityVi, cashflow: cashflowVi, auth: authVi },
  en: { name: "English", locale: "en-US", direction: "ltr", translation: en, common: commonEn, learning: learningEn, calendar: calendarEn, overview: overviewEn, transactions: transactionsEn, security: securityEn, cashflow: cashflowEn, auth: authEn },
} as const;
export type AppLanguage = keyof typeof languages;
export const languageCodes = Object.keys(languages) as AppLanguage[];
