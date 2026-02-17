# Linux MySql 部署指南

## 1. 安装 MySql

```bash
sudo apt install mysql-server
```

## 2. 配置

### 2.1. 设置 root 密码

直接登录 mysql

```bash
sudo mysql
```

执行以下 Sql 语句，将 root 用户的密码修改为 new_password

```bash
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
EXIT;
```
