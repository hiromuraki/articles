# 记一次 Gitea + WireGuard 访问“假死”问题的排查：从 MSS Clamping 到 MTU 1500

## 1. 背景与环境

为了搭建一套自托管的代码托管与 CI/CD 平台，我使用了 **Gitea + Act Runner** 的 Docker 部署方案。为了实现安全的远程访问，所有的服务都跑在 **WireGuard** 组建的虚拟局域网内。

**基础环境：**

- **服务端**：WSL 2 (Ubuntu 24.04) + Docker
- **网络**：WireGuard (MTU 1280)
- **客户端**：Windows 11 / VMware / WSL
- **核心组件**：Gitea (Port 3000), Act Runner

## 2. 问题现象

在部署完成后，出现了一个非常诡异的网络现象：

1. **TCP 层通畅**：`telnet` 或 `nc` 连接 3000 端口秒通。
2. **ICMP 通畅**：`ping` Gitea 服务器完全正常。
3. **HTTP 假死**：

- 使用浏览器访问 `http://<WG-IP>:3000`，一直转圈，最终超时。
- 使用 `curl -v` 测试，卡在 `GET / HTTP/1.1` 发送之后，收不到任何响应头。

初看以为是防火墙或 Gitea 配置错误，但 `ss -tlup` 显示端口监听在 `0.0.0.0:3000`，且本地访问正常，唯独通过 WireGuard 隧道访问异常。

---

## 3. 排查过程

### 3.1. 初步怀疑：MTU/MSS 问题

由于 WireGuard 的 MTU (1280) 小于标准以太网 (1500)，这是典型的 **“小管道挤大包”** 问题。

- Gitea 容器默认发出 1500 字节的大包。
- 数据包到达宿主机，要进入 1280 的 WireGuard 隧道。
- 如果中间链路不支持分片或 PMTU 发现机制（ICMP 被拦截），大包会被静默丢弃，导致 HTTP 假死。

**尝试方案 A：MSS Clamping**
试图通过 iptables 强制钳制 TCP MSS，让双方协商更小的数据段：

```bash
sudo iptables -t mangle -A FORWARD -p tcp -m tcp --tcp-flags SYN,RST SYN -j TCPMSS --clamp-mss-to-pmtu

```

**结果**：无效。问题依旧。

### 3.2. 关键测试：Ping 大包探测

为了摸清链路到底能过通过多大的包，使用了 `ping` 的“禁止分片”功能进行探测。

```bash
# Windows / WSL 客户端测试
ping -f -l <数据载荷> <服务端WG_IP>

```

测试结果令人震惊：

- `ping -f -l 1240` -> **不通**
- `ping -f -l 1188` -> **通** (这是最大极限)

### 3.3. 真相计算

通过 1188 这个数字，反推出了网络链路的真实瓶颈：

**结论**：
包含 WireGuard 包头在内的**最外层物理数据包**，刚好卡在 1280 字节时能通过。
这意味着，**宿主机的物理网卡（或底层网络）被错误地限制在了 MTU 1280。**

之前 WireGuard 设置为 1280 时，加上包头就会变成 ~1344 字节，直接被物理网卡丢弃，导致发不出包。

### 3.4. 最终验证

检查服务端 (WSL) 的物理网卡配置：

```bash
ip addr show eth0
# 输出显示：mtu 1280
```

果然，WSL 的 `eth0` 不知何时被改成了 1280。

---

## 4. 解决方案

### 4.1. 修正物理链路 MTU

将宿主机的物理网卡恢复为标准的 1500：

```bash
sudo ip link set dev eth0 mtu 1500

```

修改后瞬间，Gitea 页面秒开，所有访问恢复正常。

### 4.2. 清理临时 Debug 配置

既然物理链路恢复了 1500，之前为了排查而做的 MSS Clamping 就不再需要了，将其撤回以保持系统整洁：

```bash
# 查看 mangle 表规则行号
sudo iptables -t mangle -L -n -v --line-numbers

# 根据行号删除 (假设是第 1 行)
sudo iptables -t mangle -D FORWARD 1
sudo iptables -t mangle -D OUTPUT 1

```

### 4.3. 优化 Docker 配置（可选）

为了获得最佳性能，建议将 Docker 容器的 MTU 设置为适配 WireGuard 的值（1420），避免不必要的分片。

修改 `/etc/docker/daemon.json`：

```json
{
    "mtu": 1420
}
```

重启 Docker：`sudo systemctl restart docker`。

---

## 5. 根源分析

既然 `eth0` 被配置为 1280这个非常恰当的数字（和WireGuard的限制相同），在调回后重启WSL时`eth0`又变成了1280，那么一定是在某处发生了错误配置。

经过排查，实际原因是在启动WSL时Windows已经打开了WireGuard，而WSL有一个机制：为了防止“黑洞”问题（即 WSL 发出的包太大，被宿主机网卡或中间链路丢弃），WSL 会尝试自动适配宿主机上所有活动网卡中 最小的 MTU。

所以当Windows上的WireGuard链接后，活动网卡中最小的MTU就变成了1280，此时WSL就将 `eth0` 的MTU设为1280了。

**解决方法：**
修改WSL下的 `/etc/wsl.conf`，添加以下配置

```bash
[boot]
# 强制在 WSL 启动时将 eth0 的 MTU 设置为 1500
command = ip link set dev eth0 mtu 1500
```

之后WSL便会在每次启动时将 `eth0` 的MTU强制改为1500。

---

## 6. 总结：正确的网络架构

经过此次折腾，明确了在 Overlay 网络（如 WireGuard/VPN）环境下，健康的 MTU 阶梯应该如下：

```mermaid
graph TD
    subgraph Layer1 [物理层/宿主机]
        Eth0[物理网卡 (eth0)]
        Note1[MTU: 1500 (标准)]
    end

    subgraph Layer2 [隧道层/WireGuard]
        WG0[WireGuard 接口 (wg0)]
        Note2[MTU: 1420 (留 80 字节给协议头)]
    end

    subgraph Layer3 [应用层/Docker]
        Docker[容器网卡 (eth0)]
        Note3[MTU: 1420 (匹配隧道)]
    end

    Docker --> WG0 --> Eth0

```

- **物理层必须最大 (1500)**：承载所有上层协议的开销。
- **隧道层适度减小 (1420)**：扣除隧道协议头（WireGuard 约 60-80 字节）。
- **应用层匹配隧道 (1420)**：防止容器发出大包导致二次分片或丢包。
