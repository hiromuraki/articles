# Linux .NET 安装指南

## 1. 安装依赖库

```bash
sudo apt update -y \
    ca-certificates \
    libc6 \
    libgcc-s1 \
    libicu74 \
    liblttng-ust1 \
    libssl3 \
    libstdc++6 \
    zlib1g
```

## 2. 安装 .NET

### 2.1. 方案一：通过包管理器安装

**添加 .NET 后移植包存储库：**

```bash
sudo add-apt-repository ppa:dotnet/backports
```

**安装 SDK：**

```bash
sudo apt update && sudo apt install dotnet-sdk-9.0
```

**安装运行时：**

```bash
# .NET Core
sudo apt update && sudo apt-get install dotnet-runtime-9.0

# ASP.NET Core
sudo apt update && sudo apt-get install aspnetcore-runtime-9.0
```

### 2.2. 方案二：手动安装

**下载并解压 .NET 二进制包：**

<https://dotnet.microsoft.com/zh-cn/download>

```bash
wget https://builds.dotnet.microsoft.com/dotnet/Sdk/9.0.203/dotnet-sdk-9.0.203-linux-x64.tar.gz
mkdir -p "$HOME/local/app/dotnet"
tar zxf dotnet-sdk-*-linux-*.tar.gz -C "$HOME/local/app/dotnet"
```

**设置环境变量：**

```bash
DOTNET_ROOT=$HOME/local/app/dotnet
PATH=$DOTNET_ROOT:$DOTNET_ROOT/tools:$PATH
```
