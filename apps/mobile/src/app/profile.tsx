import { paperControl , paperShape, paperSpace } from "@/core/theme/paper-foundations";
import { PicketScrollView as ScrollView } from "@/core/ui/picket-scroll-view";
import { PicketText as Text } from "@/core/ui/picket-text";

import { useTranslation } from "react-i18next";
import { useMobileStyles } from "@/core/theme/use-mobile-styles";
import type { MobileThemeColors } from "@/core/theme/mobile-theme-adapter";
import type { CurrentProfile, Entitlements } from "@picket/domain";
import { Redirect, router } from "expo-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { PicketTextInput as TextInput } from "@/core/ui/picket-text-input";
import { ActivityIndicator, Alert, Linking, StyleSheet, Switch, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { picketApi } from "@/core/api/client";
import { routes } from "@/core/navigation/routes";
import { exportAndShareFinance } from "@/core/export/export-finance";
import { exportEncryptedBackup, exportFinanceCsv, exportGuestBackup } from "@/core/export/flutter-compatible-backup";
import { useGuestFinance } from "@/core/local/guest-finance-context";
import { AccessiblePressable as Pressable } from "@/core/ui/accessible-pressable";
import { AppIcon } from "@/core/ui/app-icon";
import { ChoiceChip, IconButton, MenuRow, SectionTitle, Surface, TopAppBar } from "@/core/ui/picket-ui";
import { useAuth } from "@/features/auth/auth-context";
import { isStaff } from "@/features/admin/admin-mobile";
import { useProfile } from "@/features/profile/profile-context";
import { useDeviceLock } from "@/features/security/device-lock";
import { AppUpdateSection, InstalledVersion } from "@/features/updates/app-update-section";
import { pendingMutationCount, mutationConflictCount } from "@/core/sync/mutation-queue";
import { signOutCopy } from "@/features/profile/sign-out-copy";

const personas = ["Đi làm", "Sinh viên", "Tự do", "Gia đình"] as const;
const goals = ["Hiểu chi tiêu", "Tiết kiệm", "Quản lý hóa đơn"] as const;
const currencies = ["VND", "USD"] as const;

export default function ProfileScreen() {
  const {t}=useTranslation("profile");
  const { colors, styles } = useMobileStyles(createStyles);
  const { session, localMode } = useAuth();
  const { error, loading, profile, refresh } = useProfile();

  if (!session && !localMode) return <Redirect href={routes.login} />;
  if (loading && !profile) return <SafeAreaView style={[styles.safeArea, styles.fallbackPage]}><View style={[styles.center, styles.fallbackBody]}><ActivityIndicator accessibilityLabel={t("Đang tải hồ sơ")} color={colors.link} /></View><InstalledVersion /></SafeAreaView>;
  if (!profile) return <SafeAreaView style={[styles.safeArea, styles.fallbackPage]}><View style={[styles.center, styles.fallbackBody]}><Text style={styles.error}>{error ? t(error,{defaultValue:error}) : t("Chưa có hồ sơ lưu trên thiết bị. Hãy kết nối mạng rồi thử lại.")}</Text><Pressable accessibilityRole="button" onPress={() => void refresh()}><Text style={styles.back}>{t("Tải lại hồ sơ")}</Text></Pressable></View><InstalledVersion /></SafeAreaView>;

  return <ProfileForm key={profile.id} profile={profile} />;
}

function ProfileForm({ profile }: { profile: CurrentProfile }) {
  const {t}=useTranslation("profile");
  const { colors, styles, theme } = useMobileStyles(createStyles);
  const { session, localMode, leaveLocalMode, signOut } = useAuth();
  const { updatePreferences, updateProfile } = useProfile();
  const deviceLock = useDeviceLock();
  const guest = useGuestFinance();
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [persona, setPersona] = useState(profile.persona);
  const [goal, setGoal] = useState(profile.goal);
  const [currencyCode, setCurrencyCode] = useState(profile.currencyCode);
  const [visibilityDraft, setVisibilityDraft] = useState<boolean | null>(null);
  const hideBalance = visibilityDraft ?? profile.hideBalance;
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [entitlements, setEntitlements] = useState<Entitlements | null>(null);
  const [staff, setStaff] = useState(false);
  const [backupPassword, setBackupPassword] = useState("");
  const [editingProfile, setEditingProfile] = useState(false);
  const [showBackup, setShowBackup] = useState(false);
  const signOutReading = useRef(false);
  const activeOwner = useRef(session?.user.id);
  useLayoutEffect(() => { activeOwner.current = session?.user.id; return () => { activeOwner.current = undefined; }; }, [session?.user.id]);

  async function changeVisibility(next: boolean) {
    if (visibilityDraft !== null) return;
    setVisibilityDraft(next); setMessage(null);
    try { await updatePreferences({ hide_balance: next }); }
    catch { setMessage("Chưa lưu được tùy chọn ẩn số dư. Hãy thử lại."); }
    finally { setVisibilityDraft(null); }
  }

  useEffect(() => {
    if (!session || !picketApi) return;
    let active = true;
    void picketApi.currentEntitlements(session.access_token)
      .then((result) => { if (active) setEntitlements(result); })
      .catch(() => { if (active) setEntitlements(null); });
    return () => { active = false; };
  }, [session]);

  useEffect(() => {
    let active = true;
    void isStaff().then((value) => { if (active) setStaff(value); }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  async function save() {
    if (!displayName.trim()) return setMessage("Tên hiển thị không được để trống.");
    setBusy(true);
    setMessage(null);
    try {
      await updateProfile({ display_name: displayName.trim(), locale: profile.locale, timezone: profile.timezone });
      await updatePreferences({ persona, goal, currency_code: currencyCode, hide_balance: hideBalance });
      setMessage(localMode ? "Đã lưu cài đặt trên thiết bị." : "Đã lưu và đồng bộ cài đặt.");
    } catch {
      setMessage("Không lưu được cài đặt. Hãy kiểm tra kết nối và thử lại.");
    } finally {
      setBusy(false);
    }
  }

  async function exportData() {
    if (!session) return;
    setBusy(true);
    setMessage(null);
    try {
      await exportAndShareFinance(session.access_token,session.user.id);
      setMessage("Đã tạo bản export. Hãy chọn nơi lưu an toàn.");
    } catch {
      setMessage("Chưa tạo được bản sao. Hãy kiểm tra kết nối và thử lại.");
    } finally {
      setBusy(false);
    }
  }

  async function exportExtra(kind: "csv" | "picket") {
    if (!session) return;
    setBusy(true);
    setMessage(null);
    try {
      if (kind === "csv") await exportFinanceCsv(session.access_token,session.user.id);
      else await exportEncryptedBackup(session.access_token, session.user.id, backupPassword);
      setMessage("Đã tạo file. Hãy chọn nơi lưu an toàn.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không tạo được bản sao.");
    } finally { setBusy(false); }
  }

  async function exportLocalBackup() {
    setBusy(true); setMessage(null);
    try { await exportGuestBackup(guest.data, backupPassword); setMessage("Đã tạo bản sao trên máy. Hãy lưu file và mật khẩu ở nơi an toàn."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Không tạo được bản sao."); }
    finally { setBusy(false); }
  }

  async function confirmSignOut() {
    if (busy || signOutReading.current) return;
    if (localMode) {
      Alert.alert(t("Thoát chế độ trên thiết bị?"), t("Dữ liệu trên máy được giữ riêng và sẽ hiện lại khi bạn chọn dùng không cần đăng nhập."), [
        { text: t("Hủy"), style: "cancel" },
        { text: t("Thoát"), onPress: () => { void leaveLocalMode().then(() => router.replace(routes.login)); } },
      ]);
      return;
    }
    const owner = session?.user.id;
    if (!owner) return;
    signOutReading.current = true;
    setBusy(true);
    let copy: "signOutClean" | "signOutPending";
    try {
      const [pending, conflicts] = await Promise.all([pendingMutationCount(owner), mutationConflictCount(owner)]);
      if (activeOwner.current !== owner) return;
      copy = signOutCopy(pending, conflicts);
    } catch {
      if (activeOwner.current === owner) setMessage("Không kiểm tra được đồng bộ. Hãy thử lại.");
      return;
    } finally { signOutReading.current = false; if (activeOwner.current === owner) setBusy(false); }
    Alert.alert(t("Đăng xuất?"), t(copy), [
      { text: t("Hủy"), style: "cancel" },
      {
        text: t("Đăng xuất"),
        onPress: () => {
          if (activeOwner.current !== owner) return;
          setBusy(true);
          setMessage(null);
          void (async () => {
            try {
              await signOut();
              router.replace(routes.login);
            } catch {
              setMessage("Không đăng xuất được. Hãy thử lại.");
            } finally {
              setBusy(false);
            }
          })();
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TopAppBar title={t("Cá nhân")} back={false} />
        <Surface style={styles.profileCard}><View style={styles.avatar}><AppIcon name="account" color={colors.onPrimary} size={26} /></View><View style={{ flex: 1 }}><Text numberOfLines={2} style={styles.profileName}>{profile.displayName || t("Bạn của Picket")}</Text><Text numberOfLines={localMode ? 2 : 1} ellipsizeMode={localMode ? "tail" : "middle"} style={styles.description}>{localMode ? t("Lưu riêng trên thiết bị") : session?.user.email}</Text></View><IconButton icon={editingProfile ? "close" : "pencil-outline"} label={editingProfile ? t("Đóng chỉnh sửa") : t("Chỉnh sửa hồ sơ")} onPress={() => setEditingProfile(!editingProfile)} /></Surface>
        {editingProfile && <Surface>
        <Text style={styles.label}>{t("Tên hiển thị")}</Text>
        <TextInput accessibilityLabel={t("Tên hiển thị")} maxLength={120} onChangeText={setDisplayName} style={styles.input} value={displayName} />
        <ChoiceGroup label={t("Nhịp sống")} options={personas} selected={persona} select={setPersona} />
        <ChoiceGroup label={t("Mục tiêu")} options={goals} selected={goal} select={setGoal} />
        <ChoiceGroup label={t("Tiền tệ chính")} options={currencies} selected={currencyCode} select={setCurrencyCode} />
        <Pressable accessibilityRole="button" disabled={busy} onPress={() => void save()} style={styles.primary}>{busy ? <ActivityIndicator accessibilityLabel={t("Đang lưu hồ sơ")} color={colors.onPrimary} /> : <Text style={styles.primaryText}>{t("Lưu thay đổi")}</Text>}</Pressable>
        </Surface>}
        <SectionTitle title={t("Tùy chọn và bảo mật")} />
        <MenuRow icon="palette-outline" title={t("Giao diện", { defaultValue: "Giao diện" })} description={t("Bảng màu và chế độ sáng/tối", { defaultValue: "Bảng màu và chế độ sáng/tối" })} onPress={() => router.push(routes.appearance)} />
        <View style={styles.switchRow}><View style={styles.switchCopy}><Text style={styles.switchTitle}>{t("Ẩn số dư")}</Text><Text style={styles.switchDescription}>{t("Che số tiền trên màn hình tổng quan.")}</Text></View><Switch accessibilityLabel={t("Ẩn số dư")} disabled={visibilityDraft !== null} hitSlop={12} onValueChange={(next) => void changeVisibility(next)} thumbColor={theme === "dark" && !hideBalance ? colors.muted : colors.white} trackColor={{ false: colors.peach, true: colors.mauve }} value={hideBalance} /></View>
        <View style={styles.switchRow}><View style={styles.switchCopy}><Text style={styles.switchTitle}>{t("Khóa ứng dụng")}</Text><Text style={styles.switchDescription}>{t("Yêu cầu sinh trắc học hoặc mã khóa thiết bị khi mở lại Picket.")}</Text></View><Switch accessibilityLabel={t("Khóa ứng dụng")} disabled={deviceLock.busy} hitSlop={12} onValueChange={(next) => void deviceLock.setEnabled(next).then((saved) => { if (!saved) setMessage("Chưa thể đổi khóa. Hãy thiết lập mã khóa thiết bị rồi thử lại."); })} thumbColor={theme === "dark" && !deviceLock.enabled ? colors.muted : colors.white} trackColor={{ false: colors.peach, true: colors.mauve }} value={deviceLock.enabled} /></View>
        {entitlements && <View style={styles.planCard}><Text style={styles.planTitle}>Picket {entitlements.tier.toUpperCase()}</Text><Text style={styles.planText}>{t("ocrRemaining",{remaining:entitlements.ocrFallbackRemaining,limit:entitlements.ocrFallbackDailyLimit})}</Text></View>}
        {message && <Text accessibilityLiveRegion="polite" style={message.startsWith("Đã") ? styles.success : styles.error}>{t(message,{defaultValue:message})}</Text>}
        <SectionTitle title={t("Công cụ của bạn")} />
        <Surface style={styles.menuGroup}>
        <MenuRow disabled={busy} icon="calendar-check-outline" illustration="receipt" title={t("Hóa đơn cần thanh toán")} onPress={() => router.push(routes.bills)} />
        <MenuRow disabled={busy} icon="repeat" title={t("Chi phí định kỳ")} onPress={() => router.push(routes.subscriptions)} />
        <MenuRow disabled={busy} icon="shape-outline" illustration="shopping" title={t("Quản lý danh mục")} onPress={() => router.push(routes.categories)} />
        <MenuRow disabled={busy} icon="chart-box-outline" title={t("Thống kê thu chi")} onPress={() => router.push(routes.insights)} />
        <MenuRow disabled={busy} icon="image-multiple-outline" illustration="gift" title={t("Bộ sưu tập kỷ vật")} onPress={() => router.push(routes.keepsakes)} />
        <MenuRow disabled={busy} icon="bell-outline" title={t("Thông báo và nhắc việc")} onPress={() => router.push(routes.notifications)} />
        </Surface>
        <SectionTitle title={t("Tài khoản và dữ liệu")} />
        <Surface style={styles.menuGroup}>
        {!localMode && <MenuRow disabled={busy} icon="crown-outline" title={t("Gói Picket và thanh toán")} onPress={() => router.push(routes.billing)} />}
        <MenuRow icon="cloud-upload-outline" title={t("Sao lưu và xuất dữ liệu")} description={t("Bản sao mã hóa, JSON và CSV")} onPress={() => setShowBackup(!showBackup)} />
        <MenuRow disabled={busy} icon="backup-restore" title={t("Khôi phục từ bản sao")} onPress={() => router.push(routes.restore)} />
        <MenuRow disabled={busy} icon="sync" title={t("Kiểm tra đồng bộ")} onPress={() => router.push(routes.syncConflicts)} />
        {!localMode && staff && <MenuRow disabled={busy} icon="shield-account-outline" title={t("Quản trị Picket")} onPress={() => router.push(routes.admin)} />}
        </Surface>
        {showBackup && <Surface>
        {!localMode && <MenuRow disabled={busy} icon="file-code-outline" title={t("Xuất dữ liệu JSON")} onPress={() => void exportData()} />}
        {!localMode && <MenuRow disabled={busy} icon="file-table-outline" title={t("Xuất giao dịch CSV")} onPress={() => void exportExtra("csv")} />}
        <TextInput accessibilityLabel={t("Mật khẩu bản sao mã hóa")} autoCapitalize="none" autoComplete="off" onChangeText={setBackupPassword} placeholder={t("Mật khẩu riêng, ít nhất 12 ký tự")} secureTextEntry style={styles.input} value={backupPassword} />
        <Pressable accessibilityRole="button" disabled={busy || backupPassword.length < 12 || (localMode && guest.loading)} onPress={() => void (localMode ? exportLocalBackup() : exportExtra("picket"))} style={styles.secondary}><Text style={styles.secondaryText}>{t("Tạo bản sao .picket có ảnh")}</Text></Pressable>
        <Text style={styles.sensitive}>{t("Bản export chứa dữ liệu tài chính nhạy cảm. Chỉ lưu ở nơi bạn tin cậy.")}</Text>
        </Surface>}
        <AppUpdateSection />
        <Pressable accessibilityRole="button" disabled={busy} onPress={confirmSignOut} style={styles.signOut}><Text style={styles.signOutText}>{localMode ? t("Thoát chế độ trên máy") : t("Đăng xuất")}</Text></Pressable>
        {!localMode && <Pressable accessibilityRole="button" disabled={busy} onPress={() => router.push(routes.deleteAccount)} style={styles.deleteLink}><Text style={styles.deleteText}>{t("Xóa tài khoản")}</Text></Pressable>}
        <Surface>
          <MenuRow icon="shield-outline" title={t("Chính sách quyền riêng tư")} onPress={() => void Linking.openURL("https://picket.51-79-207-154.sslip.io/privacy.html").catch(() => setMessage("Chưa mở được trang. Hãy kiểm tra kết nối và thử lại."))} />
          <MenuRow icon="help-circle-outline" title={t("Hỗ trợ và yêu cầu xóa dữ liệu")} onPress={() => void Linking.openURL("https://picket.51-79-207-154.sslip.io/account-deletion.html").catch(() => setMessage("Chưa mở được trang. Hãy kiểm tra kết nối và thử lại."))} />
        </Surface>
        <InstalledVersion />
      </ScrollView>
    </SafeAreaView>
  );
}

function ChoiceGroup<T extends string>({ label, options, selected, select }: { label: string; options: readonly T[]; selected: string; select(value: T): void }) {
  const {t}=useTranslation("profile");
  const { styles } = useMobileStyles(createStyles);
  return <View><Text style={styles.label}>{label}</Text><View style={styles.choices}>{options.map((option) => <ChoiceChip checked={selected === option} key={option} label={t(option,{defaultValue:option})} onPress={() => select(option)} />)}</View></View>;
}

const createStyles = (colors: MobileThemeColors) => StyleSheet.create({
  fallbackPage: { paddingBottom: 140 },
  fallbackBody: { flex: 1, width: "100%", paddingHorizontal: 20 },
  profileCard: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 }, avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.mauve, alignItems: "center", justifyContent: "center" }, profileName: { color: colors.ink, fontSize: 20, lineHeight: 28, fontWeight: "700" }, menuGroup: { paddingVertical: 4 },
  signOut: { alignItems: "center", borderColor: colors.border, borderRadius: paperShape.button, borderWidth: 1, justifyContent: "center", minHeight: paperControl.height },
  signOutText: { color: colors.ink, fontSize: 15, fontWeight: "700" },
  safeArea: { backgroundColor: colors.cream, flex: 1 }, center: { alignItems: "center", justifyContent: "center" }, content: { maxWidth: 720, width: "100%", alignSelf: "center", gap: 8, padding: paperSpace.screen, paddingBottom: 140 }, header: { minHeight: 38 }, back: { color: colors.link, fontSize: 14, fontWeight: "700", paddingVertical: 12 }, title: { color: colors.ink, fontSize: 26, fontWeight: "700", lineHeight: 38 }, description: { color: colors.muted, fontSize: 13, lineHeight: 20 }, label: { color: colors.ink, fontSize: 14, fontWeight: "600", marginTop: 16, marginBottom: 8 }, input: { backgroundColor: colors.cream, borderColor: colors.controlBorder, borderRadius: paperShape.input, borderWidth: 1, color: colors.ink, fontSize: 16, minHeight: paperControl.height, paddingHorizontal: 15 }, choices: { flexDirection: "row", flexWrap: "wrap", gap: 8 }, choice: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: paperShape.chip, borderWidth: 1, minHeight: 48, justifyContent: "center", paddingHorizontal: 15 }, choiceSelected: { backgroundColor: colors.mauve, borderColor: colors.primaryOutline }, choiceText: { color: colors.ink, fontSize: 14, fontWeight: "600" }, choiceTextSelected: { color: colors.onPrimary }, switchRow: { alignItems: "center", backgroundColor: colors.white, borderRadius: paperShape.card, flexDirection: "row", gap: 14, minHeight: 64, padding: 12 }, switchCopy: { flex: 1 }, switchTitle: { color: colors.ink, fontSize: 15, fontWeight: "600" }, switchDescription: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 3 }, planCard: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: paperShape.card, borderWidth: 1, gap: 5, padding: 16 }, planTitle: { color: colors.ink, fontSize: 15, fontWeight: "700" }, planText: { color: colors.muted, fontSize: 13, lineHeight: 19 }, primary: { alignItems: "center", backgroundColor: colors.mauve, borderRadius: paperShape.button, justifyContent: "center", marginTop: 20, minHeight: paperControl.height }, primaryText: { color: colors.onPrimary, fontSize: 15, fontWeight: "700" }, secondary: { alignItems: "center", borderColor: colors.primaryOutline, borderRadius: paperShape.button, borderWidth: 1, justifyContent: "center", minHeight: paperControl.height }, secondaryText: { color: colors.link, fontSize: 15, fontWeight: "700" }, sensitive: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 12 }, deleteLink: { alignItems: "center", minHeight: 48, justifyContent: "center" }, deleteText: { color: colors.danger, fontSize: 14, fontWeight: "700" }, error: { color: colors.danger, fontSize: 14 }, success: { color: colors.income, fontSize: 14, fontWeight: "600" },
});
