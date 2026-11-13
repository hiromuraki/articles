---
title: "链接、图片与脚注"
category: "能力测试"
date: "2026-11-09"
tags: ["能力测试", "渲染"]
access: private
---

# 链接、图片与脚注

## 行内链接（带 title）

````md
[行内链接](https://example.com "悬停可看 title")
````

---

[行内链接](https://example.com "悬停可看 title")

## 引用式链接

````md
[引用式链接][ref]

[ref]: https://example.com/ref "引用式定义的 title"
````

---

[引用式链接][ref]

[ref]: https://example.com/ref "引用式定义的 title"

## 自动链接与裸链接

````md
<https://auto.example.com> 与裸写的 https://bare.example.com/path
````

---

<https://auto.example.com> 与裸写的 https://bare.example.com/path

## 标题 id 与页内锚点

````md
[跳到目标小节](#jump-target)

### 目标小节 {#jump-target}
````

---

[跳到目标小节](#jump-target)

### 目标小节 {#jump-target}

## 图片

````md
![本地 SVG](assets/test.svg "图片 title")
````

---

![本地 SVG](assets/test.svg "图片 title")

## 图片自动变成 figure（implicit_figures）

````md
![这段文字会变成 figcaption](assets/test.svg)
````

---

![这段文字会变成 figcaption](assets/test.svg)

## 脚注与行内脚注

````md
正文脚注[^n1]，以及行内脚注^[直接写在正文里]。

[^n1]: 文末定义，可含 `code` 与 **强调**。
````

---

正文脚注[^n1]，以及行内脚注^[直接写在正文里]。

[^n1]: 文末定义，可含 `code` 与 **强调**。
