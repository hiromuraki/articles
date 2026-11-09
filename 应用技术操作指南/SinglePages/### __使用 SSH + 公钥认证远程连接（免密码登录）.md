---
id: "2a4a8469-ecc9-4934-ad4a-1fe474ec4a6a"
title: "### __使用 SSH + 公钥认证远程连接（免密码登录）"
category: "应用技术操作指南->SinglePages"
date: "2025-07-21"
tags: []
access: private
---

### 🤖 Assistant



### **使用 SSH + 公钥认证远程连接（免密码登录）**

SSH 公钥认证比密码登录更安全，适合远程管理服务器、自动化脚本等场景。以下是详细步骤：

---

## **1. 本地生成 SSH 密钥对**
在 **本地机器**（你的电脑）上生成公钥（`id_rsa.pub`）和私钥（`id_rsa`）：
```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```
- `-t rsa`：使用 RSA 加密算法（推荐）。
- `-b 4096`：密钥长度（2048 或 4096，越长越安全）。
- `-C "注释"`：可选，用于标识密钥（通常用邮箱）。

**按提示操作：**
1. 默认保存路径：`~/.ssh/id_rsa`（直接回车）。
2. 设置密码（可选，增强安全性，但可留空直接回车）。

**生成的文件：**
- `~/.ssh/id_rsa` → **私钥**（保密，不要泄露！）
- `~/.ssh/id_rsa.pub` → **公钥**（需上传到服务器）

---

## **2. 上传公钥到远程服务器**
### **方法 1：使用 `ssh-copy-id`（推荐）**
```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub username@remote_server_ip
```
- 输入服务器密码后，公钥会自动添加到 `~/.ssh/authorized_keys`。

### **方法 2：手动复制（适用于无 `ssh-copy-id`）**
1. 查看本地公钥：
   ```bash
   cat ~/.ssh/id_rsa.pub
   ```
2. **登录远程服务器**，将公钥粘贴到 `~/.ssh/authorized_keys`：
   ```bash
   mkdir -p ~/.ssh  # 如果目录不存在
   echo "你的公钥内容" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys  # 设置权限
   ```

---

## **3. 测试 SSH 公钥登录**
```bash
ssh username@remote_server_ip
```
- 如果设置了私钥密码，需输入密码。
- 如果未设置密码，直接登录成功。

---

## **4. 禁用密码登录（可选，增强安全）**
编辑远程服务器的 SSH 配置文件：
```bash
sudo nano /etc/ssh/sshd_config
```
修改以下选项：
```ini
PasswordAuthentication no  # 禁用密码登录
PubkeyAuthentication yes   # 启用公钥认证
```
重启 SSH 服务：
```bash
sudo systemctl restart sshd
```
**⚠️ 注意：** 确保公钥已生效，否则可能被锁在服务器外！

---

## **5. 高级用法**
### **（1）指定私钥连接**
如果私钥不是默认的 `id_rsa`，可用 `-i` 指定：
```bash
ssh -i ~/.ssh/custom_key username@remote_server_ip
```

### **（2）通过 SSH 执行远程命令**
```bash
ssh username@remote_server_ip "ls -l /tmp"
```

### **（3）SSH 配置文件简化连接**
在本地 `~/.ssh/config` 添加：
```ini
Host myserver
    HostName remote_server_ip
    User username
    IdentityFile ~/.ssh/id_rsa
```
之后只需输入：
```bash
ssh myserver
```

---

## **6. 排错**
- **权限问题**：
  ```bash
  chmod 700 ~/.ssh
  chmod 600 ~/.ssh/authorized_keys
  ```
- **查看 SSH 登录日志**：
  ```bash
  tail -f /var/log/auth.log  # Ubuntu/Debian
  tail -f /var/log/secure   # CentOS/RHEL
  ```
- **调试模式**：
  ```bash
  ssh -vvv username@remote_server_ip
  ```

---

## **总结**
| 步骤 | 命令/操作 |
|------|----------|
| 1. 生成密钥对 | `ssh-keygen -t rsa -b 4096` |
| 2. 上传公钥 | `ssh-copy-id username@server_ip` |
| 3. 测试登录 | `ssh username@server_ip` |
| 4. 禁用密码（可选） | 修改 `/etc/ssh/sshd_config` |
| 5. 高级配置 | `~/.ssh/config` 或 `ssh -i key` |

现在你可以安全地使用 SSH 公钥登录了！ 🔑

