# React DataTable

`DataTable<T>` 是公共数据表格组件：统一语义化表格、搜索框、列筛选弹层、三态排序提示、空态和分页外观。它负责交互控件和表格呈现，不获取数据，也不擅自对传入数据排序/筛选/分页。搜索、筛选、排序、分页均采用受控 API；调用方可以对本地数据计算，也可以在回调中请求服务端。

表格原语、`data-slot`、组合层级及样式采用 shadcn/ui Table 结构，并抽取在本公共包内。筛选弹层由 Base UI Popover、Checkbox 和 Button 组合。组件样式由本包提供 CSS，不要求 Tailwind；`@base-ui/react` 是 peer dependency。

## 使用

```tsx
import { DataTable } from "@local/common-components/react/table";
import "@local/common-components/react/table/styles.css";

type Asset = { id: string; name: string; category: string; value: number };

<DataTable<Asset>
  label="资产列表"
  rows={pageRows}
  rowKey={(row) => row.id}
  search={{ value: query, onValueChange: setQuery, placeholder: "搜索资产名称" }}
  sort={{ columnId: sortColumn, direction, onChange: (columnId, direction) => setSort({ columnId, direction }) }}
  pagination={{ page, pageSize: 20, total, onPageChange: setPage }}
  footerNote={<p>数据更新于刚刚</p>}
  columns={[
    { id: "name", header: "资产", cell: (row) => row.name },
    {
      id: "category", header: "类别", cell: (row) => row.category,
      filter: { label: "类别", options: categories, selectedValues, onSelectedValuesChange: setSelectedValues },
    },
    { id: "value", header: "市值", align: "right", sortable: true, cell: (row) => row.value.toLocaleString() },
  ]}
/>
```

## API 速查

| 属性 | 说明 |
|---|---|
| `label` | 表格无障碍名称 |
| `rows` / `rowKey` | 当前需要展示的行（可为当前页数据）及稳定行键 |
| `columns` | `id`、`header`、`cell(row)`；可选 `align`、`sortable`、`filter`、`className` |
| `search` | 可选受控搜索 `{ value, onValueChange, placeholder?, ariaLabel? }`；只报告输入变化，不内置过滤 |
| `sort` | 可选受控排序 `{ columnId, direction, onChange }`；点击循环升序、降序、取消 |
| `columns[].filter` | 可选多选筛选 `{ label?, options, selectedValues, onSelectedValuesChange }`；弹层含重置/确定 |
| `pagination` | 可选受控分页 `{ page, pageSize, total, onPageChange }`；组件显示总数和页码，不切分 rows |
| `footerNote` | 可选页脚说明内容，显示在分页区之后 |
| `emptyMessage` | 空状态内容，默认“暂无数据” |
| `className` | 根容器附加类名 |

服务端模式示意：搜索/筛选/排序/页码变化时，在回调内更新请求参数；请求结束后将本页 `rows` 与总数 `total` 传回。组件不规定 URL、认证、请求库或缓存策略。客户端模式则由调用方基于完整数据集计算过滤、排序和切片后传入。

## 样式定制

导入 `@local/common-components/react/table/styles.css`。样式提供 `.shadcn-table-*` 类契约；可通过 `className` 和列 `className` 扩展或覆盖。表格默认横向滚动，不会把桌面表格自动改造成卡片。

## 依赖

- `react`、`react-dom`：peer dependency。
- `@base-ui/react`：peer dependency，用于筛选 Popover；使用此组件的应用应显式安装。
- 不依赖 antd、Tailwind 或特定图标库。

组件源码位于 `packages/frontend/react/table`；API 示例和接入方式见本指南。
