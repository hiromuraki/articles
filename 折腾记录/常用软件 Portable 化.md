---
id: "211ef869-0eb6-47ec-bf1f-8df0216ca322"
title: "常用软件 Portable 化"
category: "折腾记录"
date: "2026-09-04"
tags: []
access: private
---

# 常用软件 Portable 化

## Windows Terminal

- 下载：<https://github.com/microsoft/terminal>
- 解包，在 `wt.ext` 同级目录下创建名为 `.portable` 的文件
- 启动，此时程序会在自身目录下创建 `settings` 目录用于存储配置信息

## VS Code

- 下载：<https://code.visualstudio.com/Download>，选择 zip 包
- 解包，在 `code.exe` 同级目录下创建名为 `data` 的目录

## OBS Studio

- 下载：<https://github.com/obsproject/obs-studio/releases>，选择 zip 包
- 解包，在 `bin`/`data`/`obs-plugins` 所在的目录下创建名为 `portable_mode` 的文件
- 启动后，将会在 `portable_mode` 同目录下生成 `config` 目录以保存 OBS 配置文件

