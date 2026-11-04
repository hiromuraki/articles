## 用户管理

**相关文件**
|路径 |说明 |
|-|-|
|/etc/group |存储组信息 |
|/etc/gshadow |存储组安全信息 |
|/etc/login.defs|组创建的默认设置|

**用户**

```bash
# 添加用户
sudo useradd -m <username>

# 设置用户密码
sudo passwd <username>

# 切换到用户
sudo -u <username> -s
```

**组**

```bash
# 查看当前用户的组
groups

# 列出所有组
cat /etc/group

# 创建新组
sudo groupadd [group_name]

# 删除组
sudo groupdel [group_name]

# 重命名组
sudo groupmod -n [new_group_name] [group_name]

# 添加指定用户到组
sudo usermod -aG [group_name] [user_name]

# 从组中移除指定用户
sudo deluser [user_name] [group_name]
# sudo gpasswd -d [user_name] [group_name]
```

## sudo 权限配置

**为指定用户添加 sudo 权限**
root 用户打开`/etc/sudoers`，找到以下位置写入

```bash
# User privilege specification
root         ALL=(ALL:ALL) ALL
<username>   ALL=(ALL:ALL) ALL # 添加此行
```

**为组添加 sudo 权限**
root 用户打开`/etc/sudoers`，找到以下位置写入

```bash
# Members of the admin group may gain root privileges
%admin ALL=(ALL) ALL # 示例：设置admin组
```
