---
id: "c74ffbea-ba56-4449-abb5-15a1a5ea6486"
title: "ollama"
category: "未整理"
date: "2026-02-17"
tags: []
access: private
---

## 1. 下载与部署

下载
https://ollama.com/download/ollama-linux-amd64.tgz

```bash
sudo tar -C /usr -xzf ollama-linux-arm64.tgz
```

## 2. 配置 systemd 服务

```ini
[Unit]
Description=Ollama Service
After=network-online.target

[Service]
ExecStart=/usr/bin/ollama serve
User=user
Group=user
Restart=always
RestartSec=3
Environment="PATH=$PATH"

[Install]
WantedBy=multi-user.target
```
