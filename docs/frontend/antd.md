# Ant Design 共享接入

`@local/common-components/react/antd` 为各 React 项目提供统一的 Ant Design 主题 Token。它不重新封装 AntD 的 Button、Input、Select、Form 等基础组件；业务代码直接使用 `antd` API。

## 安装

使用该入口的项目需要自行依赖 `antd`。该入口只导出纯主题对象与合并函数，不导入 AntD，因此只使用其他公共组件的项目无需安装 AntD。

## 使用默认主题

```tsx
import { Button, ConfigProvider, Input } from "antd";
import zhCN from "antd/locale/zh_CN";
import { createCommonAntdTheme } from "@local/common-components/react/antd";
import "antd/dist/reset.css";

export function App() {
  return (
    <ConfigProvider locale={zhCN} theme={createCommonAntdTheme()}>
      <Input placeholder="请输入名称" />
      <Button type="primary">保存</Button>
    </ConfigProvider>
  );
}
```

## 局部覆盖主题

```tsx
<ConfigProvider
  theme={createCommonAntdTheme({
    token: {
      colorPrimary: "#315d46",
      borderRadius: 4,
      controlHeight: 38,
    },
  })}
>
  <AppContent />
</ConfigProvider>
```

`commonAntdTheme` 可用于查看共享默认 Token。`createCommonAntdTheme` 接受 AntD Token 局部覆盖；未覆盖字段继续使用公共默认值。

## 组件边界与迁移

- 直接从 `antd` 导入成熟基础组件；公共包只集中主题 Token，不复制 AntD 的完整组件 API。
- 仅当多个项目确实需要一致的业务交互时，才新增小型组合组件，并避免把页面业务规则塞进主题层。
- DataTable 维持独立 API，不依赖 AntD Table。
- 后续更换 UI 库时，主题 Token 层可整体替换；直接使用 AntD API 的业务页面仍需按组件逐步迁移。保持 API 与表单数据模型、业务逻辑分离，可降低迁移影响。
