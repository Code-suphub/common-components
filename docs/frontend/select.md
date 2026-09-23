# React Select

一个 React 组件，通过 `mode` 支持单选、多选和 Combobox。组件接收标准选项，不绑定任何业务 API 或 CSS 框架。

## 安装与导入

组件包将 `react` 和 `react-dom` 作为 peer dependency。使用本地仓库联调时，可从业务项目添加相对路径依赖：

```json
{
  "dependencies": {
    "@local/common-components": "file:../common-components"
  }
}
```

```tsx
import { Select, type SelectOption } from "@local/common-components/react/select";
import { tailwindSelectVariants } from "@local/common-components/react/select/tailwind";
import "@local/common-components/react/select/styles.css";
```

默认使用内置 CSS 主题，可用 `variant` 选择外观。Tailwind 项目则使用无主题模式和对应的 class preset：

```tsx
import { Select } from "@local/common-components/react/select";
import { tailwindSelectVariants } from "@local/common-components/react/select/tailwind";

<Select appearance="unstyled" classNames={tailwindSelectVariants.soft} options={options} value={value} onValueChange={setValue} />
```

### 8 种外观预设

| `variant` | 风格 | 适合场景 |
|---|---|---|
| `classic` | 经典白底、细边框、轻阴影（默认） | 通用表单 |
| `soft` | 柔和浅底、圆角、轻量阴影 | 现代后台 |
| `outline` | 强边框、透明底 | 需要清晰边界的密集表单 |
| `filled` | 灰色填充、无边框 | 轻量筛选栏 |
| `pill` | 胶囊圆角 | 标签式筛选、小型工具栏 |
| `compact` | 更小高度和字号 | 表格工具栏、紧凑布局 |
| `dark` | 深色控件与弹层 | 深色界面 |
| `minimal` | 极简下划线触发器 | 低视觉权重的筛选项 |

内置 CSS 使用方式：`<Select variant="soft" ... />`。Tailwind 下从 `tailwindSelectVariants` 取同名配置（如 `tailwindSelectVariants.soft`），并设置 `appearance="unstyled"`。所有预设只控制外观，单选/多选/Combobox 交互保持一致；仍可继续传入 `className`、`classNames`、CSS 变量覆盖。

Tailwind 需扫描该包的 `packages/frontend/react/select/src` 源码；建议让 Tailwind 输出的样式位于组件基础 CSS 之后。预设可继续通过 `classNames` 覆盖。

图标库也是可选的，通过 slots 注入，不成为组件依赖：

```tsx
import { ChevronDown, Check, X } from "lucide-react";

<Select icons={{ chevron: <ChevronDown size={16} />, check: <Check size={14} />, clear: <X size={14} /> }} />
```

## 基本选项

```tsx
const options: SelectOption[] = [
  { value: "cash", label: "现金账户" },
  { value: "card", label: "银行卡", group: "银行", keywords: ["储蓄卡"] },
  { value: "old", label: "已停用", disabled: true },
];
```

业务 API 返回不同字段时，在调用方映射成 `{ value, label }`；也可由服务端函数返回此格式。

## 单选

```tsx
<Select options={options} value={account} onValueChange={(next) => setAccount(next as string)} label="账户" />
```

## 多选

```tsx
<Select mode="multiple" searchable clearable options={options} value={accountIds} onValueChange={(next) => setAccountIds(next as string[])} />
```

## 搜索与远程 API

```tsx
const loadAccounts = async (query: string): Promise<SelectOption[]> => {
  const response = await fetch(`/api/accounts?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error("账户加载失败");
  const rows = await response.json();
  return rows.map((row: { id: number; title: string }) => ({ value: String(row.id), label: row.title }));
};

<Select searchable loadOptions={loadAccounts} value={accountId} onValueChange={(next) => setAccountId(next as string)} />
```

`loadOptions` 在列表打开和搜索词变化时调用。组件处理加载、错误、空结果和过期响应；API 地址、认证和响应字段由业务层处理。

## Combobox

```tsx
<Select mode="combobox" options={options} value={symbol} onValueChange={(next) => setSymbol(next as string)} allowCustomValue />
```

Combobox 输入文本搜索选项。默认要求选择匹配项；设置 `allowCustomValue` 后，用户可提交列表中不存在的文本。

## 样式定制

```css
.account-picker {
  --cc-select-bg: #111827;
  --cc-select-fg: #f9fafb;
  --cc-select-muted: #9ca3af;
  --cc-select-border: #374151;
  --cc-select-hover: #1f2937;
  --cc-select-selected: #1e3a5f;
  --cc-select-accent: #60a5fa;
  --cc-select-radius: 10px;
}
```

组件根元素也接受 `className`；细粒度覆盖使用 `classNames={{ trigger, popup, option, search, empty, footer }}`。

## Props 速查

| Prop | 类型 | 默认 | 说明 |
|---|---|---|---|
| `mode` | `single \| multiple \| combobox` | `single` | 选择交互模式 |
| `options` | `SelectOption[]` | `[]` | 选项列表 |
| `value` / `defaultValue` | `string \| string[]` | 空值 | 受控/非受控值 |
| `onValueChange` | `(value) => void` | — | 值变化回调 |
| `loadOptions` | `(query) => Promise<SelectOption[]>` | — | 异步选项加载 |
| `searchable` | `boolean` | `false` | 在弹层显示搜索框；Combobox 自带输入 |
| `allowCustomValue` | `boolean` | `false` | 允许 Combobox 提交自定义文本 |
| `clearable` | `boolean` | `false` | 显示清空入口 |
| `disabled` / `required` | `boolean` | `false` | 禁用/必填状态 |
| `className` / `classNames` | `string` / 对象 | — | 样式覆盖入口 |
| `appearance` | `default \| unstyled` | `default` | 内置主题或调用方全权控制外观 |
| `icons` | `chevron` / `check` / `clear` ReactNode | 字符图标 | 注入任意图标库的图标 |

单选和 Combobox 的值是字符串，多选的值是字符串数组。`name` 会渲染隐藏表单字段；多选值以逗号连接，若要无损提交数组请在表单层自行序列化。
