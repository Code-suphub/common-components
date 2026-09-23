export interface CommonAntdTokens {
  colorPrimary: string;
  colorSuccess: string;
  colorWarning: string;
  colorError: string;
  colorText: string;
  colorTextSecondary: string;
  colorBorder: string;
  colorBgContainer: string;
  colorBgLayout: string;
  borderRadius: number;
  controlHeight: number;
  fontFamily: string;
}

export interface CommonAntdThemeOverrides {
  token?: Partial<CommonAntdTokens>;
}

export const commonAntdTokens = {
  colorPrimary: "#527b61",
  colorSuccess: "#4f8a62",
  colorWarning: "#b98232",
  colorError: "#bd584b",
  colorText: "#29332c",
  colorTextSecondary: "#778176",
  colorBorder: "#d9ded7",
  colorBgContainer: "#ffffff",
  colorBgLayout: "#f5f6f2",
  borderRadius: 8,
  controlHeight: 36,
  fontFamily: 'Manrope, "Noto Sans SC", sans-serif',
} satisfies CommonAntdTokens;

export const commonAntdTheme = { token: commonAntdTokens };

/** Returns a ConfigProvider-compatible theme object with shared defaults and local token overrides. */
export function createCommonAntdTheme(overrides: CommonAntdThemeOverrides = {}) {
  return {
    ...commonAntdTheme,
    token: {
      ...commonAntdTokens,
      ...overrides.token,
    },
  };
}
