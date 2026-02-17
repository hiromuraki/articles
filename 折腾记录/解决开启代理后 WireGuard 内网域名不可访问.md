# 解决开启代理后 WireGuard 内网域名不可访问

**现象：**

若使用内网的 DNS 做内网域名解析，则在开启 Clash 后可能会导致域名无法正确解析，遭遇 `PR_END_OF_FILE_ERROR` 或 `ERR_CONNECTION_CLOSED` 报错

**解决方法：**

根本原因不在于你的内网服务挂了，而是 **Clash 的 DNS 劫持机制（尤其是 Fake-IP 模式）把你的内网流量“拐跑了”，然后远程代理节点又无法解析你的内网域名，最终导致 TLS 握手失败，连接被强行掐断。**

我们来理一下底层的“作案过程”，然后给出精准的终极解决方案。

## 1. 🕵️‍♂️ 案情重演：Clash 是怎么弄坏你的内网的？

1. **DNS 劫持 (Fake-IP)**：你浏览器输入 `nextcloud.myhome.lan`。Clash 瞬间拦截了这个 DNS 请求，并且为了提速，它根本没去问你的 WireGuard DNS，而是直接伪造了一个假 IP（比如 `198.18.0.5`）丢给浏览器。
2. **流量黑洞**：浏览器拿到假 IP 后，开开心心地发起 HTTPS 请求。Clash 接管了这个请求，并把它打包发给了你的**远程代理节点（比如位于香港或美国的 VPS）**。
3. **案发现场**：远程节点拿到请求一看：“你要访问 `nextcloud.myhome.lan`？我这公网上根本没这个域名啊！” 于是节点直接拒绝服务，掐断了连接。
4. **报错表现**：你的浏览器因为在 SSL/TLS 握手阶段被强行挂断了电话，所以 Firefox 报了文件尾错误（`END_OF_FILE`），Chrome 报了连接关闭（`CONNECTION_CLOSED`）。

---

## 2. 🛠️ 解法：教 Clash “认清自己人”

要解决这个问题，我们需要在 Clash 的配置文件（YAML）中进行三步极其精准的外科手术。不管你用的是 Clash for Windows、Clash Verge 还是 OpenClash，底层的 YAML 配置逻辑都是通用的。

你需要修改 Clash 的配置（通常在 `parsers` 预处理，或者直接编辑配置/使用 Mixin 混入）：

### 2.1. 第一步：让内网域名绕过 Fake-IP (DNS 豁免)

你必须告诉 Clash：“遇到我的内网域名，别给我塞假 IP，去老老实实查真 IP！”

在 Clash 配置的 `dns` 层级下，找到或添加 `fake-ip-filter`：

```yaml
dns:
  enable: true
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  fake-ip-filter:
    - '*.lan'               # 如果你的内网域名是 .lan 结尾
    - '*.yourdomain.com'    # 【核心】替换成你在 WireGuard 内网用的真实域名后缀

```

### 2.2. 第二步：指定内网 DNS 解析服务器 (nameserver-policy)

绕过了 Fake-IP 还不够，Clash 默认会用公共 DNS（如 114.114.114.114 或 8.8.8.8）去查真实 IP，公共 DNS 当然查不到你的内网 IP。
所以，我们要用 `nameserver-policy` 强行指定：**只有这个域名，去问 WireGuard 的 DNS 要 IP。**

还在 `dns` 层级下：

```yaml
dns:
  # ... 前面的配置
  nameserver-policy:
    '*.yourdomain.com': '10.0.0.1'  # 【核心】前面是内网域名，后面替换成你 WireGuard 内网的 DNS 服务器 IP

```

### 2.3. 第三步：流量路由绕过代理 (Rules)

DNS 解析正确拿到内网 IP（比如 `10.0.0.5`）后，我们还要确保 Clash 不会把发往 `10.0.0.5` 的流量扔给代理节点。

在配置的最底部的 `rules` 列表中，**确保这几行规则放在最前面**（Clash 是按顺序匹配的）：

```yaml
rules:
  # 1. 直接指定域名直连
  - DOMAIN-SUFFIX,yourdomain.com,DIRECT
  # 2. 告诉 Clash，WireGuard 的整个网段都直连 (假设你 WG 网段是 10.0.0.0/24)
  - IP-CIDR,10.0.0.0/24,DIRECT
  # 3. 局域网 IP 直连 (通常 Clash 自带这条，确保它存在)
  - GEOIP,LAN,DIRECT

```

---

## 3. 💡 额外避坑：TUN 模式的特殊处理

如果你开启了 Clash 的 **TUN 模式**（也就是虚拟网卡接管全局流量），Clash 可能会在更底层的路由表级别和 WireGuard 抢夺网卡的控制权。

如果你在完成上述三步后依然无法访问，需要在 TUN 配置里排除 WireGuard 的网段：

```yaml
tun:
  enable: true
  stack: system # 或 gvisor
  auto-route: true
  auto-detect-interface: true
  dns-hijack:
    - any:53
  # 【新增】这里排除 WireGuard 的网段，让 Clash 的虚拟网卡完全忽略它
  skip-proxy:
    - 10.0.0.0/24  # 替换为你的 WireGuard 网段

```
