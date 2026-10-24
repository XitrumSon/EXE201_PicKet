export type ReceiptRetirementSource={
  root:string;
  isRetired(owner:string):Promise<boolean>;
  directory(root:string,owner:string):string;
  files(root:string):Promise<string[]>;
  removeFile(uri:string):Promise<void>;
  removeDirectory(uri:string):Promise<void>;
  database():Promise<{
    getAllAsync<T>(sql:string,...args:string[]):Promise<T[]>;
    withExclusiveTransactionAsync(action:(tx:{runAsync(sql:string,...args:string[]):Promise<unknown>})=>Promise<void>):Promise<void>;
  }>;
};

export async function purgeReceiptOwner(_owner:string,_source:ReceiptRetirementSource):Promise<void>{}
