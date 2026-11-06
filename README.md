# Lejun Li 个人导航页

这是一个无需构建步骤的静态个人导航页面，适用于 GitHub Pages 等静态托管服务。

## 发布

将本目录中的文件整体部署为站点根目录，保留 `assets/` 与 `CNAME`。当前 `CNAME` 指向 `lejunli.com`；如部署到其他域名，请按需修改或删除。

页面不再读取 RSS，也不需要后台同步、GitHub Actions 工作流或 JavaScript。

## 博客分类链接

页面中的分类入口使用 Typecho 常见的 `/category/<slug>/` 路径。若博客实际分类别名不同，请在 `index.html` 中更新对应链接。
