# Rocky Linux 10 安装指南

[TOC]

## 1. 下载镜像

---

## 2. 安装

选择 Server

配置项

**用户**：

- 启用 root 用户，但不启用 SSH 密码登录
- 创建的用户

**挂载**：

| 挂载点    | 大小              |
| --------- | ----------------- |
| /         | 32 GiB            |
| /boot     | 1024 MiB          |
| /boot/efi | 200 Mib           |
| /swap     | 物理内存的 1-2 倍 |
| /home     | 剩余可分配的空间  |

---

## 3. 配置

### 3.1. 基础配置

#### 3.1.1. 配置 EPEL 仓库

```bash
sudo dnf install -y epel-release
```

#### 3.1.2. 更新系统

```bash
sudo dnf -y update
```

> 更新后使用 `needs-restarting -r` 检查是否需要重启

#### 3.1.3. 修改 hostname

```bash
sudo hostnamectl set-hostname <new_hostname>
```

---

### 3.2. 网路配置

#### 3.2.1. 手动配置有线网络

> 以下步骤仅适用于需要手动配置网络的情况

使用以下命令查看网络接口

```bash
ip addr show
```

使用以下命令编辑对应的网络接口配置文件（如 eth0）

```bash
vi /etc/NetworkManager/system-connections/eth0.nmconnection
```

示例配置

```ini
[connection]
id=eth0
uuid=76e977ca-f9ec-3bdd-9382-19c2430a3218
type=ethernet
autoconnect-priority=-999
interface-name=eth0

[ethernet]

[ipv4]
method=manual
addresses=192.168.109.205/24
gateway=192.168.109.2
dns=114.114.114.114;8.8.8.8

[ipv6]
addr-gen-mode=eui64
method=auto

[proxy]
```

验证配置文件

```bash
sudo nmcli con reload
sudo nmcli con show eth0
sudo nmcli device show eth0
```

重启对应接口

```bash
sudo nmcli con reload && sudo nmcli con up eth0
```

---

### 3.3. SSH 配置

#### 3.3.1. 添加 SSH 客户端密钥

使用以下命令修改目标用户（如 admin）的 `~/.ssh/authorized_keys`，在其中添加 SSH 客户端的公钥

```bash
mkdir ./.ssh && vi ./.ssh/authorized_keys
```

在进行下一步之前，请先连接一次，确保 SSH 客户端可以进行 SSH 连接

#### 3.3.2. 修改 SSHD 配置

使用如下命令创建 SSH 配置文件

```bash
sudo vi /etc/ssh/sshd_config.d/99-custom.conf
```

写入以下 SSH 配置

```ini
# Basic
Port 13922
AddressFamily inet

# Auth
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no
PermitRootLogin no
ChallengeResponseAuthentication no
KerberosAuthentication no
GSSAPIAuthentication no

# Access Control
AllowUsers daveny
DenyUsers root
MaxAuthTries 3
MaxSessions 5

# Optimize
ClientAliveInterval 60
ClientAliveCountMax 3
UseDNS no

# Etc
X11Forwarding no
PermitUserEnvironment no
PrintMotd no
StrictModes yes
```

> 1. 将 SSH 端口修改为 13922
> 2. 启用公钥验证
> 3. 禁用密码登录
> 4. 禁用 root 登录

执行以下命令，检查配置是否正确

```bash
sudo sshd -t
```

> 配置正确应不会有任何输出

修改 SELinux 中的 SSH 端口配置

```bash
sudo semanage port -a -t ssh_port_t -p tcp 13922
```

执行以下命令，修改防火墙设置，放行 SSH 端口

```bash
sudo firewall-cmd --add-port=13922/tcp --permanent --zone=<net_zone>
sudo firewall-cmd --reload
```

> 注：如果不添加 Zone 参数，`firewall-cmd` 默认使用 `zone=public` 如果要为特定网络设置防火墙，请先使用 `firewall-cmd --get-zone-of-interface=<网络接口>` 获取网络所处的 `zone`，然后通过 `--zone=` 参数进行指定

使用以下命令重启 `sshd` 服务

```bash
sudo systemctl reload-or-restart sshd
```

检查实际生效的配置

```bash
sudo sshd -T
```

检查 `sshd` 服务

```bash
sudo systemctl status sshd

ss -tlnp | grep :13922
```

在 SSH 客户端尝试连接

```bash
ssh -p 13922 user@ip
```

---

## 4. 常用软件部署

### 4.1. 基础设施

#### 4.1.1. Tmux

```bash
sudo dnf install tmux
```

#### 4.1.2. Git

```bash
sudo dnf install git
```

#### 4.1.3. Docker

参考：Docker->安装指南

#### 4.1.4. Zsh

参考：Zsh->安装指南

#### 4.1.5. UV

参考：UV->安装指南

---

### 4.2. 网络设施

#### 4.2.1. WireGuard

```bash
sudo dnf install wireguard-tools
```

---

### 4.3. 系统监控

#### 4.3.1. Cockpit

默认安装，开放端口即可

```bash
sudo firewall-cmd --add-port=9090/tcp --permanent
sudo firewall-cmd --reload
```

#### 4.3.2. Glances

**使用 UV 创建环境**：

```bash
uv init glances-system && cd glances-system
```

> 可能需要适当调整 Python 版本

**安装 glances**：

```bash
uv add "glances[all]"
```

开放端口 `61208/tcp`

```bash
sudo firewall-cmd --add-port=61208/tcp --permanent
sudo firewall-cmd --reload
```

#### 4.3.3. NetStat

```bash
wget -O /tmp/netdata-kickstart.sh https://get.netdata.cloud/kickstart.sh && sh /tmp/netdata-kickstart.sh --no-updates --stable-channel
```
