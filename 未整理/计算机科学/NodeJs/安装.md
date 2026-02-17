```bash
# https://nodejs.org/zh-cn/download

mkdir -p "$HOME/local/nodejs/24"

tar xf node-v*-linux-x64.tar.xz -C "$HOME/local/nodejs/24

export NODE_HOME=$HOME/local/nodejs/24
export PATH=$NODE_HOME/bin:$PATH
```

**安装 pnpm**

```bash
npm install -g pnpm
```
