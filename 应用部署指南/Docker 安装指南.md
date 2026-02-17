# Docker 安装指南

[TOC]

## 1. 准备环境

### 1.1. 清理潜在冲突包

- apt

```bash
sudo apt remove docker.io \
    docker-doc \
    docker-compose \
    docker-compose-v2 \
    podman-docker \
    containerd \
    runc
```

- yum/dnf

```bash
sudo dnf remove docker.io \
    docker-doc \
    docker-compose \
    docker-compose-v2 \
    podman-docker \
    containerd \
    runc
```

### 1.2. 配置 Docker 仓库

- Apt

添加 Docker 的官方 GPG 秘钥

```bash
sudo apt update
sudo apt install ca-certificates curl
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
```

将仓库添加到 APT 源

```bash
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
```

- Yum/Dnf

安装 dnf-plugins-core

```bash
sudo dnf install dnf-plugins-core
```

配置仓库

```bash
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

## 2. 安装 Docker

- apt

```bash
sudo apt install docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-buildx-plugin \
    docker-compose-plugin
```

- yum/dnf

```bash
sudo dnf install docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-buildx-plugin \
    docker-compose-plugin
```

## 3. 验证 Docker 运行状态

启动 Docker 服务

```bash
sudo systemctl start docker
```

启用 Docker 服务自启

```bash
sudo systemctl enable docker
```

检查 Docker 服务状态

```bash
sudo systemctl status docker
```

## 4. 配置镜像源

编辑 /etc/docker/daemon.json 文件，修改为以下内容

```json
{
    "registry-mirrors": [
        "https://docker.mirror1.run"
    ]
}
```

国内镜像源

1. <https://docker.1ms.run>

重启 Docker 服务

```bash
sudo systemctl restart docker
```

## 5. 配置用户组

将当前用户添加到 docker 组

```bash
sudo usermod -aG docker $USER
```

添加后重新登录以应用更改

## 6. 运行测试用例

```bash
docker run hello-world
```

成功后输出如下

```text
Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```
