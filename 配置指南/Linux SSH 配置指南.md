---
id: "f6d5c763-d938-4c25-90ad-b97f3624bdfd"
title: "Linux SSH 配置指南"
category: "配置指南"
date: "2026-02-17"
tags: []
access: private
---

## 1. 服务器端

### 1.1. 安装 openssh-server

```bash
sudo apt install openssh-server -y
```

### 1.2. sshd 配置加固

编辑 `/etc/ssh/sshd_config.d/00-custom.conf`，填入以下内容：

```conf
# Basic
Port 13922
AddressFamily inet

# Auth
PubkeyAuthentication yes
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin no
GSSAPIAuthentication no

# Access Control
AllowUsers admin
MaxAuthTries 3

# Optimize
ClientAliveInterval 60
ClientAliveCountMax 3

# Security
X11Forwarding no
PermitUserEnvironment no
StrictModes yes
```

> sshd 配置遵循先加载的生效

### 1.3. 重启 SSH 服务

```bash
sudo systemctl restart sshd
```

## 2. 客户端

### 2.1. 生成密钥对

Ed25519（更先进）

```bash
ssh-keygen -t ed25519 -C "comment"
```

RSA（兼容性最好）

```bash
ssh-keygen -t rsa -b 4096 -C "comment"
# -t rsa：使用 RSA 加密算法。
# -b 4096：密钥长度（2048 或 4096，越长越安全）。
# -C "注释"：可选，用于标识密钥（通常用邮箱）。
```

> comment 建议
>
> | 格式       | 示例                      | 适用场景             |
> | ---------- | ------------------------- | -------------------- |
> | 邮箱       | `user@example.com`        | GitHub、GitLab 等    |
> | 用户@设备  | `admin@desktop`           | 标识密钥来自哪台设备 |
> | 设备@用途  | `desktop@personal-server` | 标识设备和用途       |
> | 自定义名称 | `personal-laptop-2026`    | 个人密钥管理         |

### 2.2. 上传公钥到目标服务器

(1) 使用 ssh-copy-id

```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub username@server_ip
```

(2) 手动复制

将 `~/.ssh/id_rsa.pub` 中的内容填写到服务器的 `~/.ssh/authorized_keys` 文件中。

### 2.3. 配置

为 `~/.ssh/config` 填入以下内容

```txt
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3

Host my-server
    HostName 1.2.3.4
    User admin
    Port 22
```

### 2.4. 连接

```bash
ssh my-server
```
