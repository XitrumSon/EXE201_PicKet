import type { GuestFinance } from "@/core/local/guest-finance";
import { guestOwnerId } from "@/core/local/guest-finance";
import type { Keepsake } from "@/features/keepsakes/keepsake-store";
import { makeGuestReceipt, type GuestReceipt } from "@/core/receipts/guest-receipt-model";
import { backupAppearance } from "./backup-appearance";
import {validateReconciliationReceipts} from "../local/guest-reconciliation-receipts";

export interface GuestBackupPayload {
  finance: GuestFinance;
  keepsakes: Keepsake[];
  receipts: GuestReceipt[];
  media: Record<string, string>;
}

const object = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value);
const hasId = (value: unknown): value is { id: string } => object(value) && typeof value.id === "string" && value.id.length > 0;

export function validateGuestBackupPayload(value: unknown): GuestBackupPayload {
  if (!object(value) || !object(value.finance) || !Array.isArray(value.keepsakes) || !Array.isArray(value.receipts) || !object(value.media)) throw new Error("Bản sao trên máy không hợp lệ.");
  const finance = value.finance;
  if (!object(finance.profile) || finance.profile.id !== guestOwnerId ||
      !Array.isArray(finance.accounts) || !Array.isArray(finance.categories) ||
      !Array.isArray(finance.transactions) || !Array.isArray(finance.budgets) ||
      !Array.isArray(finance.bills) || !Array.isArray(finance.subscriptions) ||
      !object(finance.splits) || !object(finance.planningPeriods) || !object(finance.planningCloses) ||
      typeof finance.planningMethod !== "string") throw new Error("Dữ liệu tài chính trong bản sao không hợp lệ.");
  backupAppearance(finance.profile);
  validateReconciliationReceipts(finance.reconciliationReceipts);
  const receiptIds = finance.receiptCreateIds;
  if (receiptIds !== undefined && (!Array.isArray(receiptIds) || receiptIds.length > 50_000 ||
      !receiptIds.every(id => typeof id === "string" && id.length > 0 && id.length <= 200) ||
      new Set(receiptIds).size !== receiptIds.length)) throw new Error("Lịch sử tạo hóa đơn trong bản sao không hợp lệ.");
  for (const key of ["accounts", "categories", "transactions", "budgets", "bills", "subscriptions"] as const) {
    if (!(finance[key] as unknown[]).every(hasId)) throw new Error("Danh sách tài chính trong bản sao không hợp lệ.");
    const ids = (finance[key] as { id: string }[]).map(item => item.id);
    if (new Set(ids).size !== ids.length) throw new Error("Danh sách tài chính trong bản sao có mã trùng lặp.");
  }
  const validMoney = (amount: unknown) => Number.isSafeInteger(amount) && (amount as number) >= 0 && (amount as number) <= 9_000_000_000_000;
  const validMonth = (month: string) => /^\d{4}-(0[1-9]|1[0-2])$/.test(month);
  if (!["simple", "envelope", "zero_based", "fifty_thirty_twenty", "event"].includes(String(finance.planningMethod))) throw new Error("Phương pháp ngân sách trong bản sao không hợp lệ.");
  for (const [key, limit] of Object.entries(finance.planningPeriods)) {
    const separator = key.indexOf(":");
    if (separator !== 7 || !validMonth(key.slice(0, separator)) || key.length === 8 || !validMoney(limit)) throw new Error("Hạn mức trong bản sao không hợp lệ.");
  }
  for (const [month, close] of Object.entries(finance.planningCloses)) {
    if (!validMonth(month) || !object(close) || close.month !== month ||
        !Number.isSafeInteger(close.income) || (close.income as number) < 0 || !Number.isSafeInteger(close.expense) ||
        typeof close.note !== "string" || close.note.length > 1000 || typeof close.rollover !== "boolean" ||
        typeof close.closedAt !== "string" || !Number.isFinite(Date.parse(close.closedAt))) throw new Error("Thông tin chốt tháng trong bản sao không hợp lệ.");
  }
  const accountIds = new Set((finance.accounts as { id: string }[]).map((item) => item.id));
  const currencies=new Map((finance.accounts as {id:string;currencyCode:string}[]).map(item=>[item.id,item.currencyCode]));
  for (const account of finance.accounts as Record<string, unknown>[]) {
    if (typeof account.name !== "string" || !Number.isSafeInteger(account.openingBalance) || Math.abs(account.openingBalance as number)>9e12 || typeof account.currencyCode!=="string" || !/^[A-Z]{3}$/.test(account.currencyCode)) throw new Error("Ví trong bản sao không hợp lệ.");
  }
  for (const transaction of finance.transactions as Record<string, unknown>[]) {
    if (typeof transaction.title !== "string" || !validMoney(transaction.amount) || transaction.amount === 0 ||
        typeof transaction.occurredAt !== "string" || Number.isNaN(Date.parse(transaction.occurredAt)) ||
        typeof transaction.accountId !== "string" || !accountIds.has(transaction.accountId) ||
        (transaction.destinationAccountId !== null && (typeof transaction.destinationAccountId !== "string" || !accountIds.has(transaction.destinationAccountId)))) throw new Error("Giao dịch trong bản sao không hợp lệ.");
    if(!["income","expense","refund","transfer"].includes(String(transaction.kind)) ||
      (transaction.kind==="transfer" && (transaction.destinationAccountId===transaction.accountId || !transaction.destinationAccountId || currencies.get(String(transaction.accountId))!==currencies.get(String(transaction.destinationAccountId)))) ||
      (transaction.kind!=="transfer"&&transaction.destinationAccountId!==null))throw new Error("Invalid transfer in backup");
  }
  for (const item of value.keepsakes) {
    if (!object(item) || !hasId(item)) throw new Error("Kỷ vật trong bản sao không hợp lệ.");
    const record = item as Record<string, unknown>;
    const photoUri = record.photoUri;
    if (record.userId !== guestOwnerId || (photoUri !== null && (typeof photoUri !== "string" || !/^image:\d+$/.test(photoUri) || typeof value.media[photoUri] !== "string"))) throw new Error("Kỷ vật hoặc ảnh trong bản sao không hợp lệ.");
  }
  const transactionIds = new Set((finance.transactions as { id: string }[]).map((item) => item.id));
  for (const receipt of value.receipts) {
    if (!object(receipt) || !transactionIds.has(String(receipt.transactionId))) throw new Error("Ảnh hóa đơn không thuộc giao dịch trong bản sao.");
    makeGuestReceipt(receipt as unknown as GuestReceipt);
  }
  return value as unknown as GuestBackupPayload;
}
