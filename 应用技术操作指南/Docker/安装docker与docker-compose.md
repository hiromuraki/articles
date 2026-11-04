```bash
# 创建 /etc/apt/keyrings 目录（用于存储APT源的GPG密钥）
# -p 参数：自动创建父目录（如果不存在）
sudo mkdir -p /etc/apt/keyrings


# 下载Docker官方GPG密钥并保存到本地
# -fsSL 参数组合：
#   -f (--fail)：静默失败（不输出错误页）
#   -s (--silent)：静默模式
#   -S (--show-error)：显示错误（与-s配合）
#   -L (--location)：跟随重定向
# | sudo gpg --dearmor：将下载的ASCII格式密钥转换为二进制格式
# -o 参数：指定输出文件路径
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg


# 添加Docker的APT源到系统源列表
# [arch=$(dpkg --print-architecture)]：自动匹配当前系统架构（如amd64/arm64）
# signed-by=：指定验证源的GPG密钥路径
# $(lsb_release -cs)：获取当前系统的Ubuntu代号（如jammy/focal）
# | sudo tee：将内容写入文件（需要root权限）
# > /dev/null：丢弃标准输出（不显示在终端）
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null


# 更新本地软件包索引（使新添加的Docker源生效）
sudo apt update


# 安装Docker
sudo apt install docker.io

# 安装Docker Compose插件（官方推荐的插件式安装）
# docker-compose-plugin：提供`docker compose`子命令（注意没有横线）
sudo apt install docker-compose-plugin
```
