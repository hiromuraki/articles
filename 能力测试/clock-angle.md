---
category: "能力测试"
title: "时钟与角度"
date: "2026-11-08"
tags: ["时间", "数学", "角度", "钟表", "指针", "几何", "可视化", "交互", "小工具", "canvas", "svg", "动画", "练习题", "冷知识"]
access: private
---

# 时钟与角度

指针角度的推导，用来验证这个渲染管线对数学公式的支持程度。

行内公式：滑杆值 $t \in [0,\,86400)$，秒针角度为 $6^\circ (t \bmod 60)$。

## 三根指针

$$
\theta_h = 30^\circ\left(\frac{t}{3600} \bmod 12\right), \qquad
\theta_m = 6^\circ\left(\frac{t}{60} \bmod 60\right), \qquad
\theta_s = 6^\circ\left(t \bmod 60\right)
$$

多行对齐（这里最容易挂：`\\` 与 `&` 会跟 Markdown 语法打架）：

$$
\begin{aligned}
p &= \frac{t}{86400} \\
x &= c_x + r\cos\left(2\pi p - \tfrac{\pi}{2}\right) \\
y &= c_y + r\sin\left(2\pi p - \tfrac{\pi}{2}\right)
\end{aligned}
$$

分段与矩阵：

$$
\text{phase}(t)=
\begin{cases}
\text{night}, & 0 \le t < 5 \cdot 3600,\\
\text{day}, & 8 \cdot 3600 \le t < 17 \cdot 3600,\\
\text{night}, & 20 \cdot 3600 \le t < 86400.
\end{cases}
\qquad
M = \begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix}
$$

::: {.callout-note}
取模让时针在 24 小时里绕两圈，所以表盘只画 12 小时也得配一个 AM/PM 徽章或 24 小时外环[^why]。
:::

[^why]: 这是钟表设计上的老问题，24 小时制表盘（如某些航空表）用单圈解决，代价是一眼读时变慢。

## 数据

| 单位 | 角度 | 说明 |
| --- | --- | --- |
| 1 秒 | 6° | 秒针 |
| 1 分 | 6° | 分针 |
| 1 小时 | 30° | 时针 |
