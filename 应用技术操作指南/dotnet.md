## 1.安装

### 依赖

**安装依赖库**

```bash
sudo apt update
sudo apt install -y ca-certificates
sudo apt install -y libc6
sudo apt install -y libgcc-s1
sudo apt install -y libicu74
sudo apt install -y liblttng-ust1
sudo apt install -y libssl3
sudo apt install -y libstdc++6
sudo apt install -y zlib1g
```

### 通过包管理器

**添加 .NET 后移植包存储库**

```bash
sudo add-apt-repository ppa:dotnet/backports
```

**安装 Sdk**

```bash
sudo apt update && sudo apt install dotnet-sdk-9.0
```

**安装运行时**

```bash
# .NET Core
sudo apt update && sudo apt-get install dotnet-runtime-9.0

# ASP.NET Core
sudo apt update && sudo apt-get install aspnetcore-runtime-9.0
```

### 手动安装

**下载 .NET 二进制包**

https://dotnet.microsoft.com/zh-cn/download

```bash
wget https://builds.dotnet.microsoft.com/dotnet/Sdk/9.0.203/dotnet-sdk-9.0.203-linux-x64.tar.gz
mkdir -p "$HOME/local/dotnet/9"
tar zxf dotnet-sdk-*-linux-*.tar.gz -C "$HOME/local/dotnet/9"
```

**环境变量**

```bash
DOTNET_ROOT=$HOME/local/dotnet/9
PATH=$DOTNET_ROOT:$DOTNET_ROOT/tools:$PATH
```
