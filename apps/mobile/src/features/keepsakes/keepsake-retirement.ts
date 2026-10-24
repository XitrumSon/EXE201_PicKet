export type KeepsakeRetirementSource={
  root:string;
  isRetired(owner:string):Promise<boolean>;
  directory(root:string,namespace:"keepsakes"|"keepsake-cloud-cache",owner:string):string;
  removeDirectory(uri:string):Promise<void>;
  database():Promise<{withExclusiveTransactionAsync(action:(tx:{runAsync(sql:string,...args:string[]):Promise<unknown>})=>Promise<void>):Promise<void>}>;
};
export async function purgeKeepsakeOwner(_owner:string,_source:KeepsakeRetirementSource):Promise<void>{}
