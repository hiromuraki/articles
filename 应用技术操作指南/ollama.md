---
id: "ce5547fc-d867-4050-828b-ddfc7185e0ce"
title: "ollama"
category: "应用技术操作指南"
date: "2025-06-13"
tags: []
access: private
---

## 1.下载与部署

下载
https://ollama.com/download/ollama-linux-amd64.tgz

```bash
sudo tar -C /usr -xzf ollama-linux-arm64.tgz
```

## 2.配置 systemd 服务

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
