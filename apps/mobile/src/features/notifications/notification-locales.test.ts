import assert from "node:assert/strict";
import { test } from "node:test";
import { reminderLabel,privateReminderCopy } from "./notification-copy";
import { createBudgetNoticeDelivery } from "./budget-notice-delivery";
import { createAppI18n } from "../../core/i18n/instance";
test("notification labels localize without changing the supplied merchant title",()=>{
 const title="Tiền nhà: Sơn";
 assert.match(reminderLabel("bill",title,"2026-10-24T12:00:00Z","en"),/^Tiền nhà: Sơn · due /);
 assert.equal(reminderLabel("subscription",title,"2026-10-24","en"),"Tiền nhà: Sơn is due for payment soon");
 assert.match(reminderLabel("return",title,"2026-10-24","vi"),/sắp hết hạn đổi trả/);
 assert.match(reminderLabel("warranty",title,"2026-10-24","en"),/warranty ends soon/);
 assert.match(reminderLabel("budget",title,"2026-10-24","en"),/reached its warning threshold/);
});
test("native copy is generic and the requested language is isolated per delivery",async()=>{
 assert.equal(privateReminderCopy("budget","en").title,"Picket · Budget");
 assert.equal(privateReminderCopy("reminder","vi").title,"Picket · Nhắc việc");
 const shown:string[]=[];
 const delivery=createBudgetNoticeDelivery<"vi"|"en">({read:async()=>[],save:async()=>undefined,show:async(owner,_id,_current,language)=>{shown.push(owner+":"+language);}});
 await Promise.all([delivery.deliver("a",["budget:food:2026-10"],()=>true,"en"),delivery.deliver("b",["budget:food:2026-10"],()=>true,"vi")]);
 await delivery.deliver("a",["budget:food:2026-10"],()=>true,"vi");
 assert.deepEqual(shown,["a:en","b:vi"]);
 assert.equal(createAppI18n("en").t("Thông báo",{ns:"notifications"}),"Notifications");
});
