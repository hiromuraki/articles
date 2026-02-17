[TOC]

## 1 环境准备

**安装编译工具**

```bash
sudo apt update
sudo apt install -y build-essential
sudo apt install -y cmake
sudo apt install -y pkg-config
sudo apt install -y gfortran
sudo apt install -y libopenblas-dev
sudo apt install -y libatlas-base-dev
```

**安装 Miniconda**

[Miniconda 安装指南](/计算机科学/miniconda.md)

**创建 Conda 虚拟环境**

```bash
source ~/miniconda/bin/activate
conda create -n flux_gym python=3.11 -y
conda activate flux_gym
```

## 2 拉取 FluxGym 并安装依赖

**拉取代码库**

```bash
git clone --depth=1 https://github.com/cocktailpeanut/fluxgym &&\
    cd fluxgym &&\
    git clone --depth=1 -b sd3 https://github.com/kohya-ss/sd-scripts
```
**初始化 uv 环境**

```bash
uv init --python 3.12 &&\
    cd sd-scripts &&\
        uv init --python 3.12
```

**安装依赖**

```bash
uv add --dev -r ./requirements.txt &&\
    uv add -r ../requirements.txt

pip install torch torchvision
```

**添加模型文件**

https://huggingface.co/cocktailpeanut/xulf-dev/tree/main

```bash
fluxgym/models/unet/flux1-dev.sft
fluxgym/models/vae/ae.sft
```

https://huggingface.co/comfyanonymous/flux_text_encoders/tree/main

```bash
fluxgym/models/clip/clip_l.safetensors
fluxgym/models/clip/t5xxl_fp16.safetensors
```

## 3 启动

**配置相关环境变量**

```bash
export HF_ENDPOINT=https://hf-mirror.com
export CUDA_VISIBLE_DEVICES=0
```

**启动主程序**

```bash
python app.py
```

成功启动后有类似如下的输出

```bash
Running on local URL:  http://127.0.0.1:7860
2025-11-08 13:41:16 INFO     HTTP Request: GET http://127.0.0.1:7860/startup-events "HTTP/1.1 200 OK"               _client.py:1025
                    INFO     HTTP Request: HEAD http://127.0.0.1:7860/ "HTTP/1.1 200 OK"                            _client.py:1025
```

之后即可通过 http://localhost:7860 访问 WebUI 开始训练 LoRA
