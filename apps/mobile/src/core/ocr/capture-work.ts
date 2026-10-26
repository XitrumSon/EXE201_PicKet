export async function prepareCapture<T>(_recognize: () => Promise<void>, persist: () => Promise<T>): Promise<T> {
  return persist();
}
