import { paperControl , paperShape } from "@/core/theme/paper-foundations";
import { usePocketAppearance } from "@/features/budgets/use-pocket-appearance";
import { defaultPocketAppearance, type PocketAppearance } from "@/features/budgets/pocket-appearance";
import { PocketAppearancePicker } from "@/features/budgets/pocket-appearance-picker";
import { PicketText as Text } from "@/core/ui/picket-text";

import { resolvePaperAsset } from "@/core/theme/paper-assets";
import { PaperArt } from "@/core/ui/paper-art";
import { useTranslation } from "react-i18next";
import { formatMoney, localeFor, normalizeLanguage } from "@/core/i18n/formatters";
import { parsePaymentAmount } from "@/core/forms/payment-form";
import { useMobileStyles } from "@/core/theme/use-mobile-styles";
import type { MobileThemeColors } from "@/core/theme/mobile-theme-adapter";
import { Redirect, router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { PicketTextInput as TextInput } from "@/core/ui/picket-text-input";
import { ActivityIndicator, Alert, StyleSheet, View, useWindowDimensions } from "react-native";
import { routes } from "@/core/navigation/routes";
import { picketApi } from "@/core/api/client";
import { budgetOverview } from "@/core/local/budget-overview";
import { loadBudgetSplits } from "@/core/local/load-budget-splits";
import { guestBudgetSpent } from "@/core/local/guest-finance";
import { useGuestFinance } from "@/core/local/guest-finance-context";
import { isOfflineQueuedError } from "@/core/sync/offline-queued-error";
import { AccessiblePressable as Pressable } from "@/core/ui/accessible-pressable";
import { ActionSheet, ConnectionNotice, DangerAction, EmptyState, IconButton, MenuRow, PicketScreen, PrimaryAction, SectionTitle, Surface, TopAppBar } from "@/core/ui/picket-ui";
import { useAuth } from "@/features/auth/auth-context";
import { useBudgets } from "@/features/budgets/budgets-context";
import { useTransactions } from "@/features/transactions/transactions-context";

export default function BudgetsScreen() {
  const { t: designCopy } = useTranslation("overview");
  const { appearances, save: saveAppearance } = usePocketAppearance();
  const params = useLocalSearchParams<{ create?: string }>();
  const [appearance, setAppearance] = useState<PocketAppearance>({ assetId: "shopping", tone: "pocketLilac" });
  const [appearanceId, setAppearanceId] = useState<string | null>(null);
  const [appearanceError, setAppearanceError] = useState(false);
  const [budgetName, setBudgetName] = useState("");
  const {t,i18n}=useTranslation("budgets");
  const language=normalizeLanguage(i18n.resolvedLanguage??i18n.language);
  const money=(amount:number)=>formatMoney(amount,language,"VND");
  const { colors, styles: cardStyles } = useMobileStyles(createCardStyles);
  const { styles } = useMobileStyles(createStyles);
  const { session, localMode } = useAuth();
  const guest = useGuestFinance();
  const { categories, transactions } = useTransactions();
  const { budgets, loading, error, create, update, archive, refresh } = useBudgets();
  const [categoryId, setCategoryId] = useState("");
  const [limit, setLimit] = useState("1000000");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedLimit, setEditedLimit] = useState("");
  const [periodLimits, setPeriodLimits] = useState<{ month: string; limits: Record<string, number> } | null>(null);
  const [periodError, setPeriodError] = useState<string | null>(null);
  const [cloudSplits, setCloudSplits] = useState<{ month: string; splits: Awaited<ReturnType<typeof loadBudgetSplits>> } | null>(null);
  const [splitError, setSplitError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(params.create === "1");
  const [managingId, setManagingId] = useState<string | null>(null);
  const { fontScale } = useWindowDimensions();
  const monthText = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;
  useFocusEffect(useCallback(() => {
    if (localMode || !session || !picketApi) return;
    let active = true;
    void picketApi.getPlanning(session.access_token, monthText)
      .then((planning) => { if (active) { setPeriodLimits({ month: monthText, limits: Object.fromEntries(planning.periods.map((period) => [period.budgetId, period.limit])) }); setPeriodError(null); } })
      .catch(() => { if (active) { setPeriodLimits(null); setPeriodError("periodFailed"); } });
    return () => { active = false; };
  }, [localMode, monthText, session]));
  useFocusEffect(useCallback(() => {
    if (localMode || !session || !picketApi) return;
    const api = picketApi;
    let active = true;
    setCloudSplits(null);
    setSplitError(null);
    void loadBudgetSplits(transactions, monthText, async (ids) => (await api.listTransactionSplitsByIds(session.access_token, ids)).splits)
      .then((splits) => { if (active) setCloudSplits({ month: monthText, splits }); })
      .catch(() => { if (active) setSplitError("splitsFailed"); });
    return () => { active = false; };
  }, [localMode, monthText, session, transactions]));
  if (!session && !localMode) return <Redirect href={routes.login} />;
  const expenseCategories = categories.filter((item) => item.kind === "expense" || item.kind === "both");
  const managing = budgets.find((item) => item.id === managingId);
  const editing = budgets.find((item) => item.id === editingId);
  const selected = expenseCategories.find((item) => item.id === categoryId) ?? expenseCategories[0];
  async function add() {
    const amount=parsePaymentAmount(limit);
    if (!selected || amount===null) { setMessage("invalidCreate"); return; }
    setBusy(true); setMessage(null);
    try {
      const created = await create({ categoryId: selected.id, name: budgetName.trim() || selected.name, defaultLimit: amount, alertPercent: 80 });
      try { await saveAppearance(created.id, appearance); setAppearanceError(false); } catch { setAppearanceError(true); }
      setBudgetName(""); setLimit("1000000"); setShowCreate(false);
    }
    catch (caught) { if (isOfflineQueuedError(caught)) { setShowCreate(false); setMessage("queued"); } else setMessage("createFailed"); }
    finally { setBusy(false); }
  }
  async function archiveBudget(id: string, version: number) {
    setBusy(true); setMessage(null);
    try { await archive(id, version); }
    catch (caught) { if (!isOfflineQueuedError(caught)) setMessage("archiveFailed"); }
    finally { setBusy(false); }
  }
  async function saveLimit(id: string, version: number) {
    const amount = parsePaymentAmount(editedLimit);
    if (amount===null) { setMessage("invalidLimit"); return; }
    setBusy(true); setMessage(null);
    try { await update(id, { expectedVersion: version, defaultLimit: amount }); setEditingId(null); }
    catch (caught) { if (isOfflineQueuedError(caught)) { setEditingId(null); setMessage("queued"); } else setMessage("updateFailed"); }
    finally { setBusy(false); }
  }
  return <PicketScreen>
    <TopAppBar illustration="shopping" title={t("title")} subtitle={t("subtitle")} back={false} action={<IconButton icon={showCreate ? "close" : "plus"} label={showCreate ? t("closeCreate") : t("add")} onPress={() => setShowCreate(!showCreate)} />} />
    <MenuRow icon="calendar-check-outline" title={t("planning")} description={t("planningDescription")} onPress={() => router.push(routes.planning)} />
    <Surface><View style={styles.monthRow}><Pressable accessibilityLabel={t("previousMonth")} accessibilityRole="button" onPress={() => setMonth((current) => new Date(current.getFullYear(), current.getMonth()-1, 1))}><Text style={styles.monthArrow}>‹</Text></Pressable><Text style={styles.name}>{month.toLocaleDateString(localeFor(language),{month:"long",year:"numeric"})}</Text><Pressable accessibilityLabel={t("nextMonth")} accessibilityRole="button" onPress={() => setMonth((current) => new Date(current.getFullYear(), current.getMonth()+1, 1))}><Text style={styles.monthArrow}>›</Text></Pressable></View></Surface>
    {loading && budgets.length === 0 ? <ActivityIndicator accessibilityLabel={t("loading")} color={colors.link} style={styles.loader} /> : null}
    {error ? <ConnectionNotice hasData={budgets.length > 0} onRetry={() => void refresh()} /> : null}
    {periodError ? <Text accessibilityLiveRegion="polite" style={styles.error}>{t(periodError)}</Text> : null}
    {splitError ? <Text accessibilityLiveRegion="polite" style={styles.error}>{t(splitError)}</Text> : null}
    {budgets.length === 0 && !loading ? <EmptyState description={t("emptyDescription")} title={t("emptyTitle")} /> : <View style={styles.stack}>{budgets.map((budget) => {
      const visual = appearances[budget.id] ?? defaultPocketAppearance(budget.id, budget.name);
      const periodLimit = localMode ? guest.data.planningPeriods[`${monthText}:${budget.id}`] ?? null : periodLimits?.month === monthText ? periodLimits.limits[budget.id] ?? null : null;
      const ready = localMode || cloudSplits?.month === monthText;
      const base = budgetOverview(budget, monthText, transactions, periodLimit, !localMode && cloudSplits?.month === monthText ? cloudSplits.splits : []);
      const spent = localMode ? guestBudgetSpent(guest.data, budget, monthText) : base.spent;
      const { limit: monthlyLimit } = base;
      const percent = monthlyLimit > 0 ? Math.round(spent / monthlyLimit * 100) : 0;
      return <Surface key={budget.id} style={{ ...styles.budgetCard, backgroundColor: colors[visual.tone], borderRadius: 30, borderBottomLeftRadius: 14 }}>
        <View style={cardStyles.header}><View style={cardStyles.icon}><PaperArt id={resolvePaperAsset(visual.assetId)} style={{ width: 44, height: 44 }} /></View><View style={styles.budgetCopy}><Text style={styles.name}>{budget.name}</Text><Text style={styles.hint}>{t("monthlyBudget")}</Text></View><IconButton icon="dots-vertical" label={t("manageBudget",{name:budget.name})} onPress={() => { setMessage(null); setManagingId(budget.id); }} /></View>
        {ready ? <><View accessibilityRole="progressbar" accessibilityLabel={t("spendingLabel",{name:budget.name})} accessibilityValue={{ min: 0, max: 100, now: Math.min(100, Math.max(0, percent)), text: t("percentLimit",{percent}) }} style={styles.progressTrack}><View style={[styles.progressFill, { width: `${Math.min(100, Math.max(0, percent))}%`, backgroundColor: spent > monthlyLimit ? colors.expense : colors.mauve }]} /></View><Text style={styles.hint}>{spent > monthlyLimit ? t("exceeded") : t("used",{percent})}</Text></> : <Text style={styles.hint}>{splitError ? t("spentUnavailable") : t("loadingSplits")}</Text>}
        <View style={cardStyles.stats}>{[{ label: t("spent"), value: ready ? money(spent) : "—" }, { label: spent > monthlyLimit ? t("overLimit") : t("remaining"), value: ready ? money(Math.abs(monthlyLimit - spent)) : "—" }, { label: t("limit"), value: money(monthlyLimit) }].map((stat) => <View key={stat.label} style={[cardStyles.stat, { minWidth: 86 * fontScale }]}><Text style={styles.hint}>{stat.label}</Text><Text style={cardStyles.value}>{stat.value}</Text></View>)}</View>
      </Surface>;
    })}</View>}
    {appearanceError && <Text accessibilityRole="alert" style={styles.error}>{designCopy("pocketCreatedArtError")}</Text>}
    {message && !showCreate && !editing ? <Text accessibilityLiveRegion="polite" style={styles.error}>{t(message)}</Text> : null}
    <ActionSheet title={managing?.name ?? t("title")} visible={Boolean(managing)} onClose={() => setManagingId(null)}>
      {managing ? <View style={styles.stack}><MenuRow icon="palette-outline" title={designCopy("pocketAppearance")} onPress={() => { setAppearance(appearances[managing.id] ?? defaultPocketAppearance(managing.id, managing.name)); setAppearanceId(managing.id); setManagingId(null); setAppearanceError(false); }} /><MenuRow icon="pencil-outline" title={t("editDefault")} onPress={() => { setEditedLimit(String(managing.defaultLimit)); setEditingId(managing.id); setManagingId(null); }} /><MenuRow icon="receipt-text-outline" title={t("viewTransactions")} onPress={() => { setManagingId(null); router.push({ pathname: routes.transactions, params: { categoryId: managing.categoryId, month: monthText } }); }} /><DangerAction label={t("archive")} disabled={busy} onPress={() => Alert.alert(t("archiveTitle"), t("archiveDescription"), [{ text: t("cancel"), style: "cancel" }, { text: t("confirmArchive"), style: "destructive", onPress: () => { setManagingId(null); void archiveBudget(managing.id, managing.version); } }])} /></View> : null}
    </ActionSheet>
    <ActionSheet title={t("editLimit")} visible={Boolean(editing)} onClose={() => setEditingId(null)}>
      {editing ? <View style={styles.stack}><Text style={styles.name}>{editing.name}</Text><TextInput money accessibilityLabel={t("editLimitLabel",{name:editing.name})} keyboardType="number-pad" onChangeText={setEditedLimit} value={editedLimit} />{message ? <Text accessibilityLiveRegion="polite" style={styles.error}>{t(message)}</Text> : null}<PrimaryAction label={t("saveLimit")} busy={busy} onPress={() => void saveLimit(editing.id, editing.version)} /></View> : null}
    </ActionSheet>
    <SectionTitle title={t("create")} action={showCreate ? t("collapse") : t("addNew")} onAction={() => setShowCreate(!showCreate)} />
    <ActionSheet title={language === "vi" ? "Thêm một chiếc túi" : "Add a pocket"} visible={showCreate} onClose={() => setShowCreate(false)}><Surface style={{ padding: 0, borderWidth: 0, backgroundColor: "transparent" }}><PocketAppearancePicker value={appearance} onChange={setAppearance} name={budgetName.trim() || selected?.name || designCopy("pocketName")} amount={parsePaymentAmount(limit) !== null ? money(parsePaymentAmount(limit)!) : "—"} disabled={busy} /><View style={{ flexDirection: fontScale > 1.3 ? "column" : "row", gap: 12 }}><View style={{ flex: 1 }}><Text style={styles.fieldLabel}>{designCopy("pocketName")}</Text><TextInput accessibilityLabel={designCopy("pocketName")} value={budgetName} maxLength={80} onChangeText={setBudgetName} placeholder={selected?.name} style={styles.input} /></View><View style={{ flex: 1 }}><Text style={styles.fieldLabel}>{t("monthlyLimit")}</Text><TextInput money accessibilityLabel={t("monthlyLimitLabel")} keyboardType="number-pad" onChangeText={setLimit} placeholder={t("limitPlaceholder")} placeholderTextColor={colors.muted} style={styles.input} value={limit} /></View></View><Text style={styles.fieldLabel}>{t("category")}</Text>{expenseCategories.length === 0 && <View style={{ marginBottom: 12 }}><Text style={styles.fieldHelp}>{designCopy("pocketNoCategory")}</Text><MenuRow icon="plus" title={designCopy("pocketAddCategory")} onPress={() => { setShowCreate(false); router.push(routes.newCategory); }} /></View>}<View accessibilityRole="radiogroup" style={styles.choices}>{expenseCategories.map((category) => { const active=selected?.id===category.id; return <Pressable accessibilityRole="radio" accessibilityState={{checked:active}} key={category.id} onPress={() => setCategoryId(category.id)} style={[styles.choice,active&&styles.choiceActive]}><Text style={[styles.choiceText,active&&styles.choiceTextActive]}>{category.name}</Text></Pressable>; })}</View>

      <Text style={styles.fieldHelp}>{t("reminderHelp")}</Text>{message ? <Text accessibilityLiveRegion="polite" role="alert" style={styles.error}>{t(message)}</Text> : null}
      <Pressable accessibilityRole="button" accessibilityState={{busy, disabled: busy || !selected}} disabled={busy || !selected} onPress={() => void add()} style={({pressed})=>[styles.primary,pressed&&styles.pressed]}>{busy?<ActivityIndicator accessibilityLabel={t("creating")} color={colors.onPrimary}/>:<Text style={styles.primaryText}>{t("create")}</Text>}</Pressable>
    </Surface></ActionSheet>
    <ActionSheet title={designCopy("pocketAppearance")} visible={Boolean(appearanceId)} onClose={() => { if (!busy) setAppearanceId(null); }}>
      <PocketAppearancePicker value={appearance} onChange={setAppearance} name={budgets.find(budget => budget.id === appearanceId)?.name ?? ""} amount={money(budgets.find(budget => budget.id === appearanceId)?.defaultLimit ?? 0)} disabled={busy} />
      {appearanceError && <Text accessibilityRole="alert" style={styles.error}>{designCopy("pocketAppearanceError")}</Text>}
      <PrimaryAction label={designCopy("pocketAppearanceSave")} busy={busy} onPress={() => {
        if (!appearanceId || busy) return;
        setBusy(true); setAppearanceError(false);
        void saveAppearance(appearanceId, appearance).then(() => setAppearanceId(null)).catch(() => setAppearanceError(true)).finally(() => setBusy(false));
      }} />
    </ActionSheet>
  </PicketScreen>;
}

const createCardStyles = (colors: MobileThemeColors) => StyleSheet.create({ header: { flexDirection: "row", alignItems: "center", gap: 12 }, icon: { width: 44, height: 44, borderRadius: 16, backgroundColor: colors.cream, alignItems: "center", justifyContent: "center" }, stats: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 12 }, stat: { flex: 1, flexGrow: 1 }, value: { color: colors.ink, fontSize: 15, fontWeight: "700", marginTop: 4 } });
const createStyles = (colors: MobileThemeColors) => StyleSheet.create({appBar:{alignItems:"center",flexDirection:"row",justifyContent:"space-between",minHeight:52},monthRow:{alignItems:"center",flexDirection:"row",justifyContent:"space-between"},monthArrow:{color:colors.link,fontSize:30},back:{color:colors.link,fontSize:15,fontWeight:"700"},link:{color:colors.link,fontSize:13,fontWeight:"700",marginTop:12},heading:{color:colors.ink,fontSize:26,fontWeight:"800",letterSpacing:-.8,marginTop:18},subtitle:{color:colors.muted,fontSize:15,lineHeight:22,marginBottom:22,marginTop:7},loader:{marginVertical:38},errorCard:{backgroundColor:colors.dangerSurface,borderRadius:paperShape.card,marginBottom:14,padding:16},error:{color:colors.danger,fontSize:13,fontWeight:"700",lineHeight:19},hint:{color:colors.text,fontSize:12,lineHeight:18,marginTop:4},stack:{gap:12},budgetCard:{padding:18},budgetHead:{alignItems:"flex-start",flexDirection:"row",gap:14,justifyContent:"space-between"},budgetCopy:{flex:1},name:{color:colors.ink,fontSize:17,fontWeight:"700"},amount:{color:colors.ink,fontSize:16,fontWeight:"800"},progressTrack:{backgroundColor:colors.cream,borderRadius:4,height:7,marginTop:18,overflow:"hidden"},progressFill:{backgroundColor:colors.coral,borderRadius:4,height:7},archive:{color:colors.expense,fontSize:12,fontWeight:"700",marginTop:15},fieldLabel:{color:colors.ink,fontSize:13,fontWeight:"700",marginBottom:9,marginTop:4},choices:{flexDirection:"row",flexWrap:"wrap",gap:8,marginBottom:18},choice:{backgroundColor:colors.cream,borderColor:colors.peach,borderRadius:paperShape.chip,borderWidth:1,paddingHorizontal:13,paddingVertical:10},choiceActive:{backgroundColor:colors.mauve,borderColor:colors.primaryOutline},choiceText:{color:colors.ink,fontSize:13,fontWeight:"700"},choiceTextActive:{color: colors.onPrimary},input:{backgroundColor:colors.white,borderColor:colors.controlBorder,borderRadius:paperShape.input,borderWidth:1,color:colors.ink,fontSize:16,minHeight:paperControl.height,paddingHorizontal:16},fieldHelp:{color:colors.muted,fontSize:12,lineHeight:18,marginBottom:18,marginTop:8},primary:{alignItems:"center",backgroundColor:colors.mauve,borderRadius:paperShape.button,justifyContent:"center",minHeight:paperControl.height},primaryText:{color: colors.onPrimary,fontSize:15,fontWeight:"700"},pressed:{opacity:.72}});
