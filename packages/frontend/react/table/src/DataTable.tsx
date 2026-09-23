import { useId, useState, type ComponentProps } from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { Popover } from "@base-ui/react/popover";
import type { DataTableColumn, DataTableFilter, DataTableProps, DataTableSortDirection } from "./types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./Table";

const buttonBase = "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";
const buttonVariants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/80",
  outline: "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
  ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
};
const buttonSizes = {
  sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
  "icon-xs": "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
};
function buttonClass(variant: keyof typeof buttonVariants, size: keyof typeof buttonSizes, extra = "") {
  return `${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]} ${extra}`.trim();
}

function SortArrows({ direction }: { direction: DataTableSortDirection | null }) {
  return <span className="sort-arrows" aria-hidden="true">
    <i className={direction === "ascending" ? "active" : ""} />
    <i className={direction === "descending" ? "active" : ""} />
  </span>;
}

function FilterPopover({ filter }: { filter: DataTableFilter }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(filter.selectedValues);
  const toggle = (value: string) => setDraft((current) => current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value]);

  return <Popover.Root data-slot="popover" open={open} onOpenChange={(nextOpen) => {
    setOpen(nextOpen);
    if (nextOpen) setDraft(filter.selectedValues);
  }}>
    <Popover.Trigger data-slot="popover-trigger" render={(props) => <ButtonPrimitive {...props} data-slot="button"
      className={buttonClass("ghost", "icon-xs", "shadcn-filter-trigger")} aria-label={`筛选${filter.label ?? "类别"}`}>
      <span className="filter-funnel" aria-hidden="true" />
    </ButtonPrimitive>} />
    <Popover.Portal>
      <Popover.Positioner align="start" side="bottom" sideOffset={4} className="isolate z-50">
        <Popover.Popup data-slot="popover-content" className="z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 shadcn-filter-popover">
          <div className="shadcn-filter-title">筛选{filter.label ?? ""}</div>
          <div className="shadcn-filter-options">
            {filter.options.map((option) => {
              const checkboxId = `${id}-${option.value}`;
              return <label key={option.value} htmlFor={checkboxId}>
                <CheckboxPrimitive.Root id={checkboxId} data-slot="checkbox" checked={draft.includes(option.value)} onCheckedChange={() => toggle(option.value)}
                  className="peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground">
                  <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="grid place-content-center text-current transition-none" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="m20 6-11 11-5-5" /></svg>
                  </CheckboxPrimitive.Indicator>
                </CheckboxPrimitive.Root>
                <span>{option.label}</span>
              </label>;
            })}
          </div>
          <div className="shadcn-filter-actions">
            <ButtonPrimitive data-slot="button" className={buttonClass("ghost", "sm", "shadcn-filter-reset")} onClick={() => setDraft([])}>重置</ButtonPrimitive>
            <ButtonPrimitive data-slot="button" className={buttonClass("default", "sm", "filter-confirm-button")} onClick={() => {
              filter.onSelectedValuesChange(draft);
              setOpen(false);
            }}>确定</ButtonPrimitive>
          </div>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>;
}

function pageItems(page: number, pageCount: number): Array<number | "ellipsis"> {
  if (pageCount <= 5) return Array.from({ length: pageCount }, (_, index) => index + 1);
  if (page <= 3) return [1, 2, 3, 4, "ellipsis", pageCount];
  if (page >= pageCount - 2) return [1, "ellipsis", pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
  return [1, "ellipsis", page - 1, page, page + 1, "ellipsis", pageCount];
}

type PageButtonProps = Omit<ComponentProps<"button">, "ref"> & { variant?: "ghost" | "outline"; size?: "icon-xs"; className?: string };
function PageButton({ children, variant = "ghost", size = "icon-xs", className = "", ...props }: PageButtonProps) {
  return <ButtonPrimitive data-slot="button" className={buttonClass(variant, size, `shadcn-page-button ${className}`)} {...props}>{children}</ButtonPrimitive>;
}

function Pagination({ pagination, activeFilterCount }: {
  pagination: NonNullable<DataTableProps<unknown>["pagination"]>;
  activeFilterCount: number;
}) {
  const pageCount = Math.max(1, Math.ceil(pagination.total / Math.max(1, pagination.pageSize)));
  const page = Math.min(Math.max(1, pagination.page), pageCount);
  return <div className="shadcn-table-footer">
    <span>共 {pagination.total} 项{activeFilterCount > 0 ? ` · 已筛选 ${activeFilterCount} 类` : ""}</span>
    <div className="shadcn-page-controls">
      <PageButton aria-label="上一页" disabled={page <= 1} onClick={() => pagination.onPageChange(page - 1)}>‹</PageButton>
      {pageItems(page, pageCount).map((item, index) => item === "ellipsis"
        ? <span className="shadcn-page-ellipsis" key={`ellipsis-${index}`} aria-hidden="true">…</span>
        : <PageButton key={item} variant="outline" className="shadcn-page-number" aria-label={`第 ${item} 页`} aria-current={page === item ? "page" : undefined} onClick={() => pagination.onPageChange(item)}>{item}</PageButton>)}
      <PageButton aria-label="下一页" disabled={page >= pageCount} onClick={() => pagination.onPageChange(page + 1)}>›</PageButton>
    </div>
  </div>;
}

function SortHeader<T>({ column, sort }: { column: DataTableColumn<T>; sort?: DataTableProps<T>["sort"] }) {
  const direction = sort?.columnId === column.id ? sort.direction : null;
  const nextDirection = direction === null ? "ascending" : direction === "ascending" ? "descending" : null;
  const title = typeof column.header === "string" ? column.header : "此列";
  return <button type="button" className="sort-button" onClick={() => sort?.onChange(column.id, nextDirection)}
    aria-label={`按${title}排序，当前${direction === null ? "未排序" : direction === "ascending" ? "升序" : "降序"}`}
    title={direction === null ? "升序排列" : direction === "ascending" ? "降序排列" : "取消排序"}>
    {column.header} {" "}<SortArrows direction={direction} />
  </button>;
}

const inputClasses = "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 shadcn-data-table-search";

export function DataTable<T>({ label, rows, columns, rowKey, search, sort, pagination, emptyMessage = "暂无数据", className = "", footerNote }: DataTableProps<T>) {
  const activeFilterCount = columns.reduce((total, column) => total + (column.filter?.selectedValues.length ?? 0), 0);
  return <div className={`shadcn-table-wrap ${className}`.trim()}>
    {search && <div className="shadcn-table-toolbar">
      <InputPrimitive type="search" data-slot="input" className={inputClasses} aria-label={search.ariaLabel ?? `${label}搜索`}
        placeholder={search.placeholder ?? "搜索"} value={search.value} onChange={(event) => search.onValueChange(event.target.value)} />
    </div>}
    <Table aria-label={label}>
      <TableHeader><TableRow>
        {columns.map((column) => {
          const direction = sort?.columnId === column.id ? sort.direction : null;
          const active = direction !== null;
          return <TableHead key={column.id} aria-sort={active ? direction! : undefined}
            className={`${active ? "is-sorted" : ""} ${column.className ?? ""}`.trim()}>
            {column.filter ? <span className="shadcn-category-head">
              <span>{column.header}</span><FilterPopover filter={column.filter} />
              {column.filter.selectedValues.length > 0 && <span className="shadcn-filter-count">{column.filter.selectedValues.length}</span>}
            </span> : column.sortable ? <SortHeader column={column} sort={sort} /> : column.header}
          </TableHead>;
        })}
      </TableRow></TableHeader>
      <TableBody>
        {rows.map((row, index) => <TableRow key={rowKey(row, index)}>{columns.map((column) => <TableCell key={column.id}
          className={`${sort?.columnId === column.id && sort.direction ? "is-sorted" : ""} ${column.align === "right" ? "text-right" : column.align === "center" ? "text-center" : ""} ${column.className ?? ""}`.trim()}>{column.cell(row)}</TableCell>)}</TableRow>)}
        {rows.length === 0 && <TableRow><TableCell colSpan={Math.max(1, columns.length)} className="shadcn-empty">{emptyMessage}</TableCell></TableRow>}
      </TableBody>
    </Table>
    {pagination && <Pagination pagination={pagination} activeFilterCount={activeFilterCount} />}
    {footerNote}
  </div>;
}
