---
title: "代码"
category: "能力测试"
date: "2026-11-09"
tags: ["能力测试", "渲染"]
access: private
---

# 代码

## 行内代码

````md
执行 `npm run build`，`<tag>` 与 `&` 都原样显示。
````

---

执行 `npm run build`，`<tag>` 与 `&` 都原样显示。

## 围栏代码块 + 语法高亮

````md
```python
def walk(root):
    yield from sorted(root.rglob("*.qmd"))
```
````

---

```python
def walk(root):
    yield from sorted(root.rglob("*.qmd"))
```

## 带属性的代码块（Pandoc 的 `{.python}` 写法）

````md
```{.python}
print("属性写法的代码块")
```
````

---

```{.python}
print("属性写法的代码块")
```

## 两种写法有什么区别

上面两段生成的 HTML **完全一样**（逐字节相同），所以高亮效果也相同。
看到 `print` 颜色和 `def` 不同，那是 token 类型不同（内置函数 vs 关键字），不是两种写法的差异。

区别只在于：花括号写法可以带属性。要行号、要锚点、要额外类名时就必须用它：

````md
```{#sample-code .python .numberLines}
print("带行号的代码块")
```
````

---

```{#sample-code .python .numberLines}
print("带行号的代码块")
```

`.numberLines` 触发行号，`#sample-code` 成为可跳转的锚点，`.python` 照旧决定高亮。

## 缩进式代码块

````md
四个空格开头就是代码：

    let indented = true;
````

---

四个空格开头就是代码：

    let indented = true;

## 无语言代码块

````md
```
纯文本，不做高亮
```
````

---

```
纯文本，不做高亮
```

## 代码里的特殊字符

````md
```js
const html = `<div class="${name}">`;
const backtick = "```";  // 不会被当成围栏
```
````

---

```js
const html = `<div class="${name}">`;
const backtick = "```";  // 不会被当成围栏
```
