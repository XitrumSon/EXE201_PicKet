import { lightTheme, darkTheme, type AppTheme } from "./themes";
export const colorSchemes = {
  rose: { name: "Rose", light: lightTheme, dark: darkTheme },
  ocean: { name: "Ocean", light: { ...lightTheme, primary: "#075E83", onPrimary: "#FFFFFF", elevated: "#DCEFFA" }, dark: { ...darkTheme, primary: "#8ED5FA", onPrimary: "#102B3A", elevated: "#193646" } },
} satisfies Record<string, { name: string; light: AppTheme; dark: AppTheme }>;
export type ColorSchemeId = keyof typeof colorSchemes;
export const colorSchemeIds = Object.keys(colorSchemes) as ColorSchemeId[];
export function resolveColorScheme(id?: string) { return colorSchemeIds.find(code => code === id) ?? "rose"; }
