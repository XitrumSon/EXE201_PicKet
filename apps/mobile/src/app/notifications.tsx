import { useReminderCalendar } from "@/features/notifications/use-reminder-calendar";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "@/features/settings/appearance-provider";
import { colors } from "@picket/design-tokens";
import { Redirect, useFocusEffect } from "expo-router";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

import { routes } from "@/core/navigation/routes";
import { guestOwnerId } from "@/core/local/guest-finance";
import { AccessiblePressable as Pressable } from "@/core/ui/accessible-pressable";
import { TopAppBar, EmptyState, PicketScreen, Surface } from "@/core/ui/picket-ui";
import { useAuth } from "@/features/auth/auth-context";
import { useBills } from "@/features/bills/bills-context";
import { useBudgets } from "@/features/budgets/budgets-context";
import { loadKeepsakeCollection } from "@/features/keepsakes/cloud-keepsakes";
import { listKeepsakes, type Keepsake } from "@/features/keepsakes/keepsake-store";
import { loadReminderKeepsakes } from "@/features/notifications/keepsake-source";
import { collectReminders, markReminderRead, readReminderIds, remindersEnabled, scheduleUserReminders, setRemindersEnabled } from "@/features/notifications/reminders";
import { useSubscriptions } from "@/features/subscriptions/subscriptions-context";
import { useTransactionHistory } from "@/features/transactions/use-transaction-history";
import { useSpendingSplits } from "@/features/transactions/use-spending-splits";
import { useReminderPeriods } from "@/features/notifications/use-reminder-periods";


export default function NotificationsScreen() {
  const {t:tx}=useTranslation("notifications");
  const {language}=useAppTheme();
  const { session, localMode } = useAuth();
  const ownerId = session?.user.id ?? (localMode ? guestOwnerId : null);
  const deliveryScope = useRef({ ownerId, language, active: true, busy: false });
  const isCurrentOwner = () => deliveryScope.current.active && deliveryScope.current.ownerId === ownerId && deliveryScope.current.language === language;
  const { bills } = useBills();
  const { budgets } = useBudgets();
  const { subscriptions } = useSubscriptions();
  const { transactions, loading: historyLoading, error: historyError } = useTransactionHistory();
  const calendar = useReminderCalendar();
  const month = calendar.month;
  const { splits, loading: splitLoading, error: splitError } = useSpendingSplits(transactions, month);
  const { periodLimits, periodsReady } = useReminderPeriods(budgets, month);
  const [keepsakes, setKeepsakes] = useState<Keepsake[]>([]);
  const [enabled, setEnabled] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [read, setRead] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const now = calendar.now;
  useLayoutEffect(() => {
    const scope = {ownerId,language,active:true,busy:false};
    deliveryScope.current=scope;
    return () => {scope.active=false;};
  },[ownerId,language]);
  const reminders = useMemo(() => collectReminders({ bills, subscriptions, keepsakes, budgets: historyLoading || historyError || splitLoading || splitError || !periodsReady ? [] : budgets, transactions, splits, periodLimits },language,new Date(calendar.now)), [bills, subscriptions, keepsakes, budgets, transactions, splits, periodLimits, periodsReady, historyLoading, historyError, splitLoading, splitError,language,calendar.now]);
  const dueSoon = reminders.filter((item) => item.notifyAt === null || new Date(item.dueAt).getTime() <= now + 7 * 86400000);
  useFocusEffect(useCallback(() => {
    if (!ownerId) return;
    setSettingsLoading(true);
    let active = true;
    const scope=deliveryScope.current;
    const current=()=>active && deliveryScope.current===scope && scope.language===language;
    void Promise.all([
      loadReminderKeepsakes({
        localMode,
        token: session?.access_token ?? null,
        userId: ownerId,
        loadLocal: listKeepsakes,
        loadCloud: loadKeepsakeCollection,
      }),
      remindersEnabled(ownerId),
      readReminderIds(ownerId),
    ])
      .then(([items, setting, ids]) => { if (current()) { setKeepsakes(items); setEnabled(setting); setRead(ids); setBusy(false);setMessage(null); } })
      .catch(() => { if (current()) {setBusy(false);setMessage("Không tải được cài đặt thông báo trên thiết bị.");} })
      .finally(() => { if (current()) setSettingsLoading(false); });
    return () => { active = false; };
  }, [localMode, ownerId, session?.access_token, language]));
  if (!ownerId) return <Redirect href={routes.login} />;
  async function toggle(value: boolean) {
    if (!isCurrentOwner() || deliveryScope.current.busy || settingsLoading) return;
    const operation=deliveryScope.current;operation.busy=true;
    const current=()=>isCurrentOwner() && deliveryScope.current===operation;
    setBusy(true); setMessage(null);
    try {
      const saved = await setRemindersEnabled(ownerId!, value,language);
      if (!current()) return;
      if (!saved) { setMessage("Quyền thông báo chưa được cấp trong cài đặt Android."); return; }
      setEnabled(value);
      if (value) await scheduleUserReminders(ownerId!, reminders, current,language);
    } catch { if(current())setMessage("Không cập nhật được lịch nhắc. Hãy thử lại."); }
    finally { operation.busy=false;if(current())setBusy(false); }
  }
  async function markRead(id: string) {
    const operation=deliveryScope.current;
    const current=()=>isCurrentOwner() && deliveryScope.current===operation;
    if(!current())return;
    try { await markReminderRead(ownerId!, id); if(!current())return; setRead((current) => [...new Set([...current, id])]); }
    catch { if(current())setMessage("Không đánh dấu đã đọc được."); }
  }
  async function reschedule() {
    if(!isCurrentOwner() || deliveryScope.current.busy || settingsLoading)return;
    const operation=deliveryScope.current;operation.busy=true;
    const current=()=>isCurrentOwner() && deliveryScope.current===operation;
    setBusy(true); setMessage(null);
    try { await scheduleUserReminders(ownerId!, reminders, current,language); if(current())setMessage("Đã cập nhật lịch nhắc trên thiết bị."); }
    catch { if(current())setMessage("Không cập nhật được lịch nhắc."); }
    finally { operation.busy=false;if(current())setBusy(false); }
  }
  return <PicketScreen>
    <TopAppBar title={tx("Thông báo")} />
    <Text style={styles.subtitle}>{tx("Các hạn thanh toán, món đồ và ngân sách cần chú ý.")}</Text>
    <Surface><View style={styles.setting}><View style={styles.copy}><Text style={styles.title}>{tx("Nhắc trên điện thoại")}</Text><Text style={styles.hint}>{tx("Thông báo không hiển thị chi tiết tài chính khi màn hình khóa.")}</Text></View><Switch accessibilityLabel={tx("Nhắc trên điện thoại")} disabled={busy || settingsLoading} hitSlop={12} onValueChange={(value) => void toggle(value)} value={enabled} /></View></Surface>
    {enabled && <Pressable accessibilityRole="button" disabled={busy} onPress={() => void reschedule()} style={styles.linkButton}><Text style={styles.link}>{tx("Cập nhật lịch nhắc")}</Text></Pressable>}
    {message && <Text accessibilityLiveRegion="polite" style={styles.message}>{tx(message)}</Text>}
    {dueSoon.length === 0 ? <EmptyState title={tx("Chưa có thông báo mới")} description={tx("Picket sẽ nhắc khi có hạn thanh toán hoặc ngân sách cần chú ý.")} /> :
      <View style={styles.list}>{dueSoon.map((item) => <Pressable accessibilityRole="button" accessibilityLabel={`${item.label}, ${read.includes(item.id) ? tx("đã đọc") : tx("chưa đọc")}`} key={item.id} onPress={() => void markRead(item.id)}><Surface><Text style={styles.title}>{read.includes(item.id) ? "○" : "●"} {item.label}</Text><Text style={styles.hint}>{read.includes(item.id) ? tx("Đã đọc") : tx("Chạm để đánh dấu đã đọc")}</Text></Surface></Pressable>)}</View>}
  </PicketScreen>;
}

const styles = StyleSheet.create({ back:{color:colors.mauve,fontSize:15,fontWeight:"800",marginBottom:18},heading:{color:colors.ink,fontSize:29,fontWeight:"800"},subtitle:{color:colors.muted,fontSize:15,lineHeight:22,marginBottom:20,marginTop:7},setting:{alignItems:"center",flexDirection:"row",gap:12},copy:{flex:1},title:{color:colors.ink,fontSize:15,fontWeight:"800"},hint:{color:colors.muted,fontSize:12,lineHeight:18,marginTop:5},linkButton:{alignSelf:"flex-start",marginVertical:15},link:{color:colors.mauve,fontWeight:"800"},message:{color:colors.expense,fontSize:13,marginBottom:12},list:{gap:10,marginTop:18} });
