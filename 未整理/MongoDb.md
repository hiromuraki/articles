## 1. 安装 mongodb

```bash
mkdir -p "$HOME/local/mongodb"
tar xf $File -C "$HOME/local/mongodb"
export PATH=$USER_LOCAL/mongodb/bin:$PATH
```

## 2. 安装 mongosh

```bash
mkdir -p "$HOME/local/mongosh"
tar xf $File -C "$HOME/local/mongosh"
export PATH=$USER_LOCAL/mongosh/bin:$PATH
```

## 3. 封装 Systemd

**（1）创建 mongod 配置文件**

`/home/user/app_data/config/mongod.conf`

```yml
storage:
    dbPath: /home/user/data/mongodb
systemLog:
    destination: file
    path: /home/user/app_data/log/mongodb/mongodb.log
net:
    bindIp: 127.0.0.1
    port: 27017
```

**（2）创建 systemd 服务文件，写入以下内容**

`/etc/systemd/system/mongodb.service`

```ini
[Unit]
Description=MongoDB Database Server
After=network.target

[Service]
User=user
Group=user
ExecStart=/home/user/local/mongodb/bin/mongod --config /home/user/app_data/config/mongod.conf
ExecStop=/home/user/local/mongodb/bin/mongod --shutdown
Restart=always
RestartSec=10
StandardOutput=file:/home/user/app_data/log/mongodb/mongod.stdout.log
StandardError=file:/home/user/app_data/log/mongodb/mongod.stderr.log
SyslogIdentifier=mongodb

[Install]
WantedBy=multi-user.target
```

**（3）启用并启动服务**

```bash
sudo systemctl daemon-reload
sudo systemctl enable mongodb.service
sudo systemctl start mongodb
```

**（4）验证**

```bash
# 查看服务状态
sudo systemctl status mongodb
# 查看日志
journalctl -u mongodb -f
```

## 4. R.相关链接

https://www.mongodb.com/
