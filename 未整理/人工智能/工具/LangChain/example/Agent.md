## 创建基础智能体

```python
from langchain_ollama import ChatOllama
from langchain.agents import create_agent

chat_model = ChatOllama(
    base_url="http://localhost:11434",
    model="qwen3:8b"
)

agent = create_agent(
    model=chat_model,
)

response = agent.stream(
    {
        "messages": [
            {
                "role": "user",
                "content": "你好",
            }
        ]
    },
    stream_mode="values"
)

for event in response:
    event["messages"][-1].pretty_print()
```

## 创建可使用自定义工具的 Agent

```python
from langchain_ollama import ChatOllama
from langchain.agents import create_agent
from langchain.tools import tool
from datetime import datetime


@tool
def get_current_datetime(query: str) -> str:
    """Get current datetime"""
    return str(datetime.now())


chat_model = ChatOllama(
    base_url="http://localhost:11434",
    model="qwen3:8b"
)

agent = create_agent(
    model=chat_model,
    tools=[get_current_datetime],
)

response = agent.stream(
    {
        "messages": [
            {
                "role": "user",
                "content": "报告一下当前日期",
            }
        ]
    },
    stream_mode="values"
)

for event in response:
    event["messages"][-1].pretty_print()
```
