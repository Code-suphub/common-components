# 跨项目组件盘点

截至 2026-09-23，`common-components` 已有 React `Select`、受控 `DataTable`、UI 基础组件和 Ant Design 主题 Token 公共入口。下表区分项目原有实现与公共包现状；公共组件的实际接入仍需由各业务项目逐步完成。

| 场景 | 项目里的现状 | 公共包现状 | 初步判断 |
|---|---|---|---|
| Select / Combobox | `flowbook/src/components/Combobox.jsx`、`web_organization/app/src/shared/controls.tsx`、`flowhub-plugins/plugins/machines` 各有自己的实现 | 公共包提供单选、多选和 Combobox | 公共版本已补多选标签、清空和键盘操作；大数据量及复杂交互仍需按项目实测，不承诺与 antd 全功能等价 |
| 日期时间 | `organization_tools/src/components/DateTimePickerInput.jsx` 是 MUI X 封装，支持文本输入、格式校验、静态选择器和确认流程 | 尚未抽取公共日期时间组件 | 先核对其他项目需求和依赖，再考虑抽取或改用 antd |
| 表单 | 各项目普遍用原生 `<form>` 和输入控件 | 提供 Field、Input、Textarea 和错误提示；没有 Form 状态/校验引擎 | 表单状态与校验留给项目；可直接使用 antd 或项目现有表单方案 |
| Button / Input / Field / Dialog 等 | `web_organization/app/src/shared/ui.tsx` 有轻量包装 | 提供基础原语 | 共享外观和语义，业务布局与提交逻辑仍由项目控制；Tabs 尚未抽取 |
| Switch / Tooltip / Help / Select | `web_organization/app/src/shared/controls.tsx` 有项目级实现 | 部分有对应基础组件 | 不应只凭组件名称相同就合并；按交互与项目需求决定复用方式 |
| Pagination | `flowbook/src/components/Pagination.jsx` | `DataTable.pagination` | 分页状态由调用方管理；组件提供页码控件，不切分 rows |
| Table | 多个项目使用不同表格/原生表格 | 提供受控 `DataTable` | 搜索、筛选、排序、分页均由调用方控制；业务详情弹窗等继续由项目组合 |
