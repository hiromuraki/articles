---
title: "仍不支持的部分"
category: "能力测试"
date: "2026-11-09"
tags: ["能力测试", "渲染"]
access: private
---

# 仍不支持的部分

这些是 **Quarto 层**（及其 Lua filters）的能力，pandoc 单独不提供。
库里不会渲染失败，只是退化成普通文字或代码——认清边界即可。

## shortcode `{{< ... >}}`

````md
{{< video https://example.com/a.mp4 >}}
````

---

{{< video https://example.com/a.mp4 >}}

## 交叉引用 `@fig-` / `@eq-`

````md
见 @fig-sample 与 @eq-pythagoras。
````

---

见 @fig-sample 与 @eq-pythagoras。

（pandoc 把它们识别成 citation 占位，但没有编号系统，视觉上就是原文。）

## 文献引用 `[@doe2020]`

````md
文献引用 [@doe2020] 需要 `--citeproc` 和 `.bib` 文件才有编号与文献表。
````

---

文献引用 [@doe2020] 需要 `--citeproc` 和 `.bib` 文件才有编号与文献表。

## chunk 选项 `#|`

````md
```{python}
#| echo: false
print("这行在 Quarto 里会被执行，这里只是代码")
```
````

---

```{python}
#| echo: false
print("这行在 Quarto 里会被执行，这里只是代码")
```

## emoji 短代码

````md
:smile: :warning: :rocket:
````

---

:smile: :warning: :rocket:

## 缩写定义 `*[HTML]:`

````md
*[HTML]: HyperText Markup Language

The HTML spec.
````

---

*[HTML]: HyperText Markup Language

The HTML spec.

## 可折叠 callout `collapse="true"`

````md
::: {.callout-note collapse="true"}
Quarto 会把它做成可折叠的 details，这里只是普通 callout。
:::
````

---

::: {.callout-note collapse="true"}
Quarto 会把它做成可折叠的 details，这里只是普通 callout。
:::

## 代码执行

````md
```{r}
summary(cars)
```
````

---

```{r}
summary(cars)
```

（浏览器里没有 R/Python 内核；就算有 pandoc 也不执行。执行属于 Quarto 的引擎层。）

## 小结

| 缺口 | 补法 |
| --- | --- |
| 交叉引用 / 文献编号 | 加 `pandoc-crossref` 或 `--citeproc` |
| shortcode / chunk 选项 / 折叠 callout | 只能上 Quarto |
| emoji / 缩写 | 不常用，写全称即可 |
