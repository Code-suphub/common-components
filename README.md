# Common Components

跨项目复用的前端与后端组件。按技术栈分包，组件 API、速查文档和示例集中维护。

## 快速入口

- [组件速查表](docs/quick-reference.md)
- [React Select 指南](docs/frontend/select.md)
- [React Table 指南](docs/frontend/table.md)
- [React UI 基础组件指南](docs/frontend/ui.md)
- [Ant Design 共享主题指南](docs/frontend/antd.md)
- [React Select 示例](examples/react-select/README.md)
- [交互式组件展厅](examples/showcase/README.md)

## 当前组件

| 技术栈 | 组件 | 导入路径 | 状态 |
|---|---|---|---|
| React | Select（单选、多选、Combobox） | `@local/common-components/react/select` | 初版 |
| React + Ant Design | 共享主题 Token 与合并函数 | `@local/common-components/react/antd` | 主题预设 |
| React | DataTable（受控搜索、筛选、排序、分页） | `@local/common-components/react/table` | 初版 |
| React | UI 基础组件（Button、Input、Field、Checkbox、Switch、Badge、Card、Dialog 等） | `@local/common-components/react/ui` | 初版 |

## 仓库约定

- 每种技术栈独立发布和管理依赖；React 组件将 React 声明为 peer dependency。
- Ant Design 主题集成独立从 `@local/common-components/react/antd` 引入；业务项目直接使用 AntD 组件并自行包裹 `ConfigProvider`，其他项目不会被强制依赖 AntD。
- 组件不绑定业务 API。调用方传入标准化数据或 `loadOptions` 函数。
- CSS 通过独立样式文件、CSS 变量和 className 定制，不要求使用特定 CSS 框架。
- 外观有内置 CSS 默认主题，也可选择 Tailwind classNames 预设；图标从调用方注入，不固定依赖某个图标库。
- 后端组件按语言放入 `packages/backend/<language>/`，并维护各自的文档和示例。

本地联调可在业务项目中用相对路径依赖；稳定后再发布带版本号的 Git tag 或包版本。
