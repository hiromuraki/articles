## 配置 apt 源

```bash
sudo nano /etc/apt/sources.list.d/custom.list
```

填入以下内容

```
# 中科大源
deb [arch=amd64] https://mirrors.ustc.edu.cn/ubuntu/ plucky main restricted universe multiverse
```

## apt 更新

```bash
sudo apt-get update

sudo apt-get upgrade
```
