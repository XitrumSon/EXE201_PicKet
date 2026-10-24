import { retireOfflineCacheOwner } from "@/core/sync/offline-cache";
import { purgeRetiredMutationOwner } from "@/core/sync/mutation-queue";
import { purgeRetiredCaptureOwner } from "@/core/ocr/capture-storage";

export async function retireAccountLocalData(owner: string) {
  // The durable fence first drains both cache and outbox operations. Raw erasure
  // bypasses the fence only after it is committed; failures stop remote deletion.
  await retireOfflineCacheOwner(owner);
  await purgeRetiredMutationOwner(owner);
  await purgeRetiredCaptureOwner(owner);
}
