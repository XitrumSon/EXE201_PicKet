import { buildLedgerFacts,type LedgerFactsInput } from "./ledger-facts";
export type LedgerSnapshot=Pick<LedgerFactsInput,"asOf"|"wallets"|"entries"|"confirmations">&{wallets:(LedgerFactsInput["wallets"][number]&{name:string})[]};
export function parseLedgerSnapshot(value:unknown):LedgerSnapshot{void value;throw new Error("Snapshot parser not implemented");}
export function ledgerOpening(snapshot:LedgerSnapshot,ids:string[],currency:string,pendingCount:number):ReturnType<typeof buildLedgerFacts>{
  void snapshot;void ids;void currency;void pendingCount;throw new Error("Opening facts not implemented");
}
