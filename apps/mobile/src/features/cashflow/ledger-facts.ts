type Wallet={id:string;currencyCode:string;openingBalance:number;archived:boolean;deletedAt:string|null;updatedAt:string};
type Entry={id:string;accountId:string;destinationAccountId:string|null;kind:string;amount:number;occurredAt:string;deletedAt:string|null;updatedAt:string};
type Confirmation={transactionId:string;confirmedAt:string;source:"manual"|"reviewed-receipt"|"cloud-verified"};
export type LedgerFactsInput={asOf:string;currency:string;selectedAccountIds:string[];wallets:Wallet[];entries:Entry[];confirmations:Confirmation[];pendingTransactionIds:string[]};
export function buildLedgerFacts(_input:LedgerFactsInput){
  return {quality:"ready",balance:0,includedTransactionIds:[] as string[],excluded:[] as {id:string;reason:string}[]};
}
