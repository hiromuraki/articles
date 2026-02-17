# WireGuard 中的相关概念

## 1. 网络拓扑

通过 WireGuard 实现客户端 A 和客户端 B 的通讯

| 终端     | 内网 IP     | Endpoint      |
| -------- | ----------- | ------------- |
| 服务器端 | 10.8.0.1/24 | 1.2.3.4:51820 |
| 客户端 A | 10.8.0.2/24 |
| 客户端 B | 10.8.0.3/24 |

```mermaid
graph LR
    subgraph 公网服务器
        S[IP: 10.8.0.1/24<br>公网IP: 1.2.3.4:51820]
    end

    subgraph NAT客户端A
        A[IP: 10.8.0.2/24]
    end

    subgraph NAT客户端B
        B[IP: 10.8.0.3/24]
    end

    A -- "出站连接①<br>(建立NAT映射)" --> S
    B -- "出站连接②<br>(建立NAT映射)" --> S

    S -- "中转流量③<br>10.8.0.2 → 10.8.0.3" --> B
    S -- "中转流量④<br>10.8.0.3 → 10.8.0.2" --> A

    style S fill:#d4f1f9,stroke:#333
    style A fill:#f5d6e6,stroke:#333
    style B fill:#e2f6d3,stroke:#333
```

## 2. 配置项

### 2.1. 概览

服务器端

```ini
[Interface]
# 服务器在虚拟网络中的 IP 地址
Address = 10.8.0.1/24
# WireGuard 监听的UDP端口，需在防火墙放行
ListenPort = 51820
# 服务器私钥，填入wg genkey生成的密钥
PrivateKey = [SERVER/key]

# 启动 WireGuard 时执行的命令
PostUp = iptables -A FORWARD -i %i -j ACCEPT;
PostUp = iptables -A FORWARD -o %i -j ACCEPT;
PostUp = iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# 停止 WIreGuard 时执行的命令
PostDown = iptables -D FORWARD -i %i -j ACCEPT;
PostDown = iptables -D FORWARD -o %i -j ACCEPT;
PostDown = iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# 定义允许接入虚拟网络的客户端，每个Peer表示一个客户端
[Peer]
# 客户端 A 公钥
PublicKey = [CLIENT_A/pubkey]
# 允许该客户端使用的 IP 地址，通常用/32以完全限定 IP
AllowedIPs = 10.8.0.2/32

[Peer]
# 客户端 B 公钥
PublicKey = [CLIENT_B/pubkey]
# 允许该客户端使用的 IP 地址，通常用/32以完全限定 IP
AllowedIPs = 10.8.0.3/32
```

客户端

```ini
[Interface]
# 客户端私钥，填入client_private.key的内容
PrivateKey = [CLIENT/key]
# 虚拟局域网地址
Address = 10.8.0.2/24

[Peer]
# 服务器端公钥
PublicKey = [SERVER/pubkey]
# 路由规则，允许的IP范围，这一值决定哪些流量会通过WireGuard服务器
AllowedIPs = 10.8.0.0/24
# 服务器端公网地址:端口，需要放行指定端口的 UDP 协议
Endpoint = [SERVER/ip:port]
# 保活消息发送间隔，单位为秒
PersistentKeepalive = 25
```

### 2.2. AllowedIPs

| 配置位置     | `AllowedIPs` 值 | 含义                       | 作用                                                                           |
| ------------ | --------------- | -------------------------- | ------------------------------------------------------------------------------ |
| **服务器端** | `10.8.0.2/32`   | 允许客户端使用的源 IP      | 1. 身份验证（哪个 IP 对应哪个公钥）<br>2. 路由决策（发往 10.8.0.2 的流量给谁） |
| **客户端端** | `10.8.0.0/24`   | 客户端要加密的目标 IP 范围 | 1. 决定哪些流量走 VPN<br>2. 路由分流                                           |

**例：**

服务器端

```ini
[Interface]
Address = 10.8.0.1/24
ListenPort = 51820
PrivateKey = [SERVER/key]

[Peer]
PublicKey = [CLIENT/pubkey]
AllowedIPs = 10.8.0.2/32  # 仅允许客户端用10.8.0.2
```

```mermaid
flowchart TD
    A[服务器收到数据包] --> B{数据包类型判断}

    B -->|来自互联网<br>目标: 10.8.0.2| C[查找路由表]
    B -->|来自客户端<br>源IP: 10.8.0.2| D[验证身份]

    C --> E{哪个Peer的AllowedIPs<br>包含10.8.0.2?}
    E -->|Peer A: 10.8.0.2/32| F[✅ 转发给客户端A]
    E -->|无匹配| G[❌ 丢弃数据包]

    D --> H{客户端A的AllowedIPs<br>是否包含10.8.0.2?}
    H -->|是: 10.8.0.2/32| I[✅ 身份验证通过]
    H -->|否| J[❌ 拒绝连接]

    I --> K{目标IP判断}
    K -->|10.8.0.x| L[转发到VPN内网]
    K -->|其他IP| M[通过NAT转发到互联网]

    F --> N[通过WireGuard隧道发送]

    subgraph "服务器核心功能"
        C
        D
    end

    subgraph "AllowedIPs双重作用"
        E
        H
    end
```

客户端

```ini
[Interface]
Address = 10.8.0.2/24
PrivateKey = [CLIENT/key]

[Peer]
PublicKey = [SERVER/pubkey]
Endpoint = [SERVER/ip:port]
AllowedIPs = 10.8.0.0/24  # 访问 VPN 内网都走隧道
```

```mermaid
flowchart TD
    A[客户端] --> B{目标IP判断}
    B -->|10.8.0.x| C[WireGuard加密隧道]
    B -->|其他所有IP| D[正常互联网连接]

    C --> E[隧道服务器]
    E --> F[访问隧道内网]

    D --> G[ISP]
    G --> H[其他网站]

    subgraph "流量分离"
        C
        D
    end
```
