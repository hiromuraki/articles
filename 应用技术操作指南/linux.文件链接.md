## 创建链接

**软连接**

```bash
ln -s [target_path] [link_path]
```

**硬链接**

```bash
ls -s [target_path] [link_path]
```

## 查看链接信息

```bash
# 查看硬链接inode号
ls -i

# 查看实际指向
readlink [link_path]

# 查看链接计数
stat [file_name]
```
