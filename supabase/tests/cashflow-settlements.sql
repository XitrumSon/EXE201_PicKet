begin;
do $$ begin
 if to_regprocedure('public.load_cashflow_settlements()') is null then raise exception 'Missing settlement sync';end if;
 if has_table_privilege('authenticated','public.cashflow_settlement_documents','UPDATE') then raise exception 'Direct writes bypass revision';end if;
 if has_function_privilege('anon','public.save_cashflow_settlements(text,bigint,jsonb)','EXECUTE') then raise exception 'Anonymous mutation';end if;
end $$;
insert into auth.users(id,email) values('55555555-1234-4321-8123-123456789001','settle-a@example.test'),('55555555-1234-4321-8123-123456789002','settle-b@example.test');
insert into public.profiles(id) values('55555555-1234-4321-8123-123456789001'),('55555555-1234-4321-8123-123456789002') on conflict do nothing;
insert into public.wallets(user_id,id,name,kind,currency_code,opening_balance) values('55555555-1234-4321-8123-123456789001','55555555-1234-4321-8123-123456789010','Cash','cash','VND',100000);
insert into public.cashflow_schedules(user_id,id,start_day,frequency,amount,currency,active,wallet_id) values('55555555-1234-4321-8123-123456789001','55555555-1234-4321-8123-123456789011','2026-10-24','monthly',-19000,'VND',true,'55555555-1234-4321-8123-123456789010');
insert into public.transactions(user_id,id,wallet_id,title,amount,kind,occurred_at) values('55555555-1234-4321-8123-123456789001','55555555-1234-4321-8123-123456789012','55555555-1234-4321-8123-123456789010','Paid',19000,'expense','2026-10-24T00:00:00Z');
set local role authenticated;
select set_config('request.jwt.claim.sub','55555555-1234-4321-8123-123456789001',true);
do $$ declare links jsonb;doc jsonb;begin
 select jsonb_build_array(jsonb_build_object('occurrenceId','55555555-1234-4321-8123-123456789011:2026-10-24','day','2026-10-24','amount',-19000,'currency','VND','transactionId',id,'transactionUpdatedAt',updated_at)) into links from public.transactions where id='55555555-1234-4321-8123-123456789012';
 doc:=public.save_cashflow_settlements('settlement-first',0,links);
 if (doc->>'revision')::int<>1 then raise exception 'No revision';end if;
 if public.save_cashflow_settlements('settlement-first',0,links)<>doc then raise exception 'Retry changed';end if;
 begin perform public.save_cashflow_settlements('settlement-first',0,'[]');raise exception 'Key reused';exception when unique_violation then null;end;
 begin perform public.save_cashflow_settlements('settlement-stale',0,'[]');raise exception 'Stale accepted';exception when check_violation then null;end;
 begin perform public.save_cashflow_settlements('settlement-duplicate',1,links||links);raise exception 'Duplicate accepted';exception when invalid_parameter_value then null;end;
 perform public.save_cashflow_settlements('settlement-clear',1,'[]');
 doc:=public.save_cashflow_settlements('settlement-first',0,links);
 if (doc->>'revision')::int<>2 or jsonb_array_length(doc->'links')<>0 or (doc->>'appliedRevision')::int<>1 then raise exception 'Retry resurrected links';end if;
end $$;
select set_config('request.jwt.claim.sub','55555555-1234-4321-8123-123456789002',true);
do $$ begin
 if (public.load_cashflow_settlements()->>'revision')::int<>0 then raise exception 'Owner leak';end if;
 begin perform public.save_cashflow_settlements('foreign-evidence',0,(select links from public.cashflow_settlement_documents limit 1));raise exception 'Foreign accepted';exception when invalid_parameter_value then null;end;
end $$;
rollback;
