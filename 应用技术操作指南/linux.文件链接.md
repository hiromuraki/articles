---
id: "2708efc5-ef08-4a23-ad76-5a01329c81ff"
title: "linux.文件链接"
category: "应用技术操作指南"
date: "2025-08-17"
tags: []
access: private
---

## 创建链接

**软连接**

```bash
ln -s [target_path] [link_path]
```

**硬链接**

```bash
ls -s [target_path] [link_path]
```

## 查看链接信息

```bash
# 查看硬链接inode号
ls -i

# 查看实际指向
readlink [link_path]

# 查看链接计数
stat [file_name]
```
