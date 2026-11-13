---
title: "qmd / Pandoc 扩展语法"
category: "能力测试"
date: "2026-11-09"
tags: ["能力测试", "渲染"]
access: private
---

# qmd / Pandoc 扩展语法

## 通用 fenced div：分栏

````md
::: {.columns}
::: {.column width="48%"}
**左栏**：Pandoc 会把 `::: {.columns}` 变成 `<div class="columns">`。
:::
::: {.column width="48%"}
**右栏**：样式由样式表决定，结构由 pandoc 给。
:::
:::
````

---

::: {.columns}
::: {.column width="48%"}
**左栏**：Pandoc 会把 `::: {.columns}` 变成 `<div class="columns">`。
:::
::: {.column width="48%"}
**右栏**：样式由样式表决定，结构由 pandoc 给。
:::
:::

## callout：五种类型

````md
::: {.callout-note}
note：普通提示。
:::

::: {.callout-tip}
tip：技巧。
:::

::: {.callout-warning}
warning：警告。
:::

::: {.callout-important}
important：重要。
:::

::: {.callout-caution}
caution：谨慎。
:::
````

---

::: {.callout-note}
note：普通提示。
:::

::: {.callout-tip}
tip：技巧。
:::

::: {.callout-warning}
warning：警告。
:::

::: {.callout-important}
important：重要。
:::

::: {.callout-caution}
caution：谨慎。
:::

## callout 自定义标题

````md
::: {.callout-warning title="自定义标题"}
`title="..."` 会被写上 div 的 title 属性，样式表用 `::before` 取出来。
:::
````

---

::: {.callout-warning title="自定义标题"}
`title="..."` 会被写上 div 的 title 属性，样式表用 `::before` 取出来。
:::

## 标题属性 `{#id .class}`

````md
### 带 id 的标题 {#custom-id .my-class}
````

---

### 带 id 的标题 {#custom-id .my-class}

上面的标题在 HTML 里是 `<h3 id="custom-id" class="my-class">`，
所以可以用 `#custom-id` 直接跳转。

## raw html 块 `{=html}`

````md
```{=html}
<div style="padding:10px 14px;border:1px solid #8ef0c8;border-radius:8px;background:rgba(142,240,200,.14)">
  这段是原始 HTML，pandoc 原样透传。
</div>
```
````

---

```{=html}
<div style="padding:10px 14px;border:1px solid #8ef0c8;border-radius:8px;background:rgba(142,240,200,.14)">
  这段是原始 HTML，pandoc 原样透传。
</div>
```

## 非 HTML 的 raw 块会被丢弃

````md
```{=latex}
\textbf{这段在 HTML 输出里不会出现}
```
````

---

```{=latex}
\textbf{这段在 HTML 输出里不会出现}
```

（上面没有内容，因为目标是 HTML，`{=latex}` 块被丢弃——这正是我们想要的行为。）
