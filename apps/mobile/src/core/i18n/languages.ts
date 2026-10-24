import { authEn, authVi } from "./auth-resources";
import { profileEn, profileVi } from "./profile-resources";
import { updatesEn, updatesVi } from "./update-resources";
import { learningAiEn, learningAiVi } from "./learning-ai-resources";
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
  vi: { name: "Tiếng Việt", locale: "vi-VN", direction: "ltr", translation: vi, common: commonVi, learning: learningVi, learningAi: learningAiVi, calendar: calendarVi, overview: overviewVi, transactions: transactionsVi, security: securityVi, cashflow: cashflowVi, auth: authVi, profile: profileVi, updates: updatesVi },
  en: { name: "English", locale: "en-US", direction: "ltr", translation: en, common: commonEn, learning: learningEn, learningAi: learningAiEn, calendar: calendarEn, overview: overviewEn, transactions: transactionsEn, security: securityEn, cashflow: cashflowEn, auth: authEn, profile: profileEn, updates: updatesEn },
} as const;
export type AppLanguage = keyof typeof languages;
export const languageCodes = Object.keys(languages) as AppLanguage[];
