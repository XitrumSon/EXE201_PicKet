import type { AppLanguage } from "../../core/i18n/formatters";
export type ReconciliationNotice = { difference:number; local:boolean; refreshFailed:boolean };
export function reconciliationNoticeCopy(notice:ReconciliationNotice, language:AppLanguage):string {
  void notice; void language; return "";
}
