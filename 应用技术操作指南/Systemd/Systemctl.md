```bash
# 立即启动一个服务
sudo systemctl start apache.service

# 立即停止一个服务
sudo systemctl stop apache.service

# 重启一个服务
sudo systemctl restart apache.service

# 杀死一个服务的所有子进程
sudo systemctl kill apache.service

# 重新加载一个服务的配置文件
sudo systemctl reload apache.service

# 重载所有修改过的配置文件
sudo systemctl daemon-reload

# 显示某个 Unit 的所有底层参数
systemctl show httpd.service

# 显示某个 Unit 的指定属性的值
systemctl show -p CPUShares httpd.service

# 设置某个 Unit 的指定属性
sudo systemctl set-property httpd.service CPUShares=500
```
