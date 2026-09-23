# 组件速查

| 组件 | 适用场景 | 导入 | 主要配置 | 指南 |
|---|---|---|---|---|
| React `Select` | 单选、多选、可搜索/可输入选择 | `@local/common-components/react/select` | `mode`、`variant`（8 种）、`options`、`value`、`loadOptions` | [Select 指南](frontend/select.md) |
| React + Ant Design 主题 | 跨项目共享 AntD 设计 Token | `@local/common-components/react/antd` | `commonAntdTheme`、`createCommonAntdTheme`、局部 Token 覆盖 | [AntD 指南](frontend/antd.md) |
| React `DataTable` | 搜索、列筛选、排序、空态、受控分页 | `@local/common-components/react/table` | `rows`、`columns`、`search`、`sort`、`pagination` | [Table 指南](frontend/table.md) |
| React UI 基础组件 | 按钮、输入、字段、状态、反馈、卡片、弹窗 | `@local/common-components/react/ui` | `variant`、`size`、原生表单属性、CSS 变量 | [UI 基础组件指南](frontend/ui.md) |

## 模式速查

| `mode` | `value` 类型 | 行为 |
|---|---|---|
| `single` | `string` | 选中一项，选中后关闭列表 |
| `multiple` | `string[]` | 勾选多项，列表保持打开，可清空/完成 |
| `combobox` | `string` | 输入过滤选项；设置 `allowCustomValue` 后可提交列表外文本 |

## 异步数据

传入 `loadOptions(query)` 加载远程选项。组件负责打开时加载、搜索变化后的重新加载、加载/错误状态和过期响应隔离；调用方负责 URL、认证、请求取消策略和返回值映射。

## 样式

导入 `@local/common-components/react/select/styles.css`，通过 `variant` 在 classic/soft/outline/filled/pill/compact/dark/minimal 中选择，或用 CSS 变量、`classNames` 覆盖。Tailwind 项目可从 `tailwindSelectVariants` 选同名预设；图标通过 `icons` slots 注入，组件不依赖特定图标包。

跨项目发现的本地封装和抽取候选见[组件盘点](component-inventory.md)。

后端组件添加后，在本表追加组件、包路径、用途和对应指南链接。
