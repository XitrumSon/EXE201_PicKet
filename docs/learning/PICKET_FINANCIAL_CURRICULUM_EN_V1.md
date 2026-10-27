# Picket — Financial education curriculum, English v1

> [Current project status](../PROJECT_STATUS.md). Editorial revision 2, 27 October 2026: 12 fictional self-checks and worked solutions in VI/EN; existing lesson IDs and quiz answer ordering are preserved.

Editorial translation of the full Vietnamese v1 curriculum, authored 2026-10-23. **authored-not-independent-review**. This is not independently approved or publishable content.

Translation locale: `en-US`; translation version: `1`; source locale: `vi-VN`. Lesson IDs intentionally remain identical to the Vietnamese source, including their `.vi.` segment: identify a localized lesson by `(lessonId, locale, version)`, not the ID alone.

`correctIndex` is zero-based. Every choice includes its own explanation. `reviewedAt` means author source/arithmetic review, not independent financial or translation approval. All money remains VND; English does not imply conversion to USD.

## Publication gates

- Independent financial-content review
- Vietnamese-context legal/safety review for borrowing and digital safety
- Independent English translation and terminology review against the Vietnamese source
- Accessibility and pilot comprehension review
- Android large-font/TalkBack/offline checks

The source curriculum was designed for adults and the Vietnamese context. No foreign legal right, cancellation period, regulatory approval or educational effectiveness is asserted. Timing and comprehension need learner testing.

## picket.vi.financial.v1.01 — Moving money between wallets is not another expense

**Chapter:** chapter-01 · **Competency:** cashflow.internal-transfer  
**Objective:** Distinguish transfers between your own wallets from income and spending; explain the scope being viewed.  
**Status:** authored-not-independent-review · locale: en-US · translationVersion: 1

Your money may be held in several places: cash, a bank account or an electronic wallet. Moving money between places you own changes where you keep it. To understand how much you have spent, ask whether money has left the entire scope you are tracking to pay for something. The name of a bank app's transfer button is not enough to answer this: transferring to a shop is a payment, while transferring to another account of your own may be a wallet transfer.

Consider an illustrative example. Hòa has 600,000 VND in cash and 1,400,000 VND in the bank. Hòa withdraws 200,000 VND without a fee. Cash becomes 800,000 VND and the bank balance becomes 1,200,000 VND. The total is 2,000,000 VND both before and after. Recording the withdrawal as spending, then recording purchases paid in cash, would count spending twice. If the bank charges a further 3,000 VND withdrawal fee, only that 3,000 VND fee is spending in this example; the 200,000 VND has merely changed location.

Scope explains the apparent contradiction. Looking only at the bank wallet, 200,000 VND has indeed left it. Looking at both wallets, the outgoing and incoming sides cancel. A wallet cash-flow report can therefore differ from an overall spending report. You do not need to decide that one is wrong; read its label and check which wallets it includes. A wallet outside the scope also needs a clear note rather than an assumption that every outflow is a purchase.

In Picket, check the source wallet, destination wallet, amount and fee before confirming. Giving money a savings-goal label does not make it disappear either. One real transfer should be recorded once, with linked sides. If you entered separate income and expense records by mistake, check before editing so you do not delete a real purchase made on the same day. You can learn entirely with the example numbers; no real withdrawal or transfer is required to demonstrate understanding. The key is that the same money can move while the total stays unchanged.

### Worked example

600,000 + 1,400,000 = 2,000,000 VND; after the transfer: 800,000 + 1,200,000 = 2,000,000 VND. A 3,000 VND fee, if charged, leaves a total of 1,997,000 VND.

#### Remember

- Identify which wallets are inside the report before adding their balances.
- Moving money between your own wallets changes its location; record any fee separately.
- Check both sides so a cash withdrawal is not counted again as spending.

#### Common misconception

Assuming every amount leaving a bank account is money already spent.

#### Self-check — fictional scenario

An has 900,000 VND in a bank account and 100,000 VND in cash. An withdraws 150,000 VND and pays a separate 5,000 VND fee. Find both balances, the total and the actual expense.

#### Step-by-step reasoning

1. The bank balance becomes 900,000 − 150,000 − 5,000 = 745,000 VND.
2. Cash increases to 100,000 + 150,000 = 250,000 VND.
3. The combined total is 995,000 VND; only the 5,000 VND fee leaves the two-wallet scope.

#### Conclusion

The transfer is 150,000 VND and the expense is 5,000 VND. Do not classify all 155,000 VND as overall spending.

- `600000+1400000 = 2000000`
- `600000+200000 = 800000`
- `1400000-200000 = 1200000`
- `2000000-3000 = 1997000`
- `900000-150000-5000 = 745000`
- `100000+150000 = 250000`
- `745000+250000 = 995000`

### Practice scenarios

**1. You withdraw 200,000 VND without a fee from your bank into your own cash wallet. How much does overall spending increase?**

- A. 200,000 VND — This money has changed location; it has not paid for a purchase.
- B. 0 VND — Correct: the total across both wallets does not decrease.
- C. 400,000 VND — Adding both sides counts the same money twice.
Answer: **B** (`correctIndex: 1`).

**2. Looking only at the bank wallet in the example, has 200,000 VND left that scope?**

- A. No, because wallet transfers always equal zero — The zero-total rule requires both sides to be inside the scope.
- B. Yes, but it is not overall spending — Correct: the bank decreases while cash increases.
- C. It is new income — The bank decreases, so there is no new income.
Answer: **B** (`correctIndex: 1`).

**3. You withdraw 200,000 VND and pay an additional 3,000 VND fee. What is the spending caused by this operation?**

- A. 203,000 VND — 203,000 VND leaves the bank, but includes money moving into cash.
- B. 200,000 VND — You still own the 200,000 VND.
- C. 3,000 VND — Correct: the fee is the part leaving your total assets in this situation.
Answer: **C** (`correctIndex: 2`).

### Optional action

Review an existing wallet transfer or solve the example again; do not make a real transfer. You may skip. No spending, financial-product signup, OTP or submission to AI is required.

### Sources

- [Primary reference](https://www.oecd.org/content/dam/oecd/en/publications/reports/2022/01/financial-competence-framework-for-adults-in-the-european-union_614b8b97/510f133c-en.pdf)

## picket.vi.financial.v1.02 — Check records before categorizing them

**Chapter:** chapter-01 · **Competency:** cashflow.confirmed-records  
**Objective:** Check amounts and income/expense direction, prevent duplicate records and distinguish missing data from zero spending.  
**Status:** authored-not-independent-review · locale: en-US · translationVersion: 1

A useful transaction list should reflect what actually happened. Start with the date, amount, wallet and whether money came in or went out. Categories help you find and compare records, but an attractive category name cannot fix a wrong amount. When scanning a receipt, treat the result as a draft to check. A machine may misread separators, the total line or cash tendered by the customer. A landscape photograph is not evidence of a transaction; do not guess an amount from it.

Mai has checked three expenses: lunch at 45,000 VND, transport at 25,000 VND and notebooks at 30,000 VND. They total 100,000 VND. Mai attaches the lunch receipt to that existing transaction; the total remains 100,000 VND, not 145,000 VND. If the photo uploads slowly, a photo-processing status is different from a saved-transaction status. On returning, check which record already exists before saving again. An attachment and an expense are different kinds of information, not two amounts of money.

Categorization should serve your question. A notebook for school may belong under education; the same notebook bought for someone else may be a gift. Do not infer its purpose solely from the shop's name. You can leave an unclear expense for later review and add context when you remember it. When several people share a payment, record your share or use a consistent split rule. Avoid sometimes recording the whole bill and sometimes just your portion without a note.

At the end of a period, compare the list with balances or evidence you still have. If you forgot two days of entries, mark the gap instead of declaring zero spending on those days. An unexplained difference does not automatically become income. It is fine to acknowledge incomplete data and review it when convenient. In Picket, use only confirmed transactions for lessons based on real data; choose an illustrative example if you prefer not to use personal information. Recording should make decisions clearer, rather than produce a perfect table or require you to remember every detail immediately.

### Worked example

45,000 + 25,000 + 30,000 = 100,000 VND; attaching the lunch photo does not create a second 45,000 VND expense.

#### Remember

- Record amount, date, wallet and transaction direction before choosing a category.
- An attached receipt image is not an additional expense.
- A day with missing records is incomplete; it does not automatically mean zero spending.

#### Common misconception

Treating a rescan or screen refresh as a reason to create an identical transaction.

#### Self-check — fictional scenario

Bình recorded lunch costing 40,000 VND and transport costing 30,000 VND. Rescanning the lunch receipt creates a 40,000 VND draft. What is the actual total, and what should be checked before saving?

#### Step-by-step reasoning

1. Add the two known purchases: 40,000 + 30,000 = 70,000 VND.
2. Compare the draft date, amount and wallet with the recorded lunch transaction.
3. If it is the same payment, do not save another transaction; two genuine purchases need distinguishing evidence.

#### Conclusion

The stated total is 70,000 VND. Another image or draft alone does not increase it to 110,000 VND.

- `45000+25000+30000 = 100000`
- `100000+45000 = 145000`
- `40000+30000 = 70000`
- `70000+40000 = 110000`

### Practice scenarios

**1. Mai adds a photo to the lunch transaction already saved. What should the total of the three expenses be?**

- A. 100,000 VND — Correct: an attachment does not create additional spending.
- B. 145,000 VND — You have counted lunch twice.
- C. 55,000 VND — You have removed an actual expense.
Answer: **A** (`correctIndex: 0`).

**2. Tuesday has no record because Mai forgot to enter it. What is the appropriate conclusion?**

- A. There was definitely no spending — Missing entries do not prove nothing happened.
- B. We do not yet know whether there was spending — Correct: keep the insufficient-data state.
- C. Use the highest daily amount that month as a factual entry — An estimate must not become a transaction claimed to have happened.
Answer: **B** (`correctIndex: 1`).

**3. OCR reads 450,000 VND, but the receipt says 45,000 VND. What should you do?**

- A. Keep the machine result because it is objective — OCR can still misread characters.
- B. Save both numbers as separate expenses — Two interpretations of one purchase do not create two expenses.
- C. Check the receipt and correct the draft before confirming — Correct: the draft amount must be checked.
Answer: **C** (`correctIndex: 2`).

### Optional action

Check one transaction or example for its date, wallet, amount and possible duplication. You may skip. No spending, financial-product signup, OTP or submission to AI is required.

### Sources

- [Primary reference](https://files.consumerfinance.gov/f/documents/cfpb_your-money-your-goals_spending_tracker_2018-11_ADA.pdf)

## picket.vi.financial.v1.03 — Needs and wants depend on context

**Chapter:** chapter-02 · **Competency:** planning.contextual-priorities  
**Objective:** Explain a priority using circumstances, timing and alternatives, without judging from an item name.  
**Status:** authored-not-independent-review · locale: en-US · translationVersion: 1

Needs often relate to daily living, health, education or responsibilities you must meet. Wants tend to have more flexibility. The boundary depends on context, not a fixed label attached to an item. Internet access may support online classes or be an extra entertainment service. A ride-hailing trip may help an injured person travel safely. This lesson therefore does not judge someone as good or bad from a purchase, or require giving up every source of enjoyment.

Try three questions: what happens if I postpone it, when must the need be met, and is there another suitable option? A cheaper option is an alternative only when it actually meets the need. Walking cannot always replace transport on a rainy night or an unsafe route. A cheaper service is not useful if it lacks a feature required for work. A purchase may contain both an essential part and an upgrade; you can explain that distinction rather than choose one label for everything.

In an imaginary situation, Phương has 1,500,000 VND left before the next income payment. Phương plans to keep 900,000 VND for housing and 400,000 VND for food, leaving 200,000 VND. New headphones priced at 350,000 VND would exceed that remainder by 150,000 VND unless something else changes. The calculation does not call Phương undisciplined; it identifies a need to postpone, choose another option or confirm another source of money. If the old headphones are broken and immediately needed for work, the context changes, but the shortfall still needs addressing.

You may choose a flexible allowance for interests that fits your circumstances. No single budget percentage suits everybody. Someone supporting family or facing high health costs may have fewer choices; calling this a personal weakness does not create money. In Picket, priority labels support reflection; they do not block saving a transaction or decide for you. When context is missing, asking for more information is a good answer. Try writing a brief reason for your choice. You can change that reason as responsibilities, health or timing change.

### Worked example

1,500,000 − 900,000 − 400,000 = 200,000 VND; 350,000 − 200,000 = a 150,000 VND shortfall for this choice.

#### Remember

- Classify needs and wants using purpose, circumstances and timing.
- One item can serve several purposes; a merchant name alone is not enough.
- Compare options with the stated resources and priorities rather than judging a person by a category.

#### Common misconception

Assuming a product is always a want for everyone.

#### Self-check — fictional scenario

Chi has 150,000 VND. A 100,000 VND connection plan is needed for an online exam tomorrow; a 60,000 VND entertainment plan can wait until next week. Suggest an affordable option and explain the context.

#### Step-by-step reasoning

1. In this case, the exam connection has a specific deadline and is difficult to postpone.
2. After paying for that connection, Chi has 150,000 − 100,000 = 50,000 VND left.
3. Both plans cost 160,000 VND, exceeding the available money by 10,000 VND; entertainment can wait without assuming new income.

#### Conclusion

One option supported by the facts is to buy the exam connection and postpone entertainment. This is not a universal ban on entertainment.

- `1500000-900000-400000 = 200000`
- `350000-200000 = 150000`
- `150000-100000 = 50000`
- `100000+60000 = 160000`
- `160000-150000 = 10000`

### Practice scenarios

**1. Is a ride-hailing transaction enough to conclude that the trip was a want?**

- A. Yes, ride-hailing is always unnecessary — A fixed label ignores health and circumstances.
- B. No, context and safe alternatives are needed — Correct: the same service can serve different purposes.
- C. Yes, because it costs more than a bus — A lower price does not guarantee a suitable alternative.
Answer: **B** (`correctIndex: 1`).

**2. Phương keeps both planned allocations unchanged. How much is missing for the 350,000 VND headphones?**

- A. 150,000 VND — Correct: the 350,000 VND price minus the 200,000 VND remainder.
- B. 200,000 VND — 200,000 VND is what remains before buying.
- C. 350,000 VND — There is already 200,000 VND, so the entire price is not missing.
Answer: **A** (`correctIndex: 0`).

**3. The headphones are broken and needed for work. What is most reasonable?**

- A. Calling them a need creates more money — A label does not change the balance.
- B. Ignore every upcoming obligation — The consequences of obligations still exist.
- C. Consider options that meet the work need and recalculate the shortfall — Correct: consider both context and ability to pay.
Answer: **C** (`correctIndex: 2`).

### Optional action

Choose an example or existing expense and explain why it could be postponed or needs priority. You may skip. No spending, financial-product signup, OTP or submission to AI is required.

### Sources

- [Primary reference](https://files.consumerfinance.gov/f/documents/cfpb_your-money-your-goals_prioritizing-bills_tool.pdf)

## picket.vi.financial.v1.04 — Plan around the dates money arrives

**Chapter:** chapter-02 · **Competency:** planning.irregular-income  
**Objective:** Build an income-and-expense calendar using due dates and separate uncertain income.  
**Status:** authored-not-independent-review · locale: en-US · translationVersion: 1

A monthly income total does not tell the whole story. Money arriving after rent is due cannot pay it on the day before arrival. Freelancers, small sellers and people receiving support in installments may need to plan around each incoming payment. Begin with money available now, then add income whose date and amount are confirmed. Money merely promised or dependent on unfinished work belongs separately as an assumption, rather than being treated as already in the wallet.

Nam has 1,200,000 VND at the start of the week. Rent of 800,000 VND is due on Wednesday, and food is expected to require 300,000 VND on Friday. A customer has promised 1,000,000 VND on Sunday but has not confirmed it. Before that income, Nam has only 100,000 VND left after the two expenses. An additional 200,000 VND cost on Saturday creates a 100,000 VND shortfall in the scenario with no further income. Placing the promised payment at the start of the week would hide this gap, even though the end-of-week total might appear positive.

A budget in this situation can have a confirmed part and a part conditional on money actually received. Do not divide your best annual income across weeks and assume every week will deliver that amount. Looking across periods can reveal variability, but an average is not a guarantee. If income falls short, review flexible expenses and proactively ask payees about options that really exist. Do not assume a later due date has been agreed. Nor should you omit food or health needs just to make the table look balanced.

In Picket, reviewing the days before the next income payment can help you choose a more suitable limit than a general monthly label. Mark and reconcile paid bills so they are not subtracted again. If the plan needs revision, revise future assumptions; transactions that already happened retain their actual dates. You do not need to disclose your salary to study this lesson: use Nam's example. A useful outcome is knowing which date needs attention, what is confirmed and what must be verified, rather than making irregular income look regular on screen.

### Worked example

1,200,000 − 800,000 − 300,000 = 100,000 VND; an additional 200,000 VND expense before income arrives produces −100,000 VND.

#### Remember

- Place income and obligations on a timeline rather than relying only on monthly totals.
- Money expected after a due date does not remove the earlier shortfall.
- Change a real schedule only after the external change is confirmed.

#### Common misconception

Believing a positive month-end balance means every earlier payment is affordable.

#### Self-check — fictional scenario

Dũng has 150,000 VND on day 5. A 200,000 VND bill is due on day 7, while 500,000 VND of income is expected on day 10. With no other flows, identify the shortfall and what still needs verification.

#### Step-by-step reasoning

1. Before the income, the day-7 calculation is 150,000 − 200,000 = −50,000 VND.
2. If the income arrives on day 10, the later calculation is −50,000 + 500,000 = 450,000 VND.
3. A positive ending value does not remove the earlier gap; verify the income date and any actual arrangement with the relevant party.

#### Conclusion

The day-7 shortfall is 50,000 VND. A Picket schedule makes it visible; it does not move a due date or create money.

- `1200000-800000-300000 = 100000`
- `100000-200000 = -100000`
- `150000-200000 = -50000`
- `-50000+500000 = 450000`

### Practice scenarios

**1. The customer has not confirmed the 1,000,000 VND Sunday payment. How should it be represented?**

- A. Cash already available on Monday — This incorrectly changes both timing and certainty.
- B. Assumed income, separate from the actual balance — Correct: compare scenarios with and without receipt.
- C. Guaranteed weekly income — One promise does not establish a recurring schedule.
Answer: **B** (`correctIndex: 1`).

**2. Before Sunday, Nam spends another 200,000 VND after the two obligations. What is the scenario balance?**

- A. 900,000 VND — This assumes the customer money has already arrived.
- B. 100,000 VND — 100,000 VND was the balance before the extra expense.
- C. Negative 100,000 VND — Correct: 100,000 VND minus 200,000 VND.
Answer: **C** (`correctIndex: 2`).

**3. Monthly income exceeds monthly expenses, yet there is a mid-month shortfall. Why?**

- A. Income may arrive after payments are needed — Correct: timing matters alongside period totals.
- B. Addition does not work for money — Addition still works; the timeline is also needed.
- C. Changing categories is enough to create money — Changing labels does not create money.
Answer: **A** (`correctIndex: 0`).

### Optional action

Review or write down three upcoming payments and the next income date using illustrative data. You may skip. No spending, financial-product signup, OTP or submission to AI is required.

### Sources

- [Primary reference](https://files.consumerfinance.gov/f/documents/cfpb_your-money-your-goals_cash_flow_budget_tool_2018-11_ADA.pdf)
- [Primary reference](https://files.consumerfinance.gov/f/documents/cfpb_your-money-your-goals_income_benefits_tool_2018-11_ADA.pdf)

## picket.vi.financial.v1.05 — Emergency funds differ from known future costs

**Chapter:** chapter-03 · **Competency:** resilience.emergency-vs-planned  
**Objective:** Distinguish unexpected events from scheduled costs and choose a reserve goal suited to your circumstances.  
**Status:** authored-not-independent-review · locale: en-US · translationVersion: 1

Emergency money gives you more options when something unexpected happens, such as essential equipment breaking or income being interrupted. Money for a known cost, such as next term's tuition or an annual renewal, serves a different purpose: preparation for a schedule. Both are useful. Distinguishing them helps avoid feeling that you constantly face emergencies when an annual bill simply was not planned. There is no need for blame when allocated money must be used; look at what actually happened.

Dung has 2,000,000 VND, including 1,200,000 VND allocated to tuition and 800,000 VND to emergencies. Tuition of 1,200,000 VND becomes due; paying it leaves 800,000 VND. If essential study equipment then unexpectedly needs a 500,000 VND repair, 300,000 VND remains. Under this allocation, tuition was not a withdrawal from the emergency reserve. The reserve is not extra money beyond the 2,000,000 VND either; it is part of the existing total. Labeling the same money as belonging to two funds does not let it pay twice.

A suitable reserve depends on needs, dependants, income stability and support you can actually access. A modest starting goal may be more manageable than a large target that makes you give up. This lesson does not require everybody to hold the same number of months of expenses, or promise that reaching a number protects against every disruption. If nothing remains after basic needs, acknowledge that limit. You do not need to borrow simply to create a balance labeled as an emergency fund.

Consider keeping money somewhere whose fees, withdrawal access and availability when needed you understand, rather than chasing a promised return. Do not put all money needed soon into something you do not understand or cannot access in time. In Picket, review goal labels and balances separately to avoid confusion. After using a reserve, rebuild the plan when circumstances allow; do not punish yourself by dropping essential costs. A learning step can simply be listing known costs and unexpected events, without depositing money or buying a financial product.

### Worked example

2,000,000 − 1,200,000 = 800,000 VND; 800,000 − 500,000 = 300,000 VND.

#### Remember

- Separate known future costs from unexpected expenses.
- An appropriate reserve depends on circumstances; the examples are not mandatory targets.
- An earmark helps tracking but does not move money or guarantee a balance.

#### Common misconception

Treating every large cost as an emergency, or treating a reserve label as new money.

#### Self-check — fictional scenario

Hà expects a 240,000 VND vehicle service in 4 weeks. A separate unexpected-expense reserve held 90,000 VND before an unplanned repair used 40,000 VND. Separate the purposes and calculate the remaining amounts.

#### Step-by-step reasoning

1. The known service cost gives an even target of 240,000 ÷ 4 = 60,000 VND per week under the stated assumption.
2. The unexpected repair leaves 90,000 − 40,000 = 50,000 VND in the reserve.
3. The purposes differ; neither label creates income, and contributions should not be forced beyond actual capacity.

#### Conclusion

The service target is 60,000 VND weekly if feasible, and the unexpected-expense reserve has 50,000 VND left. Adjust the plan when real income changes.

- `2000000-1200000 = 800000`
- `800000-500000 = 300000`
- `240000/4 = 60000`
- `90000-40000 = 50000`

### Practice scenarios

**1. Tuition has a clear date next term. How is it classified in this lesson?**

- A. An unforeseeable emergency — A known date and amount can be planned.
- B. A scheduled cost to prepare for — Correct: it differs from an unexpected event.
- C. New income — It is money to pay, not money coming in.
Answer: **B** (`correctIndex: 1`).

**2. Dung pays tuition and repairs the equipment as in the example. How much remains?**

- A. 300,000 VND — Correct: both actual expenses have been deducted.
- B. 800,000 VND — This was the balance before the repair.
- C. 1,500,000 VND — This calculation omitted tuition.
Answer: **A** (`correctIndex: 0`).

**3. Nothing remains after basic needs. What is the most suitable response?**

- A. Borrow to make a fund label look good — Borrowing adds an obligation; it does not automatically create safety.
- B. Treat yourself as a failure — Limited resources are not a judgment of character.
- C. Acknowledge the constraint and revisit the goal when circumstances change — Correct: goals should fit real circumstances.
Answer: **C** (`correctIndex: 2`).

### Optional action

Separate two examples into scheduled costs and unexpected events; no money transfer is required. You may skip. No spending, financial-product signup, OTP or submission to AI is required.

### Sources

- [Primary reference](https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/)

## picket.vi.financial.v1.06 — Break a goal into adjustable steps

**Chapter:** chapter-03 · **Competency:** saving.realistic-goal  
**Objective:** Calculate what is still needed and an amount per period; adjust the deadline when circumstances change.  
**Status:** authored-not-independent-review · locale: en-US · translationVersion: 1

A clear goal often has an amount, a reason and a date you would like to reach it. It remains an adjustable plan. If prices change or income falls, revising a deadline does not erase the steps already taken. Before calculating, check how much money is genuinely allocated to this goal. Money reserved for rent should not simultaneously count toward buying a computer, unless you deliberately reallocate it and understand the consequences for rent.

Tú wants to set aside 3,000,000 VND for a course after six income periods. There is already 600,000 VND allocated to it. The remaining amount is 2,400,000 VND, or 400,000 VND in each of six equal periods. This division explains the pace; it is not a command to contribute regardless of circumstances. If only 300,000 VND per period is feasible, it takes eight periods to cover the remainder, assuming unchanged prices and no interest. Do not add uncertain future returns merely to make the deadline appear achievable.

When another need takes priority in a period, recalculate using the money actually available. Avoid adding both an intended contribution and the contribution already transferred. Moving money into your own savings wallet is still a wallet transfer across the total scope; a goal expresses what you intend to use it for. If you update a progress bar without corresponding money, distinguish a plan from a data adjustment. A full bar does not prove you can pay when other expenses need the same balance.

In Picket, practice can mean reviewing an existing goal or just solving the example. You do not need to open a real savings product to finish, or prove progress with an account screenshot. An optional reminder may help you revisit a plan, but skipping it does not remove what you have learned. When comparing options, identify what changes: the time, the amount per period or the goal's scope. Avoid concluding that faster completion means better money management; people have different resources and responsibilities. A small step helps when you understand it and can still meet important current needs.

### Worked example

(3,000,000 − 600,000) / 6 = 400,000 VND per period; 2,400,000 / 300,000 = 8 periods.

#### Remember

- Describe a goal using the remaining amount and a reviewable deadline.
- Recalculate from actual progress when income or priorities change.
- Changing the deadline or goal size is an option, not a personal failure.

#### Common misconception

Insisting on an old contribution even when it would leave essential costs uncovered.

#### Self-check — fictional scenario

Khoa wants 900,000 VND, already has 300,000 VND and planned to add 100,000 VND weekly for 6 weeks. The first two contributions were 100,000 and 40,000 VND. With 4 weeks left, only 80,000 VND per week is affordable. Does the old plan still fit?

#### Step-by-step reasoning

1. After two weeks, the amount held is 300,000 + 100,000 + 40,000 = 440,000 VND.
2. The remaining 460,000 VND would require 115,000 VND each week over the next 4 weeks.
3. That exceeds the stated 80,000 VND capacity; consider a later date, smaller goal or another feasible option instead of inventing the difference.

#### Conclusion

The original plan no longer fits. Six more weeks at 80,000 VND would add 480,000 VND before other costs; that is a scenario to consider, not a promise.

- `3000000-600000 = 2400000`
- `2400000/6 = 400000`
- `2400000/300000 = 8`
- `300000+100000+40000 = 440000`
- `900000-440000 = 460000`
- `460000/4 = 115000`
- `6*80000 = 480000`

### Practice scenarios

**1. Tú has 600,000 VND toward a 3,000,000 VND goal. How much is still needed?**

- A. 3,600,000 VND — This adds rather than subtracts what is already available.
- B. 2,400,000 VND — Correct: target minus the money actually allocated.
- C. 600,000 VND — This is what is available, not what is missing.
Answer: **B** (`correctIndex: 1`).

**2. Only 300,000 VND per period can be set aside for the remainder. How many periods are needed under the lesson assumptions?**

- A. 6 — Six periods produce only 1,800,000 VND.
- B. 10 — Ten periods divides the whole target and ignores the existing 600,000 VND.
- C. 8 — Correct: 2,400,000 divided by 300,000 is eight.
Answer: **C** (`correctIndex: 2`).

**3. One period requires spending on medicine. What should happen to the goal?**

- A. Update the actual amount and recalculate the deadline — Correct: a plan serves your circumstances, not the reverse.
- B. Keep fictional progress because it looks better — Progress that does not match money makes later decisions harder.
- C. Skip medicine to preserve progress — Health needs should not be displaced by progress points.
Answer: **A** (`correctIndex: 0`).

### Optional action

Write a fictional goal with money already allocated, the remaining amount and two deadline options. You may skip. No spending, financial-product signup, OTP or submission to AI is required.

### Sources

- [Primary reference](https://files.consumerfinance.gov/f/documents/cfpb_your-money-your-goals_savings_plan_tool_2018-11_ADA.pdf)
- [Primary reference](https://files.consumerfinance.gov/f/documents/cfpb_your-money-your-goals_SMART-goals_tool_2018-11.pdf)

## picket.vi.financial.v1.07 — A balance is not automatically money available to allocate

**Chapter:** chapter-04 · **Competency:** forecast.obligations-and-scope  
**Objective:** Separate the current balance, future obligations and a reserve when interpreting a scenario.  
**Status:** authored-not-independent-review · locale: en-US · translationVersion: 1

A balance tells you how much money you have within the scope being viewed. It does not automatically tell you how much can be allocated to a new decision. Some upcoming payments have not yet left the wallet. You may also want to keep part of the money for surprises. When reading a number, look for its date, included wallets and expenses already included or still outstanding. If a foreign-currency wallet has no suitable exchange rate, do not add its numeric amount directly to VND.

Vy has 4,000,000 VND in the VND wallets under consideration. Before the next income payment, Vy has confirmed rent of 1,500,000 VND and expected food costs of 700,000 VND. Vy wants to retain 500,000 VND as a reserve. Given these exact inputs, the remainder after obligations and the reserve is 1,300,000 VND. This does not say the bank balance has already fallen to 1,300,000 VND. It distinguishes current money from the portion being considered for a new decision. The reserve is an allocation within the same balance, not spending already completed.

If rent has already been paid and that transaction has already reduced the 4,000,000 VND balance, do not subtract it again. Reconcile the bill's status and the payment record before reviewing the schedule. Likewise, an unconfirmed receipt photo should not automatically create another obligation in addition to an existing record. Moving money between two wallets in scope does not increase the total available to allocate. These rules prevent overly optimistic or pessimistic reports caused by counting something more than once.

The 1,300,000 VND still depends on whether the list is complete. Vy might have omitted transport or have uncertain income. Treat the result as conditional, with things still to check. In Picket, when a schedule is unconfirmed, it is better to acknowledge insufficient data than declare that you are allowed to spend a particular amount. You can change assumptions and view results, but the app does not decide for you. Practice means checking whether one obligation has been paid; it does not require giving bank account information to a new service.

### Worked example

4,000,000 − 1,500,000 − 700,000 − 500,000 = 1,300,000 VND under the stated inputs.

#### Remember

- Distinguish the displayed balance from money already planned for obligations and essentials.
- Use the same wallet scope and currency when calculating unallocated money.
- Mark paid obligations so they are not subtracted a second time.

#### Common misconception

Assuming the entire displayed balance is available for a new purchase.

#### Self-check — fictional scenario

Lan has 1,200,000 VND in the selected wallets. Before the next income, Lan has allocated 800,000 VND to rent, 250,000 VND to living costs and 100,000 VND to a chosen reserve. Under these assumptions, what remains unallocated?

#### Step-by-step reasoning

1. The planned allocations total 800,000 + 250,000 + 100,000 = 1,150,000 VND.
2. The stated unallocated amount is 1,200,000 − 1,150,000 = 50,000 VND.
3. Check what is paid, missing or outside the scope; this calculation is not a certain assessment of a real person’s affordability.

#### Conclusion

There is 50,000 VND unallocated in this example. A 1,200,000 VND balance does not mean that the full amount is free to spend.

- `4000000-1500000-700000-500000 = 1300000`
- `800000+250000+100000 = 1150000`
- `1200000-1150000 = 50000`

### Practice scenarios

**1. What does 1,300,000 VND mean in the example?**

- A. The certain bank balance right now — The bank has not automatically deducted future expenses and the reserve allocation.
- B. A conditional remainder after the stated allocations — Correct: retain the assumptions and scope when reading the number.
- C. Money just created by the app — Calculation does not create money.
Answer: **B** (`correctIndex: 1`).

**2. Rent already appears in a transaction deducted from the current balance. What happens if the bill is subtracted again?**

- A. The obligation is counted twice — Correct: reconcile the payment status.
- B. Accuracy improves — Double subtraction makes the projection incorrectly low.
- C. New income is created — There is no new source of income.
Answer: **A** (`correctIndex: 0`).

**3. There is a 100 USD wallet and a 4,000,000 VND wallet, but no exchange rate. What should you do?**

- A. Add them as 4,000,100 VND — Different units cannot be added directly.
- B. Treat USD as zero without explaining — Silent omission misrepresents the scope.
- C. Show them separately and state that cross-currency aggregation is unavailable — Correct: the limit must be visible.
Answer: **C** (`correctIndex: 2`).

### Optional action

Review an upcoming payment or example and mark paid/unpaid; do not create a real payment. You may skip. No spending, financial-product signup, OTP or submission to AI is required.

### Sources

- [Primary reference](https://files.consumerfinance.gov/f/documents/cfpb_your-money-your-goals_bill_calendar_tool_2018-11_ADA.pdf)

## picket.vi.financial.v1.08 — Scenarios ask questions; they do not predict with certainty

**Chapter:** chapter-04 · **Competency:** forecast.scenario-and-coverage  
**Objective:** Compare two scenarios using consistent assumptions and explain why missing data prevents confident forecasting.  
**Status:** authored-not-independent-review · locale: en-US · translationVersion: 1

A scenario asks how money changes if specified things happen. A forecast tries to estimate what may happen using particular data and a method. Both have limits, but the terms should not be interchangeable merely to sound certain. Entering the price of something you might buy and viewing the difference is first a conditional calculation. It proves neither that you will buy it nor that every other future income and expense is known.

An has 2,000,000 VND. Over seven days, An confirms income of 1,000,000 VND and obligations of 1,500,000 VND. With no other transactions, the closing balance is 1,500,000 VND. Buying an item for 600,000 VND during the period, with everything else unchanged, leaves 900,000 VND. The difference is 600,000 VND. This does not assert that An will have exactly 900,000 VND next week. If income arrives late or expenses are missing, reality differs. Daily balances also matter, not just the final day.

Sparse records can create a misleading story. Three days without entries do not mean three days of zero spending. Tracking only one wallet also leaves other wallets unknown. A complex model cannot turn those gaps into facts by itself. Useful responses include asking how complete records are, showing the last synchronization time and allowing known schedules to be corrected. Low and high numbers produced by changing assumptions are scenarios; do not call them validated confidence probabilities without appropriate measurement and calibration.

In Picket, trying a choice should not create an actual transaction or edit a real budget. Use the appropriate recording flow only when you actively confirm something that happened. With limited history, illustrative data can still explain the calculation without inventing a date when money will run out. You can defer a conclusion and add inputs later. Good practice is to state the condition before the result: if the schedule is correct and nothing else occurs, what remains? That sentence helps you test a decision and identify what is still unknown.

### Worked example

Without purchase: 2,000,000 + 1,000,000 − 1,500,000 = 1,500,000 VND. With purchase: 1,500,000 − 600,000 = 900,000 VND.

#### Remember

- Separate confirmed facts from assumptions when building a scenario.
- Compare options over the same time window, wallet scope and currency.
- A simulated result is neither a promise nor an executed transaction.

#### Common misconception

Choosing the most optimistic scenario and treating uncertain income as money already held.

#### Self-check — fictional scenario

Minh has 400,000 VND and a confirmed upcoming 150,000 VND payment. Minh is considering a 300,000 VND item and might receive another 200,000 VND at an uncertain time. Compare the purchase without and with that assumed income.

#### Step-by-step reasoning

1. After the confirmed payment, the facts give 400,000 − 150,000 = 250,000 VND.
2. Buying before any extra income gives a scenario balance of 250,000 − 300,000 = −50,000 VND.
3. Assuming 200,000 VND arrives in time gives 150,000 VND; label that assumption rather than removing the base-case warning.

#### Conclusion

The base case has a 50,000 VND shortfall if the item is bought. The 150,000 VND result belongs only to the timely-income scenario and is not guaranteed.

- `2000000+1000000-1500000 = 1500000`
- `1500000-600000 = 900000`
- `1500000-900000 = 600000`
- `400000-150000 = 250000`
- `250000-300000 = -50000`
- `-50000+200000 = 150000`

### Practice scenarios

**1. Two options differ only by a 600,000 VND purchase. What is the closing-balance difference?**

- A. 600,000 VND — Correct: all other assumptions remain unchanged.
- B. 900,000 VND — This is the remainder in the purchase option.
- C. 1,500,000 VND — This is the remainder without the purchase.
Answer: **A** (`correctIndex: 0`).

**2. Three days have no entries. Can spending be concluded to be zero?**

- A. Yes, because the chart is blank — A blank chart may mean records are missing.
- B. Not yet — Correct: recording coverage needs to be understood.
- C. Yes, if AI sounds confident — Confident wording is not evidence.
Answer: **B** (`correctIndex: 1`).

**3. What should changing a price on a scenario screen do to actual transactions?**

- A. Automatically create an expense — Trying an option is not an actual purchase.
- B. Edit the budget to fit the result — Silent changes undermine the plan.
- C. Leave them unchanged; simulate until a separate confirmation action — Correct: simulation and factual recording are separate steps.
Answer: **C** (`correctIndex: 2`).

### Optional action

Solve two illustrative scenarios and name one thing that could change the result. You may skip. No spending, financial-product signup, OTP or submission to AI is required.

### Sources

- [Primary reference](https://files.consumerfinance.gov/f/documents/cfbp_your-money-your-goals_adjust_cash_flow_tool_2018-11_ADA.pdf)
- [Primary reference](https://www.oecd.org/content/dam/oecd/en/publications/reports/2022/01/financial-competence-framework-for-adults-in-the-european-union_614b8b97/510f133c-en.pdf)

## picket.vi.financial.v1.09 — Look beyond a small installment to total cost

**Chapter:** chapter-05 · **Competency:** borrowing.total-cost  
**Objective:** Calculate total payments including fees; distinguish an advertised rate from the full cost in the example.  
**Status:** authored-not-independent-review · locale: en-US · translationVersion: 1

A loan involves more than principal. Understand the money actually received, payment schedule, interest and any fees that may arise. A small installment does not by itself prove a loan is cheaper. To compare choices, understand the usable amount, number of payments, dates and conditions. If information is missing, the appropriate answer may be that comparison is not yet possible, rather than choosing the lowest percentage on an advertisement.

In fictional contract A, Linh receives 3,000,000 VND and makes three payments of 1,080,000 VND. There is also a 60,000 VND fee paid separately at the start. Total payments are 3,300,000 VND, or 300,000 VND above the amount received. Fictional contract B also provides the full 3,000,000 VND, requires three payments of 1,110,000 VND and has no other fees: the total is 3,330,000 VND. Under those exact conditions, A costs 30,000 VND less in total payments. This is arithmetic, not a lender recommendation or a conclusion about the legality of any product.

Check whether a fee is deducted from the initial proceeds or paid separately. The usable amount may differ even when both are called a 3,000,000 VND loan. Also check late fees, early-repayment conditions and bundled services. Do not infer an annual rate through simple division when payment dates and outstanding principal change across periods. Nor should a foreign financial indicator be attached to a calculation that does not meet its definition. Here we calculate only the total amounts explicitly stated.

For a real decision, you need contract information applicable in Vietnam and may consult an appropriately qualified person about unclear terms. The international sources support thinking about costs; they do not replace Vietnamese law or create legal rights or deadlines here. You do not need to enter an actual loan or apply to complete the lesson. In Picket, distinguish simulations from existing obligations and record a real schedule only after checking. If pressured to sign with unanswered questions, pausing to verify helps preserve your choice.

### Worked example

A: 3 × 1,080,000 + 60,000 = 3,300,000 VND, with a cost of 300,000 VND. B: 3 × 1,110,000 = 3,330,000 VND; difference: 30,000 VND.

#### Remember

- Compare total payments, term, actual proceeds and known fees before comparing instalment size.
- A smaller instalment can come with more instalments and a higher total.
- A simple total-cost calculation is not an annual interest rate or legal conclusion.

#### Common misconception

Assuming the smallest instalment is automatically the cheapest option.

#### Self-check — fictional scenario

Two fictional contracts each provide the full 2,000,000 VND. A requires two 1,050,000 VND instalments and a separate 30,000 VND fee. B requires three 720,000 VND instalments and no other fee. Compare the totals and identify what else needs checking.

#### Step-by-step reasoning

1. A totals 2 × 1,050,000 + 30,000 = 2,130,000 VND, exceeding the proceeds by 130,000 VND.
2. B totals 3 × 720,000 = 2,160,000 VND, which is 30,000 VND more despite smaller instalments.
3. The terms and timing still differ; check late-payment and early-repayment conditions and do not infer an APR from these totals.

#### Conclusion

A has a 30,000 VND lower total under the stated fees. This is arithmetic for fictional contracts, not a recommendation of a loan.

- `3*1080000+60000 = 3300000`
- `3300000-3000000 = 300000`
- `3*1110000 = 3330000`
- `3330000-3300000 = 30000`
- `2*1050000+30000 = 2130000`
- `2130000-2000000 = 130000`
- `3*720000 = 2160000`
- `2160000-2130000 = 30000`

### Practice scenarios

**1. What is the total amount paid for A in the example?**

- A. 3,240,000 VND — This omits the separate 60,000 VND fee.
- B. 3,300,000 VND — Correct: add all three installments and the fee.
- C. 3,060,000 VND — This omits most installment payments.
Answer: **B** (`correctIndex: 1`).

**2. You know only the advertised rates of two contracts. Can you choose the cheaper one?**

- A. Not yet; you need the schedule, money received and fees — Correct: one indicator does not show all payments.
- B. Yes; always choose the smaller number — Fees and calculation methods can differ.
- C. Yes; choose the promise of fast disbursement — Speed does not establish cost.
Answer: **A** (`correctIndex: 0`).

**3. The CFPB source discusses US TILA disclosures. How should this be used in a Vietnam-focused lesson?**

- A. Treat it as Vietnamese law — Foreign sources do not become Vietnamese law.
- B. Promise every Vietnamese contract has the same form — There is no evidence for this claim.
- C. Use only cost concepts and check applicable terms and law separately — Correct: distinguish concepts from each jurisdiction’s legal requirements.
Answer: **C** (`correctIndex: 2`).

### Optional action

Compare two fictional payment tables and write a question about an unspecified fee; do not apply for a loan. You may skip. No spending, financial-product signup, OTP or submission to AI is required.

### Sources

- [Primary reference](https://www.consumerfinance.gov/ask-cfpb/what-is-a-truth-in-lending-disclosure-for-an-auto-loan-en-787/)
- [Primary reference](https://files.consumerfinance.gov/f/documents/cfpb_your-money-your-goals_auto_loans_tool_2018-11_ADA.pdf)

## picket.vi.financial.v1.10 — Payment timing matters as much as the total

**Chapter:** chapter-05 · **Competency:** borrowing.repayment-timing  
**Objective:** Identify a shortfall before income arrives and check conditions before rescheduling or borrowing to cover it.  
**Status:** authored-not-independent-review · locale: en-US · translationVersion: 1

After understanding total cost, place every payment on a calendar alongside income and living needs. A contract with a lower total can still create pressure if its dates do not match when money is available. That does not automatically make another option better; it adds a criterion to check. A positive end-of-month balance does not ensure enough money every day. With project-based income in particular, the date a customer promises and the date money arrives can differ.

Bình begins with 900,000 VND. A contractual payment of 700,000 VND is due on the tenth. Before the fifteenth, 300,000 VND is needed for essentials. Income of 1,200,000 VND is expected on the fifteenth. Before it arrives, the calculation is 900,000 − 700,000 − 300,000 = negative 100,000 VND. After the full payment arrives, with nothing else changing, the balance is 1,100,000 VND. Looking only at the closing amount hides the earlier 100,000 VND gap. Changing a date in an app does not change the contract's due date.

If a gap appears, verify the income date and ask the relevant parties about real options before the deadline. Any schedule change needs confirmation, including its fees and consequences. Paying an extension fee does not necessarily reduce principal; read how that contract allocates payments. New borrowing to cover an old installment can add obligations, so consider the combined schedule rather than just the urgent payment. This lesson neither selects a loan product nor advises abandoning essential needs to pay at any cost.

In Picket, reminders help you remember; completion should correspond to a real, confirmed payment. If that amount already appears in a transaction, do not enter it again from a reminder. You may note unclear information and return later. When an alert appears, you should be able to inspect its calculation and scope instead of accepting an absolute conclusion. Practice only requires marking a shortfall date in the example and considering a question to verify. No contract number, identity document or actual payment is needed to learn how to read the schedule.

### Worked example

Before income: 900,000 − 700,000 − 300,000 = −100,000 VND. After income: −100,000 + 1,200,000 = 1,100,000 VND.

#### Remember

- Read repayment and income dates alongside total cost.
- Identify a pre-due-date shortfall separately even if the ending balance is positive.
- A schedule change is real only when the relevant party agrees and the terms are confirmed.

#### Common misconception

Believing an edited date in an app changes an external repayment obligation.

#### Self-check — fictional scenario

Nam has 120,000 VND. A 200,000 VND repayment is due on day 18, income of 500,000 VND is expected on day 25 and living costs of 100,000 VND on day 27. Identify the gap and two checks needed before changing the schedule.

#### Step-by-step reasoning

1. The day-18 shortfall is 200,000 − 120,000 = 80,000 VND.
2. If every later assumption holds, the ending value is 120,000 − 200,000 + 500,000 − 100,000 = 320,000 VND.
3. Verify the income date and ask through the official channel about feasible arrangements, fees and conditions; update only after confirmation rather than automatically borrowing again.

#### Conclusion

The projected ending value is 320,000 VND, but the earlier shortfall is still 80,000 VND. Picket does not negotiate or extend obligations for you.

- `900000-700000-300000 = -100000`
- `-100000+1200000 = 1100000`
- `200000-120000 = 80000`
- `120000-200000+500000-100000 = 320000`

### Practice scenarios

**1. Before the fifteenth, how much is Bình short under the example?**

- A. Nothing, because the closing balance is positive — Money not yet received cannot meet earlier needs.
- B. 100,000 VND — Correct: the inputs produce a negative 100,000 VND balance.
- C. 1,100,000 VND — 1,100,000 VND is the amount after income arrives.
Answer: **B** (`correctIndex: 1`).

**2. Bình changes a reminder date in Picket. Does the contract deadline automatically change?**

- A. Yes — The app does not change the agreement with the lender.
- B. Yes, if notifications are disabled — Disabling reminders does not change obligations.
- C. No; the relevant party must confirm it — Correct: verify actual changes and their conditions.
Answer: **C** (`correctIndex: 2`).

**3. Does paying an extension fee definitely reduce principal?**

- A. No; check the contract’s allocation of payments — Correct: fees and principal may be different amounts.
- B. It definitely reduces principal by the fee amount — There is not enough information for that conclusion.
- C. It definitely clears the debt — An extension does not mean the obligation disappears.
Answer: **A** (`correctIndex: 0`).

### Optional action

Mark the gap in a fictional schedule and write a question about the payment date or fees. You may skip. No spending, financial-product signup, OTP or submission to AI is required.

### Sources

- [Primary reference](https://files.consumerfinance.gov/f/documents/cfpb_your-money-your-goals_cash_flow_budget_tool_2018-11_ADA.pdf)
- [Primary reference](https://files.consumerfinance.gov/f/documents/cfpb_your-money-your-goals_income_benefits_tool_2018-11_ADA.pdf)
- [Primary reference](https://files.consumerfinance.gov/f/documents/cfpb_your-money-your-goals_auto_loans_tool_2018-11_ADA.pdf)

## picket.vi.financial.v1.11 — Pause before an OTP request

**Chapter:** chapter-06 · **Competency:** safety.otp-and-phishing  
**Objective:** Recognize suspicious requests for transfers or secrets and verify independently through official channels.  
**Status:** authored-not-independent-review · locale: en-US · translationVersion: 1

Knowing your name or order details does not prove someone is entitled to ask you to operate an account. An impersonator may use correct information to create urgency: verify now, claim a refund or avoid being locked out. Pause when a story pushes you to skip checks. A brand name in a message or a familiar logo is not sufficient evidence of authenticity. This lesson focuses on handling requests; it does not require you to recognize every trick by appearance.

In an entirely fictional example, a caller offers Hà a 250,000 VND refund but demands a 50,000 VND transfer first and asks Hà to read out an OTP. Hà has 1,000,000 VND. Sending 50,000 VND leaves 950,000 VND, not 1,200,000 VND, because the promised 250,000 VND refund has not arrived. No calculation establishes the caller's trustworthiness. The safe response in this situation is to stop and independently open the known official app or support channel to check. Do not simply follow a link or callback number provided by the caller.

Do not give callers or message senders OTPs, passwords or login details. Use an authentication code only for an action you initiated on a verified official channel, after understanding what you are authorizing. Do not install an app, grant device-control access or scan an unfamiliar code under refund instructions. If you have acted and suspect fraud, stop the transaction, contact the bank through its official channel for protective steps, preserve evidence and report to the police. Recovery of the money cannot be guaranteed.

Picket practice uses simulated situations. The app does not need a bank OTP, card photo or password to assess an answer. Do not enter a real code into a learning field or share screenshots containing secrets. For an urgent request, ask who initiated contact, what you are authorizing and how to verify independently. Pausing to ask is not a mistake. If you have been deceived, focus on protection and support; do not let embarrassment delay contacting an organization that can respond.

### Worked example

1,000,000 − 50,000 = 950,000 VND; the promised 250,000 VND is not received income. Only assuming both receipt and transfer gives 1,200,000 VND; that assumption cannot establish trust.

#### Remember

- Knowing order details does not prove a caller is a genuine employee.
- Do not share an OTP, password or remote-control access in response to an unexpected refund request.
- Stop and independently find an official verification channel; preserve relevant evidence if fraud is suspected.

#### Common misconception

Trusting every instruction because the caller knows the product name and amount.

#### Self-check — fictional scenario

A caller promises a 350,000 VND refund, names the correct item and asks for an OTP and a remote-control app to receive it. You have not taken those steps. Give three safer actions and explain why the promised refund is not yet recorded income.

#### Step-by-step reasoning

1. Stop the process; do not share the OTP, enter secrets through an unfamiliar link or grant remote-control access.
2. Use an official app or contact channel you identify independently to verify the request, not only contact details supplied by the caller.
3. Preserve relevant communications; if information was exposed or an unfamiliar transaction appears, promptly contact the official bank or competent channel for guidance without assuming recovery is guaranteed.

#### Conclusion

The 350,000 VND is only the caller’s promise. Without a confirmed receipt of money, it is not actual income.

- `1000000-50000 = 950000`
- `1000000-50000+250000 = 1200000`

### Practice scenarios

**1. A caller knows your order details and demands an OTP for a refund. What should you do?**

- A. Read the code because they know the details — Knowing details does not establish identity or access rights.
- B. Stop and verify independently through an official channel — Correct: do not share secrets at a caller’s request.
- C. Read only half the code — This still exposes information and is not safe verification.
Answer: **B** (`correctIndex: 1`).

**2. Hà transfers 50,000 VND and the refund has not arrived. What remains from 1,000,000 VND?**

- A. 950,000 VND — Correct: record only money actually paid out.
- B. 1,200,000 VND — This treats a promise as money received.
- C. 1,250,000 VND — This adds money not received and omits the actual transfer.
Answer: **A** (`correctIndex: 0`).

**3. You clicked a link and suspect information was exposed. What is an appropriate response?**

- A. Wait because reporting feels embarrassing — Delay can increase risk.
- B. Transfer more money to recover it — A recovery promise may be another part of the deception.
- C. Stop, contact the bank officially, preserve evidence and report — Correct: prioritize protection; recovery is not guaranteed.
Answer: **C** (`correctIndex: 2`).

### Optional action

Read the scenario and name an independent verification channel; never use a real OTP or suspicious link. You may skip. No spending, financial-product signup, OTP or submission to AI is required.

### Sources

- [Primary reference](https://www.bocongan.gov.vn/bai-viet/xuat-hien-thu-doan-lua-dao-moi-khi-mua-hang-online-1790562304)
- [Primary reference](https://vcc.gov.vn/default.aspx?category_id=9343771e-96be-48b5-a35d-b8ea9bc1aa93&do=detail&id=04a6bd22-786c-4d56-983c-923cce86ec7c&page=news)

## picket.vi.financial.v1.12 — Trials, renewals and a pause before buying

**Chapter:** chapter-06 · **Competency:** safety.renewals-and-deliberate-buying  
**Objective:** Identify renewal dates, verify cancellation status and compare conditional purchase choices without judging interests.  
**Status:** authored-not-independent-review · locale: en-US · translationVersion: 1

A free trial may become a paid subscription unless you cancel according to the agreed terms. Before starting, look for the post-trial price, billing cycle, renewal date and actual cancellation method. A free label does not explain every condition. You can choose not to sign up if you do not understand. Similarly, removing an app icon from your phone does not prove a subscription is canceled. Check its status where the subscription is managed and retain confirmation when available.

In a fictional example, Yến pays 79,000 VND monthly for service A and 49,000 VND for service B, totaling 128,000 VND per month. If both prices stay unchanged, both remain active for twelve months and there are no other fees, the total is 1,536,000 VND. Yến is also considering a 450,000 VND item expected to be used six times. Dividing price by anticipated uses gives 75,000 VND per use, but does not prove all six uses will happen. The numbers expose scale and assumptions; they do not decide for Yến.

A self-chosen pause before a flexible purchase may allow time to compare plans, read conditions and reconsider the need. You can note the item and return at a time you choose. This is a reflection technique, not a guaranteed legal cancellation period, and it should not be rigidly imposed on medicine or urgent needs. Buying or not buying after the pause can both be reasonable, depending on circumstances. You do not need a streak of avoiding purchases to prove money-management knowledge.

In Picket, flagging a recurring expense for review does not cancel an external service. To cancel, use the official channel and confirm the outcome before editing the future schedule. A payment already charged still needs an accurate record; an unapproved refund request is not received money. Renewal reminders should be opt-in and avoid duplicates. Practice can simply mean reviewing the examples or writing a question about trial conditions. No subscription, purchase or card information is required to finish; the aim is to make your choices clear.

### Worked example

79,000 + 49,000 = 128,000 VND per month; 128,000 × 12 = 1,536,000 VND per year under the assumptions; 450,000 / 6 = 75,000 VND per anticipated use.

#### Remember

- Check the post-trial price, next charge date and cancellation method before deciding.
- Deleting an app or flagging a service in Picket does not cancel an external subscription.
- Compare costs over the same period and state price and duration assumptions.

#### Common misconception

Assuming an unused or uninstalled service can no longer charge.

#### Self-check — fictional scenario

One plan will cost 59,000 VND monthly after its trial; another currently costs 89,000 VND monthly. If both prices stay unchanged for 12 months, what is the total? With a self-chosen monthly limit of 120,000 VND, what should be reviewed before renewal?

#### Step-by-step reasoning

1. Together they cost 59,000 + 89,000 = 148,000 VND monthly, which is 28,000 VND above the chosen limit.
2. Keeping both for 12 unchanged-price months totals 148,000 × 12 = 1,776,000 VND; price changes or mid-period cancellation change that assumption.
3. Review use, terms and the official cancellation process; confirm the result before changing the schedule and do not subscribe just to practise.

#### Conclusion

The assumed total is 148,000 VND per month and 1,776,000 VND for 12 months. A Picket reminder does not prove that charging has stopped.

- `79000+49000 = 128000`
- `128000*12 = 1536000`
- `450000/6 = 75000`
- `59000+89000 = 148000`
- `148000-120000 = 28000`
- `148000*12 = 1776000`

### Practice scenarios

**1. Does deleting the app from your phone prove the subscription is canceled?**

- A. Yes, it always cancels automatically — Deleting an app and canceling a subscription are different actions.
- B. No; check the status where the subscription is managed — Correct: confirm at the official management channel.
- C. Yes, if the app is not opened — Not using it does not automatically change billing terms.
Answer: **B** (`correctIndex: 1`).

**2. Both subscriptions retain their prices for 12 months as in the example. What is the total?**

- A. 128,000 VND — This is the one-month total.
- B. 1,536,000 VND — Correct: 128,000 multiplied by twelve.
- C. 450,000 VND — This is the other item’s price, not the two subscriptions.
Answer: **B** (`correctIndex: 1`).

**3. Picket flags service B for review. Can charges already be considered stopped?**

- A. Yes, as soon as it is flagged — A Picket note does not control an external service.
- B. Yes, after any one-day pause — A self-chosen pause does not change the contract.
- C. Not yet; cancel and confirm through the provider or management channel — Correct: update the schedule only once the actual result is known.
Answer: **C** (`correctIndex: 2`).

### Optional action

Review the price and renewal date of an example or existing subscription; you may skip and should not sign up for another one. You may skip. No spending, financial-product signup, OTP or submission to AI is required.

### Sources

- [Primary reference](https://consumer.ftc.gov/articles/getting-and-out-free-trials-auto-renewals-and-negative-option-subscriptions)

## Translation consistency checks

- 12 translated bodies, 36 questions and 108 choice explanations; 60 arithmetic checks passed.
- IDs, chapter/competency IDs, version, correct answer positions, source URLs, currencies and arithmetic expressions/results match Vietnamese v1 exactly.
- No placeholders occur in the source or translated lesson text; no placeholder substitution was introduced.
- Source VI files were not modified; regeneration writes only EN artifacts.
- Independent financial, language and safety review and learner pilot remain outstanding.
