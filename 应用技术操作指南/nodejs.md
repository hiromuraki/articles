---
id: "b542c33f-2df4-4b52-9110-0412fc73855b"
title: "nodejs"
category: "应用技术操作指南"
date: "2025-05-08"
tags: []
access: public
---

```bash
# https://nodejs.org/zh-cn/download

mkdir -p "$HOME/local/nodejs/24"

tar xf node-v*-linux-x64.tar.xz -C "$HOME/local/nodejs/24

export NODE_HOME=$HOME/local/nodejs/24
export PATH=$NODE_HOME/bin:$PATH
```
