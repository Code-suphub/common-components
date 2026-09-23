import type { ComponentPropsWithoutRef } from "react";

function mergeClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

// Copied from the comparison page's shadcn/ui Table primitives; keep the
// semantic markup/data-slot contract intact while making the source portable.
function Table({ className, ...props }: ComponentPropsWithoutRef<"table">) {
  return <div data-slot="table-container" className="relative w-full overflow-x-auto">
    <table data-slot="table" className={mergeClassNames("w-full caption-bottom text-sm", className)} {...props} />
  </div>;
}
function TableHeader({ className, ...props }: ComponentPropsWithoutRef<"thead">) {
  return <thead data-slot="table-header" className={mergeClassNames("[&_tr]:border-b", className)} {...props} />;
}
function TableBody({ className, ...props }: ComponentPropsWithoutRef<"tbody">) {
  return <tbody data-slot="table-body" className={mergeClassNames("[&_tr:last-child]:border-0", className)} {...props} />;
}
function TableRow({ className, ...props }: ComponentPropsWithoutRef<"tr">) {
  return <tr data-slot="table-row" className={mergeClassNames("border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted", className)} {...props} />;
}
function TableHead({ className, ...props }: ComponentPropsWithoutRef<"th">) {
  return <th data-slot="table-head" className={mergeClassNames("h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0", className)} {...props} />;
}
function TableCell({ className, ...props }: ComponentPropsWithoutRef<"td">) {
  return <td data-slot="table-cell" className={mergeClassNames("p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0", className)} {...props} />;
}

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow };
