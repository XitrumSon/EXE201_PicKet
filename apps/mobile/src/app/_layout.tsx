import { useTranslation } from "react-i18next";
import "@/core/export/native-backup-key";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { bootstrapIntentGate } from "@/core/navigation/bootstrap-intent";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ActivityIndicator, View } from "react-native";
import { canMountSessionRoutes } from "@/features/auth/session-route-policy";

import { AuthProvider, useAuth } from "@/features/auth/auth-context";
import { AccountsProvider } from "@/features/accounts/accounts-context";
import { ProfileProvider } from "@/features/profile/profile-context";
import { TransactionsProvider } from "@/features/transactions/transactions-context";
import { BudgetsProvider } from "@/features/budgets/budgets-context";
import { BillsProvider } from "@/features/bills/bills-context";
import { SubscriptionsProvider } from "@/features/subscriptions/subscriptions-context";
import { SyncProvider } from "@/features/sync/sync-context";
import { DeviceLockProvider } from "@/features/security/device-lock";
import { ReminderCoordinator } from "@/features/notifications/reminder-coordinator";
import { GuestFinanceProvider } from "@/core/local/guest-finance-context";
import { NavigationShell } from "@/core/ui/navigation-shell";
import { AppAppearanceProvider, useAppTheme } from "@/features/settings/appearance-provider";
import { AccountAppearance } from "@/features/settings/account-appearance";
import { LearningSync } from "@/features/learning/learning-sync";
import { PlayBillingProvider } from "@/features/billing/play-billing-provider";
import { ScheduleSync } from "@/features/cashflow/schedule-sync";
import * as SplashScreen from "expo-splash-screen";

void SplashScreen.preventAutoHideAsync();

function ProviderTree({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <AccountAppearance />
      <LearningSync />
      <ScheduleSync />
      <PlayBillingProvider><AccountsProvider>
        <TransactionsProvider><BudgetsProvider><BillsProvider><SubscriptionsProvider><SyncProvider><ReminderCoordinator />{children}</SyncProvider></SubscriptionsProvider></BillsProvider></BudgetsProvider></TransactionsProvider>
      </AccountsProvider></PlayBillingProvider>
    </ProfileProvider>
  );
}

function SessionProviders({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const { localMode } = useAuth();
  return <GuestFinanceProvider key={session?.user.id ?? (localMode ? "device-guest" : "anonymous")}><ProviderTree key={session?.user.id ?? (localMode ? "device-guest" : "anonymous")}>{children}</ProviderTree></GuestFinanceProvider>;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppAppearanceProvider><AuthProvider>
        <SessionReadyTree />
      </AuthProvider></AppAppearanceProvider>
    </SafeAreaProvider>
  );
}

function SessionReadyTree() {
  const { theme, colors } = useAppTheme();
  const { t } = useTranslation("common");
  const { loading } = useAuth();
  // Effects run after the ready render commits its Stack. Do not signal from
  // auth recovery itself, where a nested navigator may not exist yet.
  useEffect(() => { if (!loading) bootstrapIntentGate.ready(); }, [loading]);
  if (!canMountSessionRoutes(loading)) return <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.canvas }}>
    <ActivityIndicator accessibilityLabel={t("Đang khôi phục phiên Picket")} color={colors.primary} />
  </View>;
  return (
        <DeviceLockProvider>
          <SessionProviders>
            <StatusBar style={theme === "dark" ? "light" : "dark"} />
            <Stack screenOptions={{ headerShown: false }} />
            <NavigationShell />
          </SessionProviders>
        </DeviceLockProvider>
  );
}
