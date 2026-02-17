# Linux SSH 配置指南

## 1. 客户端

### 1.1. 生成密钥对

RSA（兼容性最好）

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
# -t rsa：使用 RSA 加密算法。
# -b 4096：密钥长度（2048 或 4096，越长越安全）。
# -C "注释"：可选，用于标识密钥（通常用邮箱）。
```

Ed25519（更先进）

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

### 1.2. 上传公钥到目标服务器

(1) 使用 ssh-copy-id

```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub username@server_ip
```

(2) 手动复制
将`~/.ssh/id_rsa.pub`中的内容上传到服务器的`~/.ssh/authorized_keys`文件中

### 1.3. 配置

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

### 1.4. 连接

```bash
ssh my-server
```

## 2. 服务器端

### 2.1. 安装 openssh-server

```bash
sudo apt install openssh-server -y
```

### 2.2. 禁用口令验证，仅允许密钥验证

编辑`/etc/ssh/sshd_config`，找到并修改以下参数

```ini
# 禁用口令认证
PasswordAuthentication no

# 使用公钥认证
PubkeyAuthentication yes
```

### 2.3. 重启 SSH 服务

```bash
sudo systemctl restart sshd
```
