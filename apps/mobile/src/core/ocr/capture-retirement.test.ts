import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { captureOwnerSchema, purgeCaptureOwner, type CaptureRetirementSource } from "./capture-retirement";

function fixture() {
  const db = new DatabaseSync(":memory:"); db.exec(captureOwnerSchema);
  for (const owner of ["a", "b", "device-guest"]) {
    db.prepare("INSERT INTO capture_drafts VALUES (?, ?)").run(owner, "corrupt encrypted draft");
    db.prepare("INSERT INTO capture_ocr_intents VALUES (?, ?, ?)").run(owner, "capture", "corrupt OCR result");
    db.prepare("INSERT INTO capture_picker_attempts VALUES (?, ?)").run(owner, "operation");
  }
  const directories = new Set(["file:///private/documents/capture-drafts/a", "file:///private/cache/capture-drafts/a", "file:///private/documents/capture-drafts/b", "file:///private/documents/capture-drafts/device-guest"]);
  const source: CaptureRetirementSource = {
    isRetired: async () => true,
    roots: ["file:///private/documents/", "file:///private/cache/"],
    directory: (root, owner) => `${root}capture-drafts/${owner}`,
    removeDirectory: async uri => { directories.delete(uri); },
    database: async () => ({ withExclusiveTransactionAsync: async operation => {
      db.exec("BEGIN EXCLUSIVE");
      try { await operation({runAsync: async (sql, ...args) => db.prepare(sql).run(...args)}); db.exec("COMMIT"); }
      catch(error) { db.exec("ROLLBACK"); throw error; }
    } }),
  };
  return { db, directories, source };
}

test("retired capture erasure removes only attributed owner directories and all three journal tables without decrypting", async () => {
  const f = fixture();
  try {
    await purgeCaptureOwner("a", f.source); await purgeCaptureOwner("a", f.source);
    assert.deepEqual([...f.directories].sort(), ["file:///private/documents/capture-drafts/b", "file:///private/documents/capture-drafts/device-guest"]);
    for (const table of ["capture_drafts", "capture_ocr_intents", "capture_picker_attempts"]) {
      assert.equal(f.db.prepare(`SELECT COUNT(*) AS count FROM ${table} WHERE owner_id='a'`).get()?.count,0);
      assert.equal(f.db.prepare(`SELECT COUNT(*) AS count FROM ${table} WHERE owner_id='b'`).get()?.count,1);
      assert.equal(f.db.prepare(`SELECT COUNT(*) AS count FROM ${table} WHERE owner_id='device-guest'`).get()?.count,1);
    }
  } finally { f.db.close(); }
});

test("all deletion targets are validated before touching any file and active owners cannot be purged", async () => {
  const f = fixture(); let deleted = 0;
  try {
    await assert.rejects(purgeCaptureOwner("a", {...f.source,isRetired:async()=>false}),/retired/);
    const invalid = ["file:///private/documents/capture-drafts/b", "file:///private/documents/capture-drafts/a/../b", "file:///private/documents/capture-drafts/%61", "file:///private/documents/capture-drafts/a?target=b", "file:///private/documents/capture-drafts/a#other", "https://example.test/capture-drafts/a"];
    for (const bad of invalid) await assert.rejects(purgeCaptureOwner("a", {...f.source,
      directory:(root,owner)=>root.includes("/cache/")?bad:f.source.directory(root,owner),removeDirectory:async()=>{deleted++;},
    }),/directory/);
    for (const owner of ["../b", "", "a/b", "a%2fb"]) await assert.rejects(purgeCaptureOwner(owner,f.source),/owner/);
    assert.equal(deleted,0);
  } finally { f.db.close(); }
});

test("image deletion failure retains journal references; SQL failure rolls back and remains retryable", async () => {
  const f = fixture();
  try {
    await assert.rejects(purgeCaptureOwner("a",{...f.source,removeDirectory:async()=>{throw Error("file busy");}}),/file busy/);
    assert.equal(f.db.prepare("SELECT COUNT(*) AS count FROM capture_drafts WHERE owner_id='a'").get()?.count,1);
    f.db.exec("CREATE TRIGGER fail_erasure BEFORE DELETE ON capture_ocr_intents BEGIN SELECT RAISE(ABORT, 'disk failure'); END");
    await assert.rejects(purgeCaptureOwner("a",f.source),/disk failure/);
    assert.equal(f.db.prepare("SELECT COUNT(*) AS count FROM capture_drafts WHERE owner_id='a'").get()?.count,1);
    f.db.exec("DROP TRIGGER fail_erasure"); await purgeCaptureOwner("a",f.source);
    assert.equal(f.db.prepare("SELECT COUNT(*) AS count FROM capture_drafts WHERE owner_id='a'").get()?.count,0);
  } finally { f.db.close(); }
});

test("native capture writers and picker recovery share the retirement fence before account deletion", () => {
  const capture=readFileSync(new URL("./capture-storage.ts",import.meta.url),"utf8");
  const fallback=readFileSync(new URL("./fallback-storage.ts",import.meta.url),"utf8");
  const retirement=readFileSync(new URL("../../features/auth/account-local-retirement.ts",import.meta.url),"utf8");
  assert.match(capture,/createPickerRecoveryStore\(database, withLocalOwnerAccess\)/);
  assert.match(capture,/withLocalOwnerAccess\(owner,.*persistCaptureImageWithLease/);
  assert.match(capture,/withLocalOwnerAccess\(owner,.*restoreCaptureImageWithLease/);
  assert.match(fallback,/withLocalOwnerAccess\(intent.owner/);
  assert.match(retirement,/await purgeRetiredCaptureOwner\(owner\)/);
});
