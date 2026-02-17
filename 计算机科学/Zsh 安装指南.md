# Zsh 安装指南

## 1. 安装 Zsh

**安装 Zsh**：

- Apt

    ```bash
    apt install zsh
    ```

- Yum/Dnf

    ```bash
    dnf install zsh 
    ```

**设置为默认 shell**：

```bash
chsh -s $(which zsh)
```

## 2. 安装 oh-my-zsh

```bash
sh -c "$(wget -O- https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

或者

```bash
sh -c "$(wget -O- https://install.ohmyz.sh/)"
```

## 3. 安装 powerlevel10k

### 3.1. 安装 Nerd Font 字体（终端侧）

> 可选，如果需要使用复杂样式

<https://github.com/ryanoasis/nerd-fonts>
<https://github.com/romkatv/powerlevel10k>

安装字体后，根据终端情况自行设置终端字体
对于 Linux，将`MesloLGS NF*.ttf`放到`/usr/share/fonts`或`~/.fonts`

### 3.2. 安装 powerlevel10k（主机侧）

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k"
```

或者

```bash
git clone --depth=1 https://gitee.com/romkatv/powerlevel10k.git "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k"
```

**配置默认主题**：

编辑`~/.zshrc`文件，将`ZSH_THEME`的值修改为`powerlevel10k/powerlevel10k`

**载入配置文件**：

重启终端或使用`source ~/.zshrc`以重新载入配置，powerlevel10k 的配置向导应该就会出现

---

## 4. 相关连接

### 4.1. GitHub

1. [zsh](https://github.com/zsh-users/zsh)
2. [oh-my-zsh](https://github.com/ohmyzsh/ohmyzsh)
3. [powerlevel10k](https://github.com/romkatv/powerlevel10k)
4. [nerd-fonts](https://github.com/ryanoasis/nerd-fonts)
