export const lightTheme = {
  canvas: "#FFFDF9", surface: "#FFFFFF", elevated: "#FFE1CB", text: "#342326", muted: "#705059",
  primary: "#9B3E60", onPrimary: "#FFFFFF", border: "#D6B9BF", expense: "#BD3152", income: "#147D62",
  dangerSurface: "#FBEFF2", successSurface: "#E8F5EF", disabledSurface: "#EFE9E5", disabledText: "#705F64",
} as const;
export type AppTheme = { [Key in keyof typeof lightTheme]: string };
export const darkTheme: AppTheme = {
  canvas: "#181518", surface: "#251F24", elevated: "#382A32", text: "#FAEDF0", muted: "#D2BBC2",
  primary: "#F5AAC5", onPrimary: "#331621", border: "#896C78", expense: "#FF9CB4", income: "#78DDB6",
  dangerSurface: "#42212E", successSurface: "#173B30", disabledSurface: "#362E34", disabledText: "#BDAAB3",
};
