---
id: "6b559d00-6e0d-4828-898b-b27248d91941"
title: "vscode"
category: "应用技术操作指南"
date: "2025-05-08"
tags: []
access: private
---

```bash
# Windows VS Code，点击帮助 → 关于获取 commit_id（提交）以下载配套的 vscode-server
# https://update.code.visualstudio.com/commit:<commit_id>/server-linux-x64/stable

mkdir "$HOME/.vscode-server/bin/$commit_id"

tar zxf "path/to/vscode-server-linux-x64.tar.gz" -C "$HOME/.vscode-server/bin/$commit_id"
```
