---
id: "9f2d7a89-d1c5-4123-801a-a405e5376d79"
title: "powershell"
category: "应用技术操作指南"
date: "2025-05-08"
tags: []
access: private
---

```bash
# https://github.com/PowerShell/PowerShell/releases

sudo mkdir -p /opt/microsoft/powershell/7

sudo tar zxf powershell-*-linux-*.tar.gz -C /opt/microsoft/powershell/7/

sudo chmod +x /opt/microsoft/powershell/7/pwsh

sudo ln -s /opt/microsoft/powershell/7/pwsh /usr/bin/pwsh
```
