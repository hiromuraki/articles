# Windows SSH 配置指南

## 1. 安装 OpenSSH

三个方案任选一个

**(1) 手动安装**

1. 进入 [https://github.com/PowerShell/Win32-OpenSSH/](https://github.com/PowerShell/Win32-OpenSSH/)，下载压缩包并解压到特定路径

2. 使用 PowerShell 执行目录下的 `install-sshd.ps1` 以自动配置

**(2) 使用 PowerShell 命令安装**

```powershell
# Install the OpenSSH Client
Add-WindowsCapability -Online -Name OpenSSH.Client

# Install the OpenSSH Server
Add-WindowsCapability -Online -Name OpenSSH.Server
```

**(3) 通过系统的“查看或编辑可选功能”安装**

在查看功能中安装以下功能

1. OpenSSH 客户端
1. OpenSSH 服务器

安装后执行以下命令检查是否成功

```powershell
Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH*'
```

## 2. 编辑配置文件

编辑 `C:\ProgramData\ssh\sshd_config`，调整配置，并将下述两行进行注释（否则会有权限问题）

```bash
# Match Group administrators
#       AuthorizedKeysFile
```

## 3. 启动 sshd 服务

```powershell
Start-Service sshd
```

使用以下命令以设置 SSH 服务自启

```powershell
Set-Service -Name sshd -StartupType "Automatic"
```
