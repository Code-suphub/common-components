# Ant Design table column preferences

`react/antd/table-columns` exports `ConfigurableTable`, a thin adapter around Ant Design Table. It keeps the native renderers, filters, sorters, fixed columns and pagination. React and Ant Design are peer dependencies; the consuming Vite project should dedupe them.

Use stable, unique `tableId` and column keys. `defaultHiddenColumns` controls initial optional columns, `requiredColumns` adds mandatory identifiers, and `columnTools` places a business tool in the toolbar. Text titles and `title.props.label` are used in the picker; complex titles can provide `columnLabel`. The current adapter supports flat leaf columns.

`toolbarTarget` optionally accepts a mounted HTMLElement (use a state-backed callback ref) and portals the native toolbar into the page's existing header or tab actions. The table then has no extra toolbar row. The fallback keeps the toolbar immediately above the table. This preserves one picker instance and its current state while leaving placement to the consuming page.

```jsx
<ConfigurableTable tableId="inventory.stock" columns={columns}
  defaultHiddenColumns={['history']} requiredColumns={['code']}
  dataSource={rows} pagination={false} />
```

The first identifier column is always visible. Active filter columns stay visible so users can still adjust or clear conditions. Showing/hiding columns does not request data or reset filters and sorting. Numeric column widths (or `minWidth` for a flexible text column) determine native `scroll.x` from only visible columns, avoiding excess blank horizontal space. A column with only `minWidth` fills available space while fixed action columns retain their widths. Select all and restore defaults operate on this table only.

Preferences are booleans under `flowbook:table-columns:v1:<tableId>` in localStorage. No record or financial data is stored. Missing/new columns follow defaults; corrupt or unavailable storage falls back safely. Changes apply immediately, restore defaults removes only the matching key, and each mounted table id gets independent state. Clearing browser data removes preferences. Popovers use AntD Checkbox/Button and preserve keyboard focus with Escape returning to the trigger.

Regression tests run in the consuming Flowbook trading suite (`ConfigurableTable.test.tsx`), including remount persistence, width changes, default recovery, table isolation, active filters and denied storage.
