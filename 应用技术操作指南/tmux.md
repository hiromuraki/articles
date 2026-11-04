## 安装

```bash
sudo apt install tmux
```

## 基本操作

**创建会话**

```bash
tmux new -s session_name
```

**查看运行中的会话**

```bash
tmux ls
```

**分离（detach）会话**
按下 Ctrl + B 后再按 D

**重新链接会话**

```bash
tmux attach -t session_name
```

**关闭会话**

```bash
tmux kill-session -t session_name
```

或直接在会话中使用`exit`命令或 Ctrl + D 快捷键
