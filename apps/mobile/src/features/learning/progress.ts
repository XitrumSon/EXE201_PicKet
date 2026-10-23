import { curriculum, recordCompletion, type Completion } from "./curriculum";
export type LearningProgress = { version: 1; completed: Completion[] };
function parseProgress(value: unknown, owner: string): LearningProgress {
  if (value === undefined || value === null) return { version: 1, completed: [] };
  const data = value as LearningProgress;
  if (data.version !== 1 || !Array.isArray(data.completed)) throw new Error("Unsupported learning progress");
  const ids = new Set<string>();
  for (const row of data.completed) {
    const key = `${row.lessonId}:${row.version}`;
    if (row.owner !== owner || ids.has(key) || row.xp !== 20 || !curriculum.lessons.some(lesson => lesson.lessonId === row.lessonId && lesson.version === row.version)) throw new Error("Invalid learning history");
    ids.add(key);
  }
  return { version: 1, completed: data.completed.map(row => ({ ...row })) };
}
export function createLearningProgressStore(storage: { read(owner: string): Promise<unknown>; write(owner: string, progress: LearningProgress): Promise<void> }) {
  const queues = new Map<string, Promise<void>>();
  const validateOwner = (owner: string) => { if (!/^[A-Za-z0-9_-]{1,200}$/.test(owner)) throw new Error("Invalid learning owner"); };
  async function load(owner: string) {
    validateOwner(owner); await queues.get(owner)?.catch(() => undefined);
    return parseProgress(await storage.read(owner), owner);
  }
  async function complete(owner: string, lessonId: string, version: number) {
    validateOwner(owner);
    if (!curriculum.lessons.some(lesson => lesson.lessonId === lessonId && lesson.version === version)) throw new Error("Unknown lesson version");
    const operation = (queues.get(owner) ?? Promise.resolve()).catch(() => undefined).then(async () => {
      const previous = parseProgress(await storage.read(owner),owner);
      await storage.write(owner, { version: 1, completed: recordCompletion(previous.completed,owner,lessonId,version) });
    });
    queues.set(owner,operation);
    try { await operation; } finally { if (queues.get(owner) === operation) queues.delete(owner); }
    return load(owner);
  }
  return { load, complete };
}
