# Hadoop 部署指南

## 1.前言

本指南假定你有如下基础

1. 对 Linux 命令行操作有一定了解

本指南将尽可能避免关键应用使用包管理器甚至 Docker 安装，这一做法是为了尽可能让安装的每一步都可见，以让用户更完整地理解 Hadoop 的部署流程。在实际的部署流程中请优先考虑使用包管理器或者 Docker。

## 2.部署

### 2.1.安装 Linux 虚拟机（Ubuntu）

> 若你已安装过 Linux 虚拟机或正在以任一 Linux Debian 系发行版作为主力系统，则可跳过此节。若你正在使用 WSL2 也可跳过此节，但强烈建议安装一个环境完全隔离的虚拟机。

出于个人喜好，本节介绍如何在 VirtualBox 上安装 Ubuntu 24.04.3 Server。VirtualBox 是由 Oracle 所发行的一款开源虚拟机；Ubuntu 24.04.3 Server 是一种 Debian 系的 Linux 发行版，Server 后缀表示为适用于服务器的版本，最直观的特点就是默认为纯命令行环境（反正后续操作本身就基本全在命令行中完成，图形界面基本用不到）。

你也可以选择 VMware Workstation 与 Ubuntu 24.04.3 Desktop，并不影响后续安装 Hadoop。

**(1) 下载并安装 VirtualBox**
进入 Oracle VirtualBox 下载页面（https://www.virtualbox.org/wiki/Downloads）下载`Windows hosts`并执行安装（此时的最新版为 7.2.2）。

由于安装界面是纯图形安装，根据说明安装即可（基本上一路下一步就行），具体过程不再赘述。但关于安装选项请使用如下设置

![img](virtualbox_installation_configuration.png)

**(2) 下载 Ubuntu 24.04 Server 镜像**

为了简单，这里使用清华的镜像源，直接使用下述地址下载即可

> https://mirrors.tuna.tsinghua.edu.cn/ubuntu-releases/24.04.3/ubuntu-24.04.3-live-server-amd64.iso

下载完成后得到一个大小约 3GB，名为 `ubuntu-24.04.3-live-server-amd64` 的文件，其 sha256 为 faabcf33ae53976d2b8207a001ff32f4e5daae013505ac7188c9ea63988f8328

**(3) 使用 VirtualBox 创建 Ubuntu 虚拟机**

运行 VirtualBox，出现以下界面

![img](virtualbox_first_launch.png)

右下角的 Please choose Experience Model 选择 `Expert Mode`，然后点击顶部的蓝色 `新建` 按钮，按下图填写各字段

注：`VM Folder` 的路径请根据自身实际情况修改，这个目录是存储虚拟机文件的目录，空间占用通常能打到数十 GB 甚至数百 GB。

![img](virtualbox_new_machine.png)

点击 `完成`，在主菜单再点击顶部的绿色 `启动` 按钮

![img](virtualbox_launch_machine.png)

弹出以下界面

![img](virtualbox_add_cd.png)

点开 `光驱` 字段输入框右侧的箭头，选 `其他`，会弹出一个文件选择窗口，选择之前下载的 `ubuntu-24.04.3-live-server-amd64.iso` 文件，然后选择 `尝试挂载并启动`，之后会进入 Ubuntu 安装界面。如下图

![img](ubuntu_installation_entry.png)

注：如果你的鼠标无法从虚拟机中移出，请按一下右 Ctrl 键

选择 Try or Install Ubuntu Server，后续的安装就是标准的 Ubuntu Server 安装，实际操作基本只需一直选 Done，具体过程不再阐述。下图是部分设置项的示例

![img](ubuntu_installation_profile_configuration.png)

（这里设置的用户名为 user，密码为 123456）

![img](ubuntu_installation_ssh_configuration.png)
![img](ubuntu_installation_featured_server_snaps.png)
![img](ubuntu_installation_done.png)

等待安装完成后第一次重启可能弹出以下界面

![img](ubuntu_installation_done_reboot.png)

此处直接按回车键等待 Reboot 就行，VirtualBox 会自动卸载虚拟光驱。

**(4) Linux 基本环境设置**

进入系统后会显示以下界面

![img](ubuntu_main_login.png)

输入在先前安装中设置中的用户名和密码即可登入系统，成功后如下

![img](ubuntu_main.png)

至此，Ubuntu Server 安装完成。

**(5) 创建快照**

这一步给刚装好的 Ubuntu Server 系统创建一个初始状态的快照，后续操作若出现难以撤销的失误操作可以直接回退到快照状态，避免再次安装的繁琐。

暂时关闭虚拟机中的 Ubuntu Server 系统，然后在 VirtualBox 中按以下操作创建快照

![img](virtualbox_create_init_snapshot.png)

创建后重新启动 Ubuntu Server 系统即可。

### 2.2.部署 Hadoop

从这一步开始就是安装 Hadoop 的流程。

#### 2.2.1.创建 hadoop 用户

执行以下命令创建并切换到 hadoop 用户

```bash
sudo useradd -m hadoop -s /bin/bash
sudo passwd hadoop
su hadoop
cd ~
```

#### 2.2.2.安装 java 运行环境

接着在 hadoop 用户下安装 Hadoop 所需的 Java 环境，此处采用 Temurin JDK 21。

执行以下命令，将 Temurin JDK 21 二进制包下载到 ~/downloads 目录并解包

```bash
mkdir downloads && cd downloads
wget https://mirrors.tuna.tsinghua.edu.cn/Adoptium/21/jdk/x64/linux/OpenJDK21U-jdk_x64_linux_hotspot_21.0.8_9.tar.gz
tar -xf OpenJDK21U-jdk_x64_linux_hotspot_21.0.8_9.tar.gz
```

执行以下命令使用 vim 修改 bash 配置文件

```bash
vim ~/.bashrc
```

在 ~/.bashrc 文件的行尾添加以下内容

```bash
export JAVA_HOME="/home/hadoop/downloads/jdk-12.0.8+9"
export PATH=$JAVA_HOME/bin:$PATH
```

保存修改，然后执行以下命令应用修改

```bash
source ~/.bashrc
```

执行以下命令，若正常输出 java 版本信息说明安装成功

```bash
java --version

# 示例输出
# openjdk 21.0.8 2025-07-15 LTS
# OpenJDK Runtime Environment Temurin-21.0.8+9 (build 21.0.8+9-LTS)
# OpenJDK 64-Bit Server VM Temurin-21.0.8+9 (build 21.0.8+9-LTS, mixed # mode, sharing)
```

#### 2.2.3.安装 hadoop

执行以下命令，将 hadoop 二进制包（hadoop-3.4.2.tar）下载到 downloads 目录中并解包

```bash
cd ~/downloads
wget https://mirrors.tuna.tsinghua.edu.cn/apache/hadoop/common/hadoop-3.4.2/hadoop-3.4.2.tar
tar -xf ./hadoop-3.4.2.tar
```

执行以下命令，使用 vim 再次编辑 ~/.bashrc 文件

```bash
vim ~/.bashrc
```

在 ~/.bashrc 的行尾添加以下内容

```bash
export HADOOP_HOME="/home/hadoop/downloads/hadoop-3.4.3"
export PATH=$HADOOP_HOME/bin:$PATH
```

保存修改，然后执行以下命令应用修改

```bash
source ~/.bashrc
```

执行以下命令，若正常输出 hadoop 版本信息说明安装成功

```bash
hadoop version

# 示例输出
# Hadoop 3.4.2
# 下略
```
