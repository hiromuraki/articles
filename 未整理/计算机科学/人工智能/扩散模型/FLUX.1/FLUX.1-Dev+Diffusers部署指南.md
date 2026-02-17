# FLUX.1-Dev 部署指南（Diffusers）

[TOC]

## 1 环境准备

安装 Miniconda：

[Miniconda 安装指南](/计算机科学/miniconda.md)

创建 Conda 虚拟环境：

```bash
source ~/miniconda/bin/activate
conda create -n flux_diffusers python=3.13 -y
conda activate flux_diffusers
```

## 2 安装 diffusers 与相关依赖

```bash
pip install torch
pip install torchvision
pip install transformers
pip install accelerate
pip install diffusers
pip install protobuf
pip install sentencepiece
pip install peft
```

## 3 下载 FLUX.1-Dev 模型

使用如下命令拉取 FLUX.1-DEV 模型

```bash
hf download black-forest-labs/FLUX.1-Fill-dev --local-dir ./flux-dev-model
```

并非仓库内的所有文件都需要拉取，实际所需的文件树如下

```bash
flux.1-dev
├── scheduler
│  └── scheduler_config.json
├── text_encoder
│  ├── config.json
│  └── model.safetensors
├── text_encoder_2
│  ├── config.json
│  ├── model-00001-of-00002.safetensors
│  ├── model-00002-of-00002.safetensors
│  └── model.safetensors.index.json
├── tokenizer
│  ├── merges.txt
│  ├── special_tokens_map.json
│  ├── tokenizer_config.json
│  └── vocab.json
├── tokenizer_2
│  ├── special_tokens_map.json
│  ├── spiece.model
│  ├── tokenizer.json
│  └── tokenizer_config.json
├── transformer
│  ├── config.json
│  ├── diffusion_pytorch_model-00001-of-00003.safetensors
│  ├── diffusion_pytorch_model-00002-of-00003.safetensors
│  ├── diffusion_pytorch_model-00003-of-00003.safetensors
│  └── diffusion_pytorch_model.safetensors.index.json
├── vae
│  ├── config.json
│  └── diffusion_pytorch_model.safetensors
└── model_index.json
```

**注 1**：该命令涉及到从 Hugging Face 中拉取 FLUX.1 Dev 的模型，需要下载大约 60GB 的文件，因此在执行前请先确保网络可以稳定访问 Hugging Face。或者，可以通过设置 HF_ENDPOINT 环境变量切换到 hf-mirror 镜像源

```bash
export HF_ENDPOINT=https://hf-mirror.com
```

**注 2**：如果在下载时候遇到了类似如下的报错

> Access to model black-forest-labs/FLUX.1-Redux-dev is restricted and you are not in the authorized list. Visit <https://huggingface.co/black-forest-labs/FLUX.1-Redux-dev> to ask for access.

这是因为访问 FLUX 的仓库需要授权过的 Hugging Face 账号，你可以使用可访问 FLUX 仓库的 Hugging Face 账号的 AccessToken 来解决此问题。请执行如下命令进入 Hugging Face AccessToken 设置向导，根据向导设置你的 AccessToken

```bash
hf auth login
```

## 4 创建运行脚本

`main.py`

```python
import torch
from diffusers.pipelines.flux.pipeline_flux import FluxPipeline


def create_flux_pipe() -> FluxPipeline:
    pipe = FluxPipeline.from_pretrained(
        "./flux-dev-model",
        torch_dtype=torch.float8_e4m3fn,
        local_files_only=True)
    pipe.enable_model_cpu_offload()
    return pipe


pipe = create_flux_pipe()
prompt = "A cat holding a sign that says hello world"
image = pipe(
    prompt,
    height=1024,
    width=1024,
    guidance_scale=3.5,
    num_inference_steps=50,
    max_sequence_length=512,
    generator=torch.Generator("cpu").manual_seed(0)
).images[0]
image.save("flux-dev.png")
```

使用 python main\.py 运行脚本并等待执行完成，若成功执行完成，脚本的同目录下应该生成一张名为 flux-dev.png 的图像，图像内容为一只猫举着一个写着 hello world 的牌子。
