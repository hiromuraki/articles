[TOC]

## 1 通用部分

### 1.1 文件清单

```bash
./main.py
./sample.txt
```

sample.txt

```
哈基米的哈基是那没录多，那没录多是一个固定词组，没有特定含义，具体含义视具体而定
```

### 1.2 前置代码

```python
from langchain_core.embeddings import Embeddings
from langchain_core.document_loaders import BaseLoader
from langchain_text_splitters import TextSplitter
from langchain_core.vectorstores import VectorStore
from langchain_core.language_models import BaseChatModel
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough


def create_embeddings() -> Embeddings:
    ...


def create_text_loader(file_path: str) -> BaseLoader:
    ...


def create_text_splitter() -> TextSplitter:
    ...


def create_vector_store(embeddings: Embeddings) -> VectorStore:
    ...


def create_chat_model() -> BaseChatModel:
    ...


def create_chat_prompt_template() -> ChatPromptTemplate:
    ...


embeddings = create_embeddings()
vector_store = create_vector_store(embeddings)
docs = create_text_loader(R"./sample.txt").load()
texts = create_text_splitter().split_documents(docs)
doc_ids = vector_store.add_documents(texts)
chat_model = create_chat_model()
prompt = create_chat_prompt_template()
```

### 1.3 组件构建

#### 1.3.1 嵌入模型

**BAAI/bge-smal-zh-v1.5**

```python
def create_embeddings() -> Embeddings:
    from langchain_huggingface import HuggingFaceEmbeddings
    return HuggingFaceEmbeddings(
        model_name="/home/user/downloads/bge-small-zh-v1.5",
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True}
    )
```

常用开源嵌入模型

1. BAAI/bge-small-zh-v1.5
2. BAAI/bge-large-zh-v1.5
3. BAAI/bge-small-en-v1.5
4. nomic-ai/nomic-embed-text-v1

#### 1.3.2 文本加载器

**TextLoader**

```python
def create_text_loader(file_path: str) -> BaseLoader:
    from langchain_community.document_loaders import TextLoader
    return TextLoader(file_path)
```

**NotebookLoader**

```python
def create_text_loader(file_path: str) -> BaseLoader:
    from langchain_community.document_loaders import NotebookLoader
    return NotebookLoader(
        file_path,
        include_outputs=False,
        max_output_length=20,
        remove_newline=True,
    )
```

常用文本加载器

1. UnstructuredMarkdownLoader
2. Docx2txtLoader
3. PyPDFLoader
4. NotebookLoader

#### 1.3.3 文本切分器

**RecursiveCharacterTextSplitter**

```python
def create_text_splitter() -> TextSplitter:
    from langchain_text_splitters import RecursiveCharacterTextSplitter
    return RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
```

常用文本切分器

1. RecursiveCharacterTextSplitter
2. MarkdownTextSplitter
3. MarkdownHeaderTextSplitter
4. TextSplitter

#### 1.3.4 向量存储库

**内存存储**

```python
def create_vector_store(embeddings: Embeddings) -> VectorStore:
    from langchain_core.vectorstores import InMemoryVectorStore
    vector_store = InMemoryVectorStore(embeddings)
    return vector_store
```

**Chroma**

```bash
pip install langchain-chroma
```

```python
def create_vector_store(embeddings: Embeddings) -> VectorStore:
    from langchain_chroma import Chroma
    return Chroma(
        embedding_function=embeddings,
        persist_directory="./chroma_db"
    )
```

#### 1.3.5 聊天模型

**Ollama**

```bash
pip install langchain-ollama
```

```python

def create_chat_model() -> BaseChatModel:
    from langchain_ollama import ChatOllama
    return ChatOllama(base_url="http://localhost:11434", model="qwen3:8b")
```

**DeepSeek**

```bash
pip install langchain-deepseek
```

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

#### 1.3.6 提示词模板

```python
def create_chat_prompt_template() -> ChatPromptTemplate:
    return ChatPromptTemplate.from_template(
        """请结合以下上下文回答我的问题。如果无法从中得到答案且你也无法给出正确的回答，请诚实地说你不知道。
        上下文：
        {context}

        问题：
        {input}

        请用中文提供有帮助的答案："""
    )
```

## 2 通过 LCEL 构建

### 2.1 简单响应

```python
rag_chain = (
    {
        "context": vector_store.as_retriever(),
        "input": RunnablePassthrough(),
    }
    | prompt
    | chat_model
    | StrOutputParser()
)

for chunk in rag_chain.stream("哈基米的哈基是什么？"):
    print(chunk, end="", flush=True)
```

### 2.2 带独立上下文的响应

```python
from langchain_core.documents.base import Document

def format_docs(docs: list[Document]) -> str:
    return "\n\n".join(doc.page_content for doc in docs)

rag_chain = (
    {
        "context": lambda x: format_docs(x["context"]),
        "input": lambda x: x["input"],
    }
    | prompt
    | chat_model
    | StrOutputParser()
)
retrieved_docs = (lambda x: x["input"]) | vector_store.as_retriever()
chain = (
    RunnablePassthrough()
    .assign(context=retrieved_docs)
    .assign(answer=rag_chain)
)

for chunk in chain.stream({"input": "哈基米的哈基是什么？"}):
    if "input" in chunk:
        print("INPUT")
        print(chunk["input"])
        print()
    elif "context" in chunk:
        print("CONTEXT")
        print(chunk["context"])
        print()
    elif "answer" in chunk:
        if chunk["answer"] == "":
            print(".", end="", flush=True)
        else:
            print(chunk["answer"], end="", flush=True)
```

## 3 通过 Agent 构建

### 3.1 使用 Agent 工具构建

```python
from langchain.tools import tool
from langchain.agents import create_agent

@tool(response_format="content_and_artifact")
def retrieve_context(query: str):
    """Retrieve information to help answer a query"""
    retrieved_docs = vector_store.similarity_search(query, k=2)
    serialized = "\n\n".join(
        (f"Source: {doc.metadata}\nContent:{doc.page_content}")
        for doc in retrieved_docs
    )
    return serialized, retrieved_docs

system_prompt = (
    "你现在可以使用工具从资料库中检索以协助回答问题，使用该检索工具以回答问题"
)
agent = create_agent(
    model=chat_model,
    tools=[retrieve_context],
    system_prompt=system_prompt
)
response = agent.stream(
    {
        "messages": [
            {
                "role": "user",
                "content": "哈基米的哈基是什么？"
            }
        ]
    },
    stream_mode="values",
)

for event in response:
    event["messages"][-1].pretty_print()
```

### 3.2 使用动态提示词构建

```python
from langchain.agents import create_agent
from langchain.agents.middleware import dynamic_prompt, ModelRequest

@dynamic_prompt
def prompt_with_context(request: ModelRequest) -> str:
    last_query = request.state["messages"][-1].text
    retrieved_docs = vector_store.similarity_search(last_query)
    context = "\n\n".join(doc.page_content for doc in retrieved_docs)

    system_message = (
        "请根据以下上下文回答我的问题。如果无法从中得到答案，请诚实地说你不知道。"
        f"\n\n{context}"
    )

    return system_message


agent = create_agent(
    model=chat_model,
    tools=[],
    middleware=[prompt_with_context]
)

response = agent.stream(
    {
        "messages": [
            {
                "role": "user",
                "content": "哈基米的哈基是什么？"
            }
        ]
    },
    stream_mode="values",
)
for event in response:
    event["messages"][-1].pretty_print()
```

### 3.3 使用中间件构建

```python
from typing import Any
from langchain_core.documents import Document
from langchain.agents.middleware import AgentMiddleware, AgentState
from langchain.agents import create_agent

class State(AgentState):
    context: list[Document]

class RetrieveDocumentsMiddleware(AgentMiddleware[State]):
    state_schema = State

    def before_model(self, state: State, runtime: Runtime[None]) -> dict[str, Any] | None:
        last_message = state["messages"][-1]
        retrieved_docs = vector_store.similarity_search(last_message.text)

        docs_content = "\n\n".join(doc.page_content for doc in retrieved_docs)

        augmented_message_content = (
            "请根据以下上下文回答我的问题。如果无法从中得到答案，请诚实地说你不知道。\n"
            "\n"
            "上下文：\n"
            f"{docs_content}\n"
            "\n"
            "\n"
            "问题：\n"
            f"{last_message.text}\n"
        )

        return {
            "messages": [last_message.model_copy(update={
                "content": augmented_message_content
            })],
            "context": retrieved_docs,
        }

agent = create_agent(
    model=chat_model,
    tools=[],
    middleware=[RetrieveDocumentsMiddleware()]
)

response = agent.stream(
    {
        "messages": [
            {
                "role": "user",
                "content": "哈基米的哈基是什么？"
            }
        ]
    },
    stream_mode="values",
)
for event in response:
    event["messages"][-1].pretty_print()
```
