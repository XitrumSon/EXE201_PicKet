import { paperControl , paperShape } from "@/core/theme/paper-foundations";
import { PicketText as Text } from "@/core/ui/picket-text";

import { useTranslation } from "react-i18next";
import { formatCalendarDate, formatMoney, localeFor, normalizeLanguage } from "@/core/i18n/formatters";
import { useMobileStyles } from "@/core/theme/use-mobile-styles";
import type { MobileThemeColors } from "@/core/theme/mobile-theme-adapter";
import type { AdminUserActionRequest } from "@picket/domain";
import { Redirect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { PicketTextInput as TextInput } from "@/core/ui/picket-text-input";
import { Alert, StyleSheet, Switch, View } from "react-native";

import { routes } from "@/core/navigation/routes";
import { AccessiblePressable as Pressable } from "@/core/ui/accessible-pressable";
import { TopAppBar, ChoiceChip, EmptyState, PicketScreen, PrimaryAction, SectionTitle, Surface } from "@/core/ui/picket-ui";
import { useAuth } from "@/features/auth/auth-context";
import {
  isSafeHttpsUrl, isStaff, loadStaffLedger, loadStaffOverview,
  performStaffAction, savePartnerAd, saveStaffSettings,
  type StaffOverview,
} from "@/features/admin/admin-mobile";

type Tab = "users" | "ocr" | "partners" | "settings" | "audit";
const tabs: [Tab,string][] = [["users","users"],["ocr","ocr"],["partners","partners"],["settings","settings"],["audit","audit"]];
const emptyAd = { id: null as string | null, title: "", body: "", url: "", active: false };

export default function AdminScreen() {
  const {t,i18n}=useTranslation("admin");
  const language=normalizeLanguage(i18n.resolvedLanguage??i18n.language);
  const { styles } = useMobileStyles(createStyles);
  const { session } = useAuth();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [overview, setOverview] = useState<StaffOverview | null>(null);
  const [page, setPage] = useState(0);
  const [tab, setTab] = useState<Tab>("users");
  const [search, setSearch] = useState("");
  const [maskEmail, setMaskEmail] = useState(true);
  const [maintenance, setMaintenance] = useState(false);
  const [notice, setNotice] = useState("");
  const [ad, setAd] = useState<typeof emptyAd | null>(null);
  const [ledger, setLedger] = useState<{ title?: string; date?: string; category?: string; amount?: number }[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const reload = useCallback(async () => {
    if (!session) return;
    setBusy(true);
    try {
      const staff = await isStaff();
      setAllowed(staff);
      if (!staff) return;
      const next = await loadStaffOverview(page);
      setOverview(next);
      setMaintenance(next.settings.maintenance);
      setNotice(next.settings.notice);
      setMessage(null);
    } catch { setMessage("loadFailed"); }
    finally { setBusy(false); }
  }, [page, session]);
  useEffect(() => {
    const timer = setTimeout(() => { void reload(); }, 0);
    return () => clearTimeout(timer);
  }, [reload]);

  if (!session) return <Redirect href={routes.login} />;
  const users = overview?.users.filter((user) => `${user.email} ${user.id}`.toLowerCase().includes(search.toLowerCase())) ?? [];
  const userAction = (userId: string, request: AdminUserActionRequest, label: string) => {
    Alert.alert(t("confirmTitle"), t("confirmAction",{label,userId}), [
      { text: t("cancel"), style: "cancel" },
      { text: t("confirm"), style: "destructive", onPress: () => void (async () => {
        setBusy(true);
        try { await performStaffAction(session.access_token, userId, request); await reload(); setMessage("actionDone"); }
        catch { setMessage("actionFailed"); }
        finally { setBusy(false); }
      })() },
    ]);
  };
  async function viewLedger(userId: string) {
    setBusy(true);
    try { setLedger((await loadStaffLedger(userId))?.entries ?? []); }
    catch { setMessage("ledgerFailed"); }
    finally { setBusy(false); }
  }
  async function persistSettings() {
    setBusy(true);
    try { await saveStaffSettings(maintenance, notice); await reload(); setMessage("settingsSaved"); }
    catch { setMessage("settingsFailed"); }
    finally { setBusy(false); }
  }
  async function persistAd() {
    if (!ad) return;
    if (!isSafeHttpsUrl(ad.url)) return setMessage("invalidPartnerUrl");
    setBusy(true);
    try { await savePartnerAd(ad); setAd(null); await reload(); setMessage("partnerSaved"); }
    catch { setMessage("partnerFailed"); }
    finally { setBusy(false); }
  }
  return <PicketScreen>
    <TopAppBar title={t("title")} />
    {busy && <Text accessibilityLiveRegion="polite" style={styles.muted}>{t("processing")}</Text>}
    {message && <Text accessibilityLiveRegion="polite" style={styles.message}>{t(message)}</Text>}
    {allowed === false ? <EmptyState title={t("forbidden")} description={t("forbiddenDescription")} /> : !overview ?
      <EmptyState title={t("loading")} description={t("loadingDescription")} action={t("retry")} onAction={() => void reload()} /> : <>
      <View style={styles.tabs}>{tabs.map(([value, label]) => <ChoiceChip checked={tab === value} key={value} label={t(label)} onPress={() => setTab(value)} />)}</View>
      {tab === "users" && <>
        <Surface peach><Text style={styles.title}>{t("totals",{users:overview.total_users,ledgers:overview.total_ledgers})}</Text></Surface>
        <TextInput accessibilityLabel={t("searchLabel")} onChangeText={setSearch} placeholder={t("searchPlaceholder")} style={styles.input} value={search} />
        <View style={styles.row}><Text style={styles.title}>{t("maskEmail")}</Text><Switch accessibilityLabel={t("maskEmail")} hitSlop={12} onValueChange={setMaskEmail} value={maskEmail} /></View>
        {users.map((user) => <Surface key={user.id}>
          <Text style={styles.title}>{maskEmail ? t("maskedAccount",{id:user.id.slice(0,8)}) : user.email}</Text>
          <Text style={styles.muted}>{t("userSummary",{count:user.entry_count,date:new Date(user.created_at).toLocaleDateString(localeFor(language))})}</Text>
          <Text style={styles.muted}>{user.banned_until && new Date(user.banned_until) > new Date() ? t("suspended") : t("active")} · {t("revision",{revision:user.revision??"—"})}</Text>
          <View style={styles.actions}>
            <ChoiceChip checked={false} label={t("viewLedger")} onPress={() => void viewLedger(user.id)} />
            {user.banned_until && new Date(user.banned_until) > new Date() ?
              <ChoiceChip checked={false} label={t("unlock")} onPress={() => userAction(user.id, { action:"restore", confirmation:"RESTORE" }, t("unlock"))} /> :
              <ChoiceChip checked={false} label={t("suspend")} onPress={() => userAction(user.id, { action:"suspend", confirmation:"SUSPEND" }, t("suspend"))} />}
            <ChoiceChip checked={false} label={t("resetPassword")} onPress={() => userAction(user.id, { action:"reset_password", confirmation:"RESET" }, t("sendReset"))} />
            {(["free", "plus", "pro"] as const).map((tier) => <ChoiceChip checked={false} key={tier} label={tier === "free" ? t("revokePlan") : t("grantPlan",{tier:tier.toUpperCase()})} onPress={() => userAction(user.id, { action:"grant_plan", confirmation:"GRANT", tier }, t("changePlan",{tier}))} />)}
          </View>
        </Surface>)}
        <View style={styles.row}><Pressable accessibilityRole="button" disabled={page === 0 || busy} onPress={() => setPage((value) => value - 1)}><Text style={styles.link}>{t("previousPage")}</Text></Pressable><Text>{t("page",{page:page+1})}</Text><Pressable accessibilityRole="button" disabled={overview.users.length < 25 || busy} onPress={() => setPage((value) => value + 1)}><Text style={styles.link}>{t("nextPage")}</Text></Pressable></View>
      </>}
      {tab === "ocr" && <><SectionTitle title={t("ocrTitle")} /><Text style={styles.muted}>{t("ocrDescription")}</Text>{overview.ocr.map((row) => <Surface key={row.day}><Text style={styles.title}>{formatCalendarDate(row.day.slice(0,10),language)}</Text><Text style={styles.muted}>{t("ocrSummary",{successful:row.successful,scans:row.scans,average:row.average_ms})}</Text></Surface>)}</>}
      {tab === "partners" && <>
        <PrimaryAction label={t("addPartner")} onPress={() => setAd({ ...emptyAd })} />
        {overview.ads.map((item) => <Pressable accessibilityRole="button" key={item.id} onPress={() => setAd({ id:item.id, title:item.title, body:item.body, url:item.url, active:item.active })}><Surface><Text style={styles.title}>{item.title}</Text><Text style={styles.muted}>{item.active ? t("visible") : t("hidden")} · {item.url}</Text></Surface></Pressable>)}
        {ad && <Surface><SectionTitle title={ad.id ? t("editPartner") : t("newPartner")} />
          <TextInput accessibilityLabel={t("partnerTitle")} maxLength={120} onChangeText={(title) => setAd((value) => value && ({ ...value, title }))} placeholder={t("titlePlaceholder")} style={styles.input} value={ad.title} />
          <TextInput accessibilityLabel={t("partnerBody")} maxLength={500} multiline onChangeText={(body) => setAd((value) => value && ({ ...value, body }))} placeholder={t("bodyPlaceholder")} style={styles.input} value={ad.body} />
          <TextInput accessibilityLabel={t("partnerUrl")} autoCapitalize="none" keyboardType="url" onChangeText={(url) => setAd((value) => value && ({ ...value, url }))} placeholder="https://…" style={styles.input} value={ad.url} />
          <View style={styles.row}><Text style={styles.title}>{t("show")}</Text><Switch accessibilityLabel={t("showPartner")} hitSlop={12} onValueChange={(active) => setAd((value) => value && ({ ...value, active }))} value={ad.active} /></View>
          <PrimaryAction busy={busy} label={t("savePartner")} onPress={() => void persistAd()} />
          <Pressable accessibilityRole="button" onPress={() => setAd(null)}><Text style={styles.link}>{t("cancel")}</Text></Pressable>
        </Surface>}
      </>}
      {tab === "settings" && <Surface><View style={styles.row}><View style={styles.flex}><Text style={styles.title}>{t("maintenance")}</Text><Text style={styles.muted}>{t("maintenanceDescription")}</Text></View><Switch accessibilityLabel={t("maintenance")} hitSlop={12} onValueChange={setMaintenance} value={maintenance} /></View><TextInput accessibilityLabel={t("notice")} maxLength={1000} multiline onChangeText={setNotice} placeholder={t("noticePlaceholder")} style={styles.input} value={notice} /><PrimaryAction busy={busy} label={t("saveSettings")} onPress={() => void persistSettings()} /></Surface>}
      {tab === "audit" && <><SectionTitle title={t("auditTitle")} />{overview.audit.map((item, index) => <Surface key={`${item.created_at}-${index}`}><Text style={styles.title}>{item.action}</Text><Text style={styles.muted}>{item.target ?? t("noTarget")} · {new Date(item.created_at).toLocaleString(localeFor(language))}</Text></Surface>)}</>}
      {ledger && <Surface peach><SectionTitle title={t("ledgerTitle")} /><Text style={styles.muted}>{t("ledgerNotice")}</Text>{ledger.map((item, index) => <View key={index} style={styles.row}><View style={styles.flex}><Text style={styles.title}>{item.title ?? t("transaction")}</Text><Text style={styles.muted}>{item.date ?? ""} · {item.category ?? ""}</Text></View><Text>{formatMoney(item.amount??0,language,"VND")}</Text></View>)}<Pressable accessibilityRole="button" onPress={() => setLedger(null)}><Text style={styles.link}>{t("close")}</Text></Pressable></Surface>}
      <Pressable accessibilityRole="button" onPress={() => void reload()}><Text style={styles.link}>{t("reload")}</Text></Pressable>
    </>}
  </PicketScreen>;
}

const createStyles = (colors: MobileThemeColors) => StyleSheet.create({ heading:{color:colors.ink,fontSize:26,fontWeight:"800",marginVertical:14},tabs:{flexDirection:"row",flexWrap:"wrap",gap:8,marginBottom:14},title:{color:colors.ink,fontSize:15,fontWeight:"700"},muted:{color:colors.muted,fontSize:13,lineHeight:20,marginTop:4},message:{color:colors.expense,fontSize:13,marginBottom:12},link:{color:colors.link,fontSize:14,fontWeight:"700",marginVertical:12},input:{backgroundColor:colors.white,borderColor:colors.controlBorder,borderRadius:paperShape.input,borderWidth:1,color:colors.ink,fontSize:15,minHeight:paperControl.height,marginVertical:8,paddingHorizontal:14},row:{alignItems:"center",flexDirection:"row",justifyContent:"space-between",gap:12,minHeight:52},flex:{flex:1},actions:{flexDirection:"row",flexWrap:"wrap",gap:8,marginTop:12} });
