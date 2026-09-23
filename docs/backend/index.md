# 后端组件

后端组件按语言与运行时拆分，计划结构如下：

```text
packages/backend/go/<component>
packages/backend/node/<component>
```

每个组件需要自己的 README、依赖声明、最小示例和验证入口；共享仓库只统一文档索引和版本约定，不把不同语言的实现混在一个包里。
