---
id: "435f7d03-f80d-49f5-878b-7d1f2783e1df"
title: "apt"
category: "应用技术操作指南"
date: "2025-06-11"
tags: []
access: private
---

## 配置 apt 源

```bash
sudo nano /etc/apt/sources.list.d/custom.list
```

填入以下内容

```
# 中科大源
deb [arch=amd64] https://mirrors.ustc.edu.cn/ubuntu/ plucky main restricted universe multiverse
```

## apt 更新

```bash
sudo apt-get update

sudo apt-get upgrade
```
