## 创建文件

```bash
mkdir wireguard && cd wireguard
```

目录文件结构如下

```
wireguard
├── Dockerfile
├── docker-compose.yml
└── scripts
    └── start.sh
```

**Dockerfile**

```dockerfile
FROM alpine:latest

RUN apk add --no-cache \
    iproute2 \
    iptables \
    wireguard-tools \
    && rm -rf /var/lib/apt/lists/*

COPY ./scripts/start.sh /app/start.sh
RUN chmod +x /app/start.sh

LABEL description="WireGuard VPN Server"
```

**docker-compose.yml**

```yml
name: wireguard

services:
    vpn-server:
        build: .
        container_name: wireguard-vpn-server
        cap_add:
            - NET_ADMIN
        ports:
            - "51820:51820/udp"
        volumes:
            - type: bind
              source: ${USER_LOCAL_CONFIG}/wireguard
              target: /app/config
              read_only: true
        restart: unless-stopped
        command: /app/start.sh
```

**scripts/start.sh**

```bash
#!/bin/bash

set -e

wg-quick up /app/config/server.conf

trap 'wg-quick down /app/config/server.conf; exit 0' SIGTERM

while :; do
    sleep 3600 &
    wait $!
done
```

## 启动服务

```bash
docker compose up --build
```
