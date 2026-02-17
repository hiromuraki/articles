# Frp 快速使用指南

## 1. 安装

下载适合系统的最新版压缩包后解压即可：<https://github.com/fatedier/frp/releases>

## 2. 使用

### 2.1. 服务器端

1.在`frps.toml`中写入如下内容

```toml
bindPort = 7000

# 验证方式
[auth]
method = "token"
token = "Your_custom_token"

# Web Dashboard（管理界面）
[webServer]
addr = "0.0.0.0"
port = 7500
user = "Dashboard_User"
password ="Dashboard_Password"

# 日志
[log]
to = "./frps.log"
level = "info"
maxDays = 7
```

2.放行端口 `7000/TCP` 与 `7500/TCP`

3.运行 frps

```bash
./frps -c ./frps.toml
```

### 2.2. 客户端

1.在`frpc.toml`中写入如下内容

```toml
serverAddr = "?.?.?.?"
serverPort = 7000
auth.token = "Your_custom_token"

[[proxies]]
name = "MC-TCP"
type = "tcp"
localIP = "127.0.0.1"
localPort = 25565
remotePort = 25565

[[proxies]]
name = 'MC-UDP'
type = "udp"
localIP = "127.0.0.1"
localPort = 25565
remotePort = 25565
```

2.运行 frpc

```bash
./frpc -c ./frpc.toml
```
