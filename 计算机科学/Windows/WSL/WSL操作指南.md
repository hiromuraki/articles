## 1. 进阶操作

### 1.1. 压缩 WSL 磁盘

在 WSL 中清理缓存文件

```bash
rm -rf ~/.cache/*
rm -rf /tmp/*
```

填充空闲空间

```bash
sudo dd if=/dev/zero of=/zero.fill bs=1M && sudo rm -f /zero.fill
```

完全关闭 WSL

```bash
wsl --shutdown
```

运行 diskpart

```bash
diskpart
```

在 diskpart 中执行如下命令

```bash
SELECT VDISK FILE="path/to/wsl/vdisk/ext4.vhdx"

COMPACT VDISK

DETACH VDISK

EXIT
```

> 注：可使用以下脚本确定已安装的 WSL 系统的目录，WSL 磁盘文件通常为安装目录下的 ext4.vhdx 文件

```powershell
Get-ChildItem HKCU:\Software\Microsoft\Windows\CurrentVersion\Lxss\ | ForEach-Object {
     $distro = Get-ItemProperty $_.PSPath
     [PSCustomObject]@{
         Name = $distro.DistributionName
         BasePath = $distro.BasePath
     }
}
```
