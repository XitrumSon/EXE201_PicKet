export type CaptureRetirementSource = {
  isRetired(owner:string):Promise<boolean>;
  roots:string[];
  directory(root:string,owner:string):string;
  removeDirectory(uri:string):Promise<void>;
  database():Promise<{withExclusiveTransactionAsync(operation:(tx:{runAsync(sql:string,...args:string[]):Promise<unknown>})=>Promise<void>):Promise<void>}>;
};

export const captureOwnerSchema = `
CREATE TABLE IF NOT EXISTS capture_drafts (owner_id TEXT PRIMARY KEY NOT NULL, payload TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS capture_ocr_intents (owner_id TEXT NOT NULL, capture_id TEXT NOT NULL, payload TEXT NOT NULL, PRIMARY KEY(owner_id,capture_id));
CREATE TABLE IF NOT EXISTS capture_picker_attempts (owner_id TEXT PRIMARY KEY NOT NULL, operation_id TEXT NOT NULL);
`;

export async function purgeCaptureOwner(_owner:string,_source:CaptureRetirementSource):Promise<void>{}
