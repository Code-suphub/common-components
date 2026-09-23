import type { SelectClassNames, SelectVariant } from "./types";

const base: SelectClassNames = {
  root: "w-full text-sm text-slate-900",
  trigger: "flex min-h-10 w-full items-center justify-between gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-left shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
  value: "min-w-0 flex-1 truncate",
  popup: "mt-1 rounded-lg border border-slate-200 bg-white p-1 shadow-lg",
  search: "mb-1 w-full rounded-md border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500",
  option: "flex min-h-9 w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 data-[selected]:bg-blue-50 disabled:opacity-40",
  empty: "px-3 py-4 text-center text-sm text-slate-500",
  footer: "flex justify-between gap-2 border-t border-slate-200 p-2",
};

/** Tailwind style presets. The consuming app must scan this package's source. */
export const tailwindSelectVariants: Record<SelectVariant, SelectClassNames> = {
  classic: base,
  soft: { ...base, root: "w-full text-sm text-slate-800", trigger: "flex min-h-10 w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-blue-400", popup: "mt-1 rounded-xl border border-slate-200 bg-white p-1 shadow-xl", option: "flex min-h-9 w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left hover:bg-slate-100 data-[selected]:bg-blue-100" },
  outline: { ...base, trigger: "flex min-h-10 w-full items-center justify-between gap-2 rounded-md border border-slate-500 bg-transparent px-3 py-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-slate-500", popup: "mt-1 rounded-md border border-slate-300 bg-white p-1 shadow-md" },
  filled: { ...base, trigger: "flex min-h-10 w-full items-center justify-between gap-2 rounded-lg border border-transparent bg-slate-100 px-3 py-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-500", popup: "mt-1 rounded-lg border border-slate-200 bg-white p-1 shadow-lg" },
  pill: { ...base, trigger: "flex min-h-10 w-full items-center justify-between gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-left shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-500", popup: "mt-1 rounded-xl border border-slate-200 bg-white p-1 shadow-lg", option: "flex min-h-9 w-full items-center justify-between gap-2 rounded-full px-3 py-2 text-left hover:bg-slate-100 data-[selected]:bg-blue-50" },
  compact: { ...base, root: "w-full min-w-36 text-xs text-slate-900", trigger: "flex min-h-8 w-full items-center justify-between gap-2 rounded border border-slate-300 bg-white px-2 py-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-500", popup: "mt-1 rounded border border-slate-200 bg-white p-1 shadow-md" },
  dark: { ...base, root: "w-full text-sm text-slate-100", trigger: "flex min-h-10 w-full items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-400", popup: "mt-1 rounded-lg border border-slate-700 bg-slate-900 p-1 text-slate-100 shadow-xl", option: "flex min-h-9 w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left hover:bg-slate-800 data-[selected]:bg-blue-950" },
  minimal: { ...base, trigger: "flex min-h-10 w-full items-center justify-between gap-2 rounded-none border-0 border-b border-slate-300 bg-transparent px-0 py-2 text-left shadow-none outline-none focus-visible:border-blue-500", popup: "mt-1 rounded-lg border border-slate-200 bg-white p-1 shadow-lg" },
};

/** Backward-compatible alias for the classic Tailwind preset. */
export const tailwindSelectClassNames = tailwindSelectVariants.classic;
