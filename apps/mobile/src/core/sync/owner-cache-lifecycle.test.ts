import assert from "node:assert/strict";
import { test } from "node:test";
import { createOwnerCacheLifecycle } from "./owner-cache-lifecycle";

function fixture() {
  const retired = new Set<string>();
  const rows = new Map<string, string>([["a", "private"], ["b", "other"], ["device-guest", "guest"]]);
  const driver = {
    isRetired: async (owner: string) => retired.has(owner),
    retire: async (owner: string) => { retired.add(owner); rows.delete(owner); },
    resume: async (owner: string) => { retired.delete(owner); },
  };
  return { retired, rows, driver, store: createOwnerCacheLifecycle(driver) };
}

test("retirement removes only the selected owner's cache and survives a new instance", async () => {
  const f = fixture();
  await f.store.retire("a");
  assert.equal(f.rows.has("a"), false);
  assert.equal(f.rows.get("b"), "other");
  assert.equal(f.rows.get("device-guest"), "guest");
  const restarted = createOwnerCacheLifecycle(f.driver);
  await assert.rejects(restarted.run("a", async () => f.rows.set("a", "late")), /retired/);
  await assert.rejects(restarted.run("a", async () => "read"), /retired/);
});

test("retirement drains dispatched writes and rejects queued writes from the previous generation", async () => {
  const f = fixture();
  let release!: () => void;
  let started!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  const entered = new Promise<void>(resolve => { started = resolve; });
  const first = f.store.run("a", async () => { started(); await gate; f.rows.set("a", "first"); });
  await entered;
  const queued = f.store.run("a", async () => { f.rows.set("a", "queued"); });
  const rejected = assert.rejects(queued, /retired/);
  const retirement = f.store.retire("a");
  await assert.rejects(f.store.run("a", async () => {}), /retired/);
  release();
  await Promise.all([first, rejected, retirement]);
  assert.equal(f.rows.has("a"), false);
});

test("failed retirement is fail-closed, retryable, and never decrypts corrupt cached data", async () => {
  const f = fixture();
  let fail = true;
  const store = createOwnerCacheLifecycle({ ...f.driver, retire: async owner => {
    if (fail) throw Error("storage unavailable");
    await f.driver.retire(owner);
  } });
  await assert.rejects(store.retire("a"), /storage unavailable/);
  await assert.rejects(store.run("a", async () => { throw Error("decrypt corrupt data"); }), /retired/);
  fail = false;
  await store.retire("a");
  assert.equal(f.rows.has("a"), false);
});

test("explicit resume reopens an empty owner without reviving queued writes", async () => {
  const f = fixture();
  const stale = f.store.run("a", async () => { f.rows.set("a", "stale"); });
  const rejected = assert.rejects(stale, /retired/);
  const retired = f.store.retire("a");
  const resumed = f.store.resume("a");
  await Promise.all([rejected, retired, resumed]);
  assert.equal(f.rows.has("a"), false);
  await f.store.run("a", async () => { f.rows.set("a", "fresh"); });
  assert.equal(f.rows.get("a"), "fresh");
});

test("resume failure keeps the owner fenced and does not affect another owner", async () => {
  const f = fixture();
  const store = createOwnerCacheLifecycle({ ...f.driver, resume: async () => { throw Error("disk"); } });
  await store.retire("a");
  await assert.rejects(store.resume("a"), /disk/);
  await assert.rejects(store.run("a", async () => 1), /retired/);
  assert.equal(await store.run("b", async () => f.rows.get("b")), "other");
});

test("a failed ordinary operation does not poison subsequent work or another owner's queue", async () => {
  const f = fixture();
  await assert.rejects(f.store.run("a", async () => { throw Error("decode"); }), /decode/);
  assert.equal(await f.store.run("a", async () => 42), 42);
  await f.store.retire("a");
  assert.equal(await f.store.run("device-guest", async () => f.rows.get("device-guest")), "guest");
});

test("invalid owners cannot reach the persistence driver", async () => {
  const f = fixture();
  for (const owner of ["", " a", "a\n", "../a", "x".repeat(129)]) {
    await assert.rejects(f.store.run(owner, async () => 1), /owner/);
    await assert.rejects(f.store.retire(owner), /owner/);
    await assert.rejects(f.store.resume(owner), /owner/);
  }
  assert.equal(f.retired.size, 0);
});
