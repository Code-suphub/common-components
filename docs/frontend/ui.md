# React UI 基础组件

导入基础组件和配套 CSS：

```tsx
import { Button, Input, Field, FieldLabel, FieldDescription } from "@local/common-components/react/ui";
import "@local/common-components/react/ui/styles.css";

<Field>
  <FieldLabel htmlFor="nickname">昵称</FieldLabel>
  <Input id="nickname" placeholder="请输入昵称" />
  <FieldDescription>最多 30 个字符。</FieldDescription>
</Field>
<Button variant="primary" size="md">保存</Button>
```

## 组件清单

| 组件 | 用途 / 常用配置 |
|---|---|
| `Button` | `variant`: `primary`、`secondary`、`outline`、`ghost`、`danger`；`size`: `sm`、`md`、`lg`、`icon`；`loading` 自动禁用并显示加载状态 |
| `Input` / `Textarea` | 原生表单属性、ref、`invalid` 状态 |
| `Checkbox` / `Switch` | 原生受控/非受控 checkbox 属性；Switch 使用 `role="switch"` |
| `Field` / `FieldLabel` / `FieldDescription` / `FieldError` | 字段内 `Input` / `Textarea` 自动获得 id，标签自动关联；说明和错误可通过 `aria-describedby` 显式关联 |
| `Badge` | `default`、`secondary`、`outline`、`success`、`warning`、`danger` |
| `Card` / `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter` | 组合式内容容器 |
| `Dialog` | 受控原生模态对话框，必须提供 `title`，通过 `open` / `onOpenChange` 控制 |
| `Separator` | 水平/垂直语义分隔线 |
| `Spinner` / `Skeleton` | 加载指示器和占位骨架 |

组件尽量保留对应 HTML 元素属性、`className` 和 ref。`Dialog` 基于浏览器原生 `<dialog>`，支持 Escape、模态焦点管理和关闭状态回传。图标由业务项目传入 children，不依赖某个图标库。

## 主题

应用根节点或局部容器可以覆盖 CSS 变量：`--cc-primary`、`--cc-primary-foreground`、`--cc-secondary`、`--cc-secondary-foreground`、`--cc-bg`、`--cc-fg`、`--cc-muted`、`--cc-border`、`--cc-danger`、`--cc-ring`、`--cc-radius`、`--cc-card-radius`。

这是共享组件初版，目标是统一 API、默认交互与主题入口，而不是替代 antd 的完整套件。复杂菜单、日期时间、Popover/Tooltip、Tabs、分页和表单校验编排按实际跨项目需求再加入，避免为清单数量过度抽象。
