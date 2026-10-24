type Driver = {
  isRetired(owner: string): Promise<boolean>;
  retire(owner: string): Promise<void>;
  resume(owner: string): Promise<void>;
};

export function createOwnerCacheLifecycle(driver: Driver) {
  return {
    run: <T>(_owner: string, operation: () => Promise<T>) => operation(),
    retire: (owner: string) => driver.retire(owner),
    resume: (owner: string) => driver.resume(owner),
  };
}
