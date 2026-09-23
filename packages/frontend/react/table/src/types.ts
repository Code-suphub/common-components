import type { Key, ReactNode } from "react";

export type DataTableSortDirection = "ascending" | "descending";
export interface DataTableFilterOption { value: string; label: ReactNode }
export interface DataTableFilter {
  label?: string;
  options: DataTableFilterOption[];
  selectedValues: string[];
  onSelectedValuesChange: (values: string[]) => void;
}
export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  filter?: DataTableFilter;
  className?: string;
}
export interface DataTableSort {
  columnId: string | null;
  direction: DataTableSortDirection | null;
  onChange: (columnId: string, direction: DataTableSortDirection | null) => void;
}
export interface DataTableSearch {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}
export interface DataTablePagination {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}
export interface DataTableProps<T> {
  label: string;
  rows: T[];
  columns: DataTableColumn<T>[];
  rowKey: (row: T, index: number) => Key;
  search?: DataTableSearch;
  sort?: DataTableSort;
  pagination?: DataTablePagination;
  footerNote?: ReactNode;
  emptyMessage?: ReactNode;
  className?: string;
}
