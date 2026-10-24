import type { LedgerSnapshot } from "./ledger-snapshot";
export function buildWeeklyStory(snapshot:LedgerSnapshot,accounts:string[],currency:string):{weekStart:string;throughDay:string;income:number;expenses:number;refunds:number;transferNet:number;net:number;transactionIds:string[]}{
 void snapshot;void accounts;void currency;throw new Error("Weekly story not implemented");
}
