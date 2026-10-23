import { normalizeLanguage } from "../../core/i18n/formatters";
export type ThemeMode = "system" | "light" | "dark";
export type LanguageMode = "system" | "vi" | "en";
export type DeviceSettings = { version: 1; themeMode?: ThemeMode; languageMode?: LanguageMode };
type Defaults = { theme?: "light" | "dark"; locale?: string | null };
export function parseDeviceSettings(raw: string | null): DeviceSettings {
  if (raw === null) return { version: 1 };
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid device settings");
  const data = value as Record<string, unknown>;
  if (data.version !== 1 || (data.themeMode !== undefined && !["system", "light", "dark"].includes(String(data.themeMode))) ||
    (data.languageMode !== undefined && !["system", "vi", "en"].includes(String(data.languageMode)))) throw new Error("Unsupported device settings");
  return { version: 1, ...(data.themeMode === undefined ? {} : { themeMode: data.themeMode as ThemeMode }), ...(data.languageMode === undefined ? {} : { languageMode: data.languageMode as LanguageMode }) };
}
export function resolveAppearance(device: DeviceSettings, account: Defaults, system: Defaults) {
  return {
    theme: device.themeMode === "system" ? system.theme ?? "light" : device.themeMode ?? account.theme ?? system.theme ?? "light",
    language: device.languageMode === "system" ? normalizeLanguage(system.locale) : device.languageMode ?? normalizeLanguage(account.locale ?? system.locale),
  };
}
export function createSettingsStore(storage: { read(): Promise<string | null>; write(value: string): Promise<void> }) {
  let pending: Promise<void> = Promise.resolve();
  return {
    async load() { await pending.catch(() => undefined); return parseDeviceSettings(await storage.read()); },
    save(value: DeviceSettings) {
      const serialized = JSON.stringify(parseDeviceSettings(JSON.stringify(value)));
      const operation = pending.catch(() => undefined).then(() => storage.write(serialized));
      pending = operation;
      return operation;
    },
  };
}
