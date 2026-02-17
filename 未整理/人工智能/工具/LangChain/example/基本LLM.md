## 通用部分

```python
from langchain_core.language_models import BaseChatModel

def create_cheat_model() -> BaseChatModel:
    ...

# 非流式输出
answer = chat_model.invoke("hello")
print(answer)

# 流式输出
for chunk in chat_model.stream("hello"):
    print(chunk, end="", flush=True)
```

## 使用 Ollama 创建本地 LLM

**安装 Ollama 工具包**

```bash
pip install langchain-ollama
```

**创建**

```python
def create_cheat_model() -> BaseChatModel:
    return ChatOllama(
        base_url="http://localhost:11434",
        model="qwen3:8b",
    )
```

## 使用 DeepSeek API 创建 LLM

**安装 DeepSeek 工具包**

```bash
pip install langchain-deepseek
```

**创建**

```python
def create_chat_model() -> BaseChatModel:
    from langchain_deepseek import ChatDeepSeek
    import os
    os.environ["DEEPSEEK_API_KEY"] = "DEEPSEEK_API_KEY"

    return ChatDeepSeek(
        model="deepseek-chat",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
    )
```
