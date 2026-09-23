# Component Atelier

独立的交互式公共组件预览站，直接引用仓库内的公共组件实现。

## 本地运行

```sh
npm ci
npm run dev
```

## GitHub Pages

仓库根目录的 `.github/workflows/pages.yml` 会在 `main` 分支更新后自动构建并发布 `examples/showcase`。首次启用时，在仓库 Settings → Pages 将 Build and deployment source 设为 GitHub Actions。
