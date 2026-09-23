import type { CSSProperties, ReactNode } from "react";

export type SelectMode = "single" | "multiple" | "combobox";
export type SelectAppearance = "default" | "unstyled";
export type SelectVariant = "classic" | "soft" | "outline" | "filled" | "pill" | "compact" | "dark" | "minimal";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
  keywords?: string[];
}

export interface SelectClassNames {
  root?: string;
  trigger?: string;
  value?: string;
  popup?: string;
  search?: string;
  option?: string;
  empty?: string;
  footer?: string;
}

export interface SelectIcons {
  chevron?: ReactNode;
  clear?: ReactNode;
  check?: ReactNode;
}

export interface SelectProps {
  mode?: SelectMode;
  options?: SelectOption[];
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  onChange?: (value: string | string[]) => void;
  loadOptions?: (query: string) => Promise<SelectOption[]>;
  onSearchChange?: (query: string) => void;
  searchable?: boolean;
  allowCustomValue?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  errorMessage?: string;
  label?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  clearable?: boolean;
  closeOnSelect?: boolean;
  maxSelectedLabels?: number;
  className?: string;
  classNames?: SelectClassNames;
  appearance?: SelectAppearance;
  variant?: SelectVariant;
  icons?: SelectIcons;
  style?: CSSProperties;
  renderOption?: (option: SelectOption, state: { selected: boolean; active: boolean }) => ReactNode;
}
