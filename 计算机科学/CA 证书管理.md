# CA 证书管理

[TOC]

## 1. 使用 openssl 快速生成证书

### 1.1. 生成证书

创建 `san.cnf`，下面的配置以 <https://myserver.lan> 为例

```ini
[req]
default_bits       = 2048
distinguished_name = req_distinguished_name
req_extensions     = req_ext
x509_extensions    = v3_req
prompt             = no

[req_distinguished_name]
CN = myserver.lan

[req_ext]
subjectAltName = @alt_names

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.1 = myserver.lan
```

运行以下命令，使用该 `san.cnf` 生成证书

```bash
openssl req -x509 -nodes \
    -days 3650 \
    -newkey rsa:2048 \
    -keyout myserver.lan.key \
    -out myserver.lan.crt \
    -config san.cnf \
    -extensions v3_req
```

执行后会生成证书文件 `myserver.lan.crt` 与对应的密钥文件 `myserver.lan.key`。

### 1.2. 添加证书到证书库

```bash
sudo cp myserver.lan.crt /usr/local/share/ca-certificates/
```

### 1.3. 更新证书信息

```bash
update-ca-certificates
```

---

## 2. 使用 XCA 生成带根证书的证书

如果根证书和网站证书都是你自己发，XCA 可以直接帮省掉“生成 CSR（申请表）”这个中间步骤！在 XCA 里，你既是“申请人”又是“公安局”，所以你可以直接掏出根证书给网站盖章。

总体步骤如下：

1. 建个 Root CA（选 Certification Authority）。
2. 建个 Server Cert（选 Sign with Root CA，填好 SAN 扩展）。
3. 导出。

### 2.1. 准备工作

1. 打开 XCA，点击左上角 `File` -> `New DataBase`。
2. 随便起个名字（比如 `home-ca.xdb`），设置一个数据库密码（**记住这个密码**，以后每次打开都要用）。

### 2.2. 第一阶段：生成 Root CA

这是你整个内网的信任源头，**只做一次**。

1. 点击顶部的 **`Certificates` (证书)** 选项卡。
2. 点击右侧的 **`New Certificate` (新建证书)**。
3. 弹出新窗口，按以下顺序填：
    * **`Source` (来源) 选项卡：**
        * 勾选 `Create a self signed certificate` (创建自签名证书)。
        * Signature algorithm (签名算法) 选 `SHA 256`。

    * **`Subject` (主题) 选项卡：**
        * `Internal name` (内部名称，仅 XCA 显示用)：填 `My Home Root CA`。
        * `commonName` (CN)：填 `My Home Root CA`（千万别填域名）。
    * 点击下方的 **`Generate a new key` (生成新私钥)** 按钮 -> 弹窗中选 `RSA`，大小选 `4096` -> 点击 `Create`。

    * **`Extensions` (扩展) 选项卡：**
        * `Type` (类型)：下拉选择 **`Certification Authority` (证书颁发机构)**。
        * `Time range` (有效期)：拉到最长，比如 `10 years`。
4. 点击右下角 **`OK`**。
*恭喜，你的根证书（带私钥）创建完毕！你会在列表中看到它。*

### 2.3. 第二阶段：生成 Server 证书并盖章

以后你每增加一个内网服务（比如 `git.home`、`nas.home`），就重复一次这个阶段。

1. 依然在 **`Certificates`** 选项卡，点击 **`New Certificate`**。
2. 弹出新窗口，按以下顺序填：
    * **`Source` (来源) 选项卡：**
        * 勾选 `Use this Certificate for signing` (使用此证书进行签名)。
        * 在下拉菜单中，**选中你刚才创建的 `My Home Root CA**`（这步就是“盖章”！）。
        * Signature algorithm 选 `SHA 256`。
    * **`Subject` (主题) 选项卡：**
        * `Internal name`：填 `git.home`。
        * `commonName` (CN)：填 `git.home`。
        * 点击下方的 **`Generate a new key`** 按钮 -> 选 `RSA`，大小 `2048` 就够了 -> `Create`。
    * **`Extensions` (扩展) 选项卡（最重要的一步！）：**
        * `Type` (类型)：下拉选择 **`End Entity`** 或 **`Server`**（表示这是终端服务器证书）。
        * `Time range` (有效期)：建议填 `825 days`（苹果设备的上限）或 `1 year`。
    * **添加 SAN (备用名称)：** 找到 `X509v3 Subject Alternative Name`，点击右侧的 **`Edit` (编辑)**。
        * 在弹出的框里选 `DNS`，并填入 `git.home`。
        * 如果你通过 IP 访问，再加一行，选`IP` 并填入 `192.168.1.100`。
        * 点击 `Apply` (应用)。
3. 点击右下角 **`OK`**。

> 现在，在证书列表中，你会看到 `git.home` 像个子节点一样，挂在 `My Home Root CA` 的下面，层级关系非常清晰。

### 2.4. 第三阶段：导出证书与秘钥文件

配置做好了，怎么把 `.crt` 和 `.key` 文件拿出来？

**1. 导出网站证书和私钥（给服务器/Nginx 用）：**

* **证书：** 在 `Certificates` 列表中选中 `git.home` -> 点击右侧 `Export` -> Export Format 选择 `PEM (*.crt)` -> 选好保存路径，导出。这就是你的 **`server.crt`**。
* **私钥：** 切换到顶部的 **`Private Keys`** 选项卡 -> 选中 `git.home` 对应的钥匙 -> 点击右侧 `Export` -> Export Format 选 `PEM private (*.pem)` -> 导出。这就是你的 **`server.key`**。

**2. 导出根证书（给你的电脑/手机信任用）：**

* 在 `Certificates` 列表中选中 `My Home Root CA` -> 导出为 `PEM (*.crt)`。
* **（极其重要）千万不要去 `Private Keys` 里导出根证书的私钥！就让它死死锁在 XCA 的数据库里！**
